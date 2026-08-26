import json
import requests
from fastapi import APIRouter, HTTPException, Depends
from sse_starlette.sse import EventSourceResponse
from app.api.models import ChatRequest, SearchRequest, SearchResponse
from app.core.vector_store import BISVectorStore

# Initialize the FastAPI router
router = APIRouter()

def get_db() -> BISVectorStore:
    """Dependency injection for the Vector Database."""
    return BISVectorStore()

def generate_llm_stream(prompt: str):
    """Connects to the local Ollama instance and yields tokens for streaming."""
    ollama_url = "http://localhost:11434/api/generate"
    payload = {
        "model": "qwen2.5:7b-instruct",
        "prompt": prompt,
        "stream": True
    }
    
    try:
        with requests.post(ollama_url, json=payload, stream=True) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    data = json.loads(decoded_line)
                    
                    # Yield data in the Server-Sent Events (SSE) format
                    yield f"data: {json.dumps({'token': data.get('response', '')})}\n\n"
                    
                    if data.get("done"):
                        break
    except requests.exceptions.RequestException as e:
        yield f"data: {json.dumps({'token': f'\\n\\n**[System Error]** Could not connect to local LLM: {str(e)}'})}\n\n"

@router.post("/chat/stream", summary="Stream RAG Response")
async def chat_stream(request: ChatRequest, db: BISVectorStore = Depends(get_db)):
    """Main endpoint for the AI Chatbot."""
    try:
        # 1. Retrieve the top 3 most relevant legal clauses
        context_results = db.search(request.query, top_k=3)
        
        # 2. Compile the retrieved clauses into a context block
        context_text = ""
        for res in context_results:
            meta = res['metadata']
            context_text += f"\n[Source: {meta.get('standard_id', 'Unknown')}, Clause: {meta.get('clause_id', 'N/A')}]\n{res.get('content', '')}\n"

        # 3. Build the strict Guardrail Prompt
        system_prompt = f"""You are the official Bureau of Indian Standards (BIS) Technical Assistant.
Answer the user query strictly using the following retrieved legal context.

CONTEXT:
{context_text}

RULES:
1. If the context does not contain the answer, reply exactly with: "The available BIS documentation does not contain this specific rule."
2. You MUST cite the source at the end of every claim (e.g. 'Source: IS 10500, Clause 3.1').

USER QUERY: {request.query}
"""
        
        # 4. Stream the response back to the client
        return EventSourceResponse(generate_llm_stream(system_prompt))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", response_model=SearchResponse, summary="Direct Vector DB Search")
async def search_documents(request: SearchRequest, db: BISVectorStore = Depends(get_db)):
    """A helpful endpoint for debugging the RAG retrieval without invoking the LLM."""
    try:
        results = db.search(request.query, top_k=request.top_k)
        return SearchResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))