from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

# Initialize the FastAPI application with professional documentation tags
app = FastAPI(
    title="BIS Intelligent Assistant API",
    description="RAG Backend for Indian Standards and BIS Services",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
# This is critical. Without it, your React frontend (running on port 5173) 
# will be blocked from accessing this backend (running on port 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon dev, allow all. In production, restrict to your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the endpoints we created in routes.py under the "/api" prefix
app.include_router(api_router, prefix="/api")

# A simple root endpoint to verify the server is alive
@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online", 
        "message": "BIS Intelligent Assistant API is running successfully."
    }