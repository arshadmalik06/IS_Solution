"""
voice_routes.py — FastAPI router exposing voice endpoints.

  POST /voice/stt   — Multipart audio upload → transcription JSON
  POST /voice/tts   — JSON text → streamed MP3 audio

All logic is delegated to stt_service and tts_service; this file only handles
HTTP concerns.
"""
import os
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.voice.stt_service import transcribe_audio
from app.voice.tts_service import generate_tts_audio

router = APIRouter(prefix="/voice", tags=["Voice"])


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _delete_file(path: str) -> None:
    """Background cleanup task."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        pass


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    """
    Receive a browser audio recording (webm/wav/ogg) and return the
    transcribed text along with the detected language.

    Response:
        {
            "text": "...",
            "language": "hi" | "en" | ...,
            "language_probability": 0.98
        }
    """
    if not audio.content_type or not audio.content_type.startswith("audio"):
        # Accept anything — browsers sometimes send 'application/octet-stream'
        pass

    result = transcribe_audio(audio)
    return result


class TTSRequest(BaseModel):
    text: str
    language: str = "en"   # hint; tts_service auto-detects Hindi from script


@router.post("/tts")
async def text_to_speech(request: TTSRequest, background_tasks: BackgroundTasks):
    """
    Synthesise speech for the provided text and stream it back as MP3.

    The temporary file is cleaned up in a background task after the response
    has been sent.
    """
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty")

    audio_path = await generate_tts_audio(request.text, request.language)
    background_tasks.add_task(_delete_file, audio_path)

    return FileResponse(
        audio_path,
        media_type="audio/mpeg",
        filename="response.mp3",
    )
