import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from app.core.vector_store import BISVectorStore
from app.core.llm_agent import BISLLMAgent

router = APIRouter()
vector_store = BISVectorStore()
llm_agent = BISLLMAgent()

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
            top_metadata = context_chunks[0].get("metadata", {})
            filename = top_metadata.get("filename")
            page_number = top_metadata.get("page_number")
            
            if filename and page_number:
                yield {
                    "event": "source",
                    "data": json.dumps({
                        "filename": filename,
                        "page_number": page_number
                    })
                }
        
        # 2. Stream the actual LLM text tokens as standard "message" events
        async for chunk in llm_agent.generate_stream(request.query, context_chunks):
            yield {
                "event": "message",
                "data": chunk
            }

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