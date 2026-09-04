import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from app.core.vector_store import BISVectorStore
from app.core.llm_agent import BISLLMAgent

router = APIRouter()
vector_store = BISVectorStore()
llm_agent = BISLLMAgent()

# Junk that gets embedded in BIS PDFs (per-download watermark, price group, IPs,
# the "Free Standard provided by BIS" banner). Stripped before we build the
# phrase the PDF viewer searches for, so the highlight lands on real clause text.
_WATERMARK_RE = re.compile(
    r"(Free Standard provided by BIS.*?Edge"
    r"|[A-Za-z]+\([^)]*@[^)]*\)"                       # City(email) download watermark
    r"|\b\d{1,3}(?:\.\d{1,3}){3}\b"                     # IP address
    r"|[\w.+-]+@[\w-]+\.[\w.-]+"                        # bare email
    r"|Price Group\s+\d+"
    r"|Page\s*\|\s*\d+"
    r"|PM/\s*IS[\s\w()./-]*?\b(?:19|20)\d{2}\b"        # product-manual running header
    r"|PRODUCT MANUAL FOR)",
    re.IGNORECASE,
)


def build_anchor_phrase(content: str, clause_id: str = "") -> str:
    """
    Turn a retrieved clause chunk into a short, distinctive phrase that the
    PDF.js find-controller can locate on the page (→ correct line / table).
    """
    text = _WATERMARK_RE.sub(" ", content or "")
    # Drop a leading clause number ("3.1 ", "Clause 8.2 ", "Section 4 ")
    text = re.sub(r"^\s*(?:Clause|Section)?\s*\d+(?:\.\d+)*\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    words = [w for w in text.split(" ") if w]
    # ~10 words: distinctive enough to be unique on the page, short enough that
    # minor whitespace/hyphenation differences vs the raw PDF text don't break
    # the viewer's phrase match (the viewer also retries with fewer words).
    phrase = " ".join(words[:10]).strip(" .,:;-—")
    if len(phrase) >= 8:
        return phrase
    # Fallback: the clause id itself is still a useful jump target
    return (clause_id or text[:80]).strip()

class ChatRequest(BaseModel):
    query: str
    session_id: str = "default"

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Receives a query, fetches relevant clauses from ChromaDB, 
    and streams the AI response back to the client.
    """
    try:
        context_chunks = vector_store.search(request.query, top_k=8)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database search failed: {str(e)}")

    # Create a custom generator to intercept the stream and inject the source metadata
    async def event_generator():
        # 1. Send the top source metadata as a custom "source" event
        if context_chunks and len(context_chunks) > 0:
            top_chunk = context_chunks[0]
            top_metadata = top_chunk.get("metadata", {})
            filename = top_metadata.get("filename")
            page_number = top_metadata.get("page_number")

            if filename and page_number:
                yield {
                    "event": "source",
                    "data": json.dumps({
                        "filename": filename,
                        "page_number": page_number,
                        "standard_id": top_metadata.get("standard_id"),
                        "clause_id": top_metadata.get("clause_id"),
                        # phrase for the PDF viewer to search + highlight
                        "search": build_anchor_phrase(
                            top_chunk.get("content", ""),
                            str(top_metadata.get("clause_id", "")),
                        ),
                    })
                }
        
        # 2. Stream the actual LLM text tokens
        async for chunk in llm_agent.generate_stream(request.query, context_chunks):
            yield chunk

    return EventSourceResponse(event_generator())


class SearchRequest(BaseModel):
    query: str
    top_k: int = 8

@router.post("/search")
async def search_documents(request: SearchRequest):
    try:
        results = vector_store.search(request.query, top_k=request.top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))