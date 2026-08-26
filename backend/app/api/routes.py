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

@router.post("/api/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Receives a query, fetches relevant clauses from ChromaDB, 
    and streams the AI response back to the client.
    """
    try:
        # FIX: vector_store.search() returns a List directly, no need for .get()
        context_chunks = vector_store.search(request.query, top_k=3)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database search failed: {str(e)}")

    return EventSourceResponse(llm_agent.generate_stream(request.query, context_chunks))


class SearchRequest(BaseModel):
    query: str
    top_k: int = 3

@router.post("/api/search")
async def search_documents(request: SearchRequest):
    try:
        results = vector_store.search(request.query, top_k=request.top_k)
        # Wrap it in a dictionary here for a clean JSON response in Swagger
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))