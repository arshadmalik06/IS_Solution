"""
tts_service.py — Text-to-Speech using Microsoft edge-tts.

Features:
- Auto-detects Hindi (Devanagari script) and selects the correct neural voice.
- Regex-based normaliser expands technical terms for clear pacing.
  e.g.  "IS 456"  →  "Indian Standard 456"
        "Cl. 4.2" →  "Clause 4.2"
        "BIS"     →  "B I S"
"""
import re
import tempfile
import os
import edge_tts

# ---------------------------------------------------------------------------
# Normalisation helpers
# ---------------------------------------------------------------------------
_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")

_TECH_SUBS = [
    # IS 456  →  Indian Standard 456
    (re.compile(r"\bIS\s+(\d+)\b", re.IGNORECASE), r"Indian Standard \1"),
    # Cl. 4.2  →  Clause 4.2
    (re.compile(r"\bCl\.\s*(\d+(?:\.\d+)*)\b", re.IGNORECASE), r"Clause \1"),
    # BIS  →  B I S  (letter-spelt for clarity)
    (re.compile(r"\bBIS\b"), "B I S"),
    # QCO  →  Q C O
    (re.compile(r"\bQCO\b"), "Q C O"),
    # ISI  →  I S I
    (re.compile(r"\bISI\b"), "I S I"),
]


def _normalise(text: str) -> str:
    """Expand technical abbreviations so TTS pronounces them correctly."""
    for pattern, replacement in _TECH_SUBS:
        text = pattern.sub(replacement, text)
    return text


def _is_hindi(text: str) -> bool:
    """Return True if text contains Devanagari characters."""
    return bool(_DEVANAGARI_RE.search(text))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def generate_tts_audio(text: str, lang: str = "en") -> str:
    """
    Synthesise speech for *text* and return the path to a temporary .mp3 file.

    Args:
        text:  The text to synthesise.
        lang:  Language hint ('hi' or 'en').  The function also auto-detects
               Hindi via Devanagari script inspection, overriding the hint.

    Returns:
        Absolute path to a temporary MP3 file that the caller must delete.
    """
    # Auto-detect Hindi from script — overrides frontend hint if mismatched
    if _is_hindi(text):
        lang = "hi"

    # Choose neural voice
    voice = "hi-IN-SwaraNeural" if lang.startswith("hi") else "en-IN-NeerjaNeural"

    normalised = _normalise(text)

    # rate="-10%" gives slightly slower pacing — clearer for technical clauses
    communicate = edge_tts.Communicate(normalised, voice, rate="-10%")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp_path = tmp.name
    tmp.close()

    await communicate.save(tmp_path)
    return tmp_path
