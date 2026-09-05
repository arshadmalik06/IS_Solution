import json
import re
import uuid
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from app.core.vector_store import BISVectorStore
from app.core.llm_agent import BISLLMAgent

router = APIRouter()
vector_store = BISVectorStore()
llm_agent = BISLLMAgent()

# EXISTING CHAT & SEARCH ROUTES (UNTOUCHED)
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

# NEW: COMPLIANCE CHECKLIST MODULE

# 1. Pydantic Models representing the exact data contract
class ChecklistRequest(BaseModel):
    product: str
    intended_use: str

class ChecklistItem(BaseModel):
    id: str
    category: str
    task: str
    description: str
    reference_clause: str

class ChecklistResponse(BaseModel):
    product_name: str
    applicable_standard: str
    items: List[ChecklistItem]


def extract_json_from_llm_response(text: str) -> dict:
    """Bulletproof JSON extractor to strip markdown and conversational hallucinations."""
    cleaned_text = re.sub(r'```(?:json)?', '', text).strip()
    cleaned_text = re.sub(r'```', '', cleaned_text).strip()
    
    # Isolate the core JSON object {} in case the LLM typed something before/after
    start = cleaned_text.find('{')
    end = cleaned_text.rfind('}')
    if start != -1 and end != -1:
        cleaned_text = cleaned_text[start:end+1]
        
    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM output into JSON. Raw output: {text}")


@router.post("/checklist/generate", response_model=ChecklistResponse)
async def generate_compliance_checklist(request: ChecklistRequest):
    try:
        # 1. Targeted Vector Search
        search_query = f"BIS compliance testing documentation certification steps for {request.product} used for {request.intended_use}"
        context_chunks = vector_store.search(search_query, top_k=6)
        
        # 2. Strict Prompt for JSON Output
        prompt = f"""
        Generate a BIS compliance checklist for the following product based ONLY on the provided context.
        Product: {request.product}
        Intended Use: {request.intended_use}
        
        CRITICAL INSTRUCTION: You MUST output ONLY valid JSON. Do not include any greetings, conversational text, or explanations. 
        The JSON must strictly follow this exact structure:
        {{
            "product_name": "{request.product}",
            "applicable_standard": "IS XXXX:YYYY (or 'General BIS Guidelines')",
            "items": [
                {{
                    "category": "Documentation", 
                    "task": "Name of the task",
                    "description": "Brief instruction on what needs to be done",
                    "reference_clause": "IS standard and clause number"
                }}
            ]
        }}
        """
        
        # 3. Aggregate the Streamed Response
        # Since your agent uses streaming, we aggressively capture the raw text tokens to build a complete string
        full_response = ""
        async for chunk in llm_agent.generate_stream(prompt, context_chunks):
            if isinstance(chunk, dict):
                # Extracts from dict if llm yields raw python dictionaries
                if "token" in chunk:
                    full_response += str(chunk["token"])
                elif "data" in chunk:
                    full_response += str(chunk["data"])
            elif isinstance(chunk, str):
                try:
                    # Extracts from stringified JSON if event_generator wraps it
                    parsed_chunk = json.loads(chunk)
                    if "token" in parsed_chunk:
                        full_response += str(parsed_chunk["token"])
                    elif "data" in parsed_chunk:
                        full_response += str(parsed_chunk["data"])
                    else:
                        full_response += chunk
                except json.JSONDecodeError:
                    full_response += chunk

        # 4. Clean, Parse, and Validate
        parsed_json = extract_json_from_llm_response(full_response)
        
        # 5. Inject UUIDs for the frontend React keys
        for item in parsed_json.get("items", []):
            item["id"] = str(uuid.uuid4()) 
        # Returning the dictionary automatically validates it against ChecklistResponse 
        # and serializes it cleanly for your frontend teammate
        return parsed_json
        
    except ValueError as ve:
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checklist generation failed: {str(e)}")