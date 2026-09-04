"""
stt_service.py — Speech-to-Text using faster-whisper (local, CPU, int8).

Handles audio file transcription and language detection (Hindi or English).
Model is loaded once at module startup for low latency on subsequent requests.
"""
import os
import tempfile
from fastapi import UploadFile
from faster_whisper import WhisperModel

# ---------------------------------------------------------------------------
# Model initialisation — runs once when the module is first imported.
# medium model: good Hindi/English accuracy, reasonable CPU speed (~1-3s/clip)
# ---------------------------------------------------------------------------
print("[STT] Loading faster-whisper model (medium, CPU, int8)…")
_model = WhisperModel("medium", device="cpu", compute_type="int8")
print("[STT] Model ready.")


def transcribe_audio(audio_file: UploadFile) -> dict:
    """
    Transcribe an uploaded audio file with faster-whisper.

    Returns:
        dict with keys:
            - text (str): transcribed text
            - language (str): detected language code ('hi' or 'en', etc.)
            - language_probability (float): confidence in detected language
    """
    # Detect file extension (keep original so ffmpeg inside whisper handles it)
    suffix = ".webm"
    if audio_file.filename:
        _, ext = os.path.splitext(audio_file.filename)
        if ext:
            suffix = ext

    # Write the upload to a temp file so whisper can read it
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        tmp.write(audio_file.file.read())

    try:
        segments, info = _model.transcribe(tmp_path, beam_size=5)
        text = " ".join(seg.text for seg in segments).strip()
        return {
            "text": text,
            "language": info.language,
            "language_probability": round(info.language_probability, 3),
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
