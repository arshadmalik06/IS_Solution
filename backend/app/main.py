import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import router as api_router

# Voice router is optional: if the STT/TTS dependencies (faster-whisper, edge-tts)
# are not installed, the rest of the API must still start normally.
try:
    from app.voice.voice_routes import router as voice_router
    _VOICE_AVAILABLE = True
except Exception as _voice_import_error:  # pragma: no cover - defensive
    voice_router = None
    _VOICE_AVAILABLE = False
    print(f"[Voice] Disabled - failed to load voice module: {_voice_import_error}")

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

# Mount the static directory for serving raw BIS PDFs
# Notice the path: since main.py is inside /app, we go to "data/raw_pdfs"
pdf_directory = os.path.join(os.path.dirname(__file__), "data", "raw_pdfs")
app.mount("/static/pdfs", StaticFiles(directory=pdf_directory), name="pdfs")

# Register the endpoints we created in routes.py under the "/api" prefix
app.include_router(api_router, prefix="/api")

# Register the voice endpoints (STT/TTS) under "/api" as well.
# voice_routes defines its own "/voice" prefix, so the final paths are
# "/api/voice/stt" and "/api/voice/tts" - matching what the frontend calls.
if _VOICE_AVAILABLE and voice_router is not None:
    app.include_router(voice_router, prefix="/api")

# A simple root endpoint to verify the server is alive
@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online", 
        "message": "BIS Intelligent Assistant API is running successfully."
    }