from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    """Schema for incoming user chat queries."""
    query: str = Field(
        ..., 
        min_length=2, 
        description="The user's query about BIS standards."
    )
    session_id: Optional[str] = Field(
        default=None, 
        description="Optional ID for tracking conversation history."
    )

class SearchRequest(BaseModel):
    """Schema for testing the vector database directly."""
    query: str = Field(..., description="The text to search within the BIS documents.")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of results to retrieve.")

class SearchResultItem(BaseModel):
    """Schema for a single retrieved legal clause."""
    content: str
    metadata: Dict[str, Any]

class SearchResponse(BaseModel):
    """Schema for returning search results."""
    results: List[SearchResultItem]