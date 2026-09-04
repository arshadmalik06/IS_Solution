import os
import re
import fitz  # PyMuPDF
from typing import List, Dict, Any, Optional

class BISPDFParser:
    """
    Production-grade parser for Bureau of Indian Standards (BIS) technical specification PDFs.
    Handles artifact removal, watermark stripping, header/footer normalization, 
    and clause-aware structural segmentation with precise page tracking.
    """

    NOISE_PATTERNS = [
        r"Free Standard provided by BIS via BSB Edge.*?(\n|$)",
        r"Price Group\s+\d+",
        r"BUREAU OF INDIAN STANDARDS\s*\n\s*MANAK BHAVAN.*?(?=\n\n|\Z)",
        r"भारतीय मानक ब्यूरो.*?(?=\n\n|\Z)",
        r"(?m)^\s*Page\s+\d+\s+of\s+\d+\s*$",
        r"(?m)^\s*\d+\s*$",  # Standalone page numbers
    ]

    CLAUSE_START_REGEX = re.compile(
        r"(?m)^(?P<clause_id>(?:Clause\s+|Section\s+)?\d+(?:\.\d+)*)\s+(?P<title>[A-Z][^\n]+)?",
        re.IGNORECASE
    )

    def __init__(self, filepath: str, standard_id: str, scheme_type: str = "ISI Mark"):
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"PDF not found at target path: {filepath}")
        
        self.filepath = filepath
        self.filename = os.path.basename(filepath)  # Capture the filename for the React iframe
        self.standard_id = standard_id
        self.scheme_type = scheme_type

    def _extract_raw_pages(self) -> List[str]:
        doc = fitz.open(self.filepath)
        pages_text = []
        header_pattern = re.compile(re.escape(self.standard_id) + r"\s*:\s*\d{4}", re.IGNORECASE)

        for page in doc:
            text = page.get_text("text")
            lines = text.splitlines()
            cleaned_lines = []
            for line in lines:
                if header_pattern.search(line) and len(line.strip()) < 30:
                    continue  
                cleaned_lines.append(line)
            pages_text.append("\n".join(cleaned_lines))

        return pages_text

    def _clean_text_artifacts(self, text: str) -> str:
        for pattern in self.NOISE_PATTERNS:
            text = re.sub(pattern, " ", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"(\b\w+)-\n(\w+\b)", r"\1\2", text)
        text = re.sub(r"(?<![\.\:\;\?\!])\n(?!\n|[A-Z0-9\(\[\•\-])", " ", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def parse(self) -> List[Dict[str, Any]]:
        raw_pages = self._extract_raw_pages()
        
        # 1. PAGE OFFSET TRACKING
        # We clean page-by-page first to know exactly how long each page is in the final string
        cleaned_pages = []
        page_offsets = []
        current_char_index = 0

        for idx, page_text in enumerate(raw_pages):
            cleaned_text = self._clean_text_artifacts(page_text)
            cleaned_pages.append(cleaned_text)
            
            # Record where this page starts and ends (Page numbers are 1-based)
            page_offsets.append({
                "page_number": idx + 1,
                "start_char": current_char_index,
                "end_char": current_char_index + len(cleaned_text) + 2  # +2 for the \n\n joiner
            })
            current_char_index += len(cleaned_text) + 2

        full_cleaned_text = "\n\n".join(cleaned_pages)
        matches = list(self.CLAUSE_START_REGEX.finditer(full_cleaned_text))
        chunks = []

        # Helper function to find which page a character index belongs to
        def get_page_number(char_index: int) -> int:
            for offset in page_offsets:
                if offset["start_char"] <= char_index < offset["end_char"]:
                    return offset["page_number"]
            return 1 # Fallback to page 1

        if not matches:
            chunks.append({
                "content": full_cleaned_text[:3000],
                "metadata": {
                    "standard_id": self.standard_id,
                    "clause_id": "General",
                    "scheme": self.scheme_type,
                    "filename": self.filename,
                    "page_number": 1,
                    "char_count": len(full_cleaned_text[:3000])
                }
            })
            return chunks

        first_clause_pos = matches[0].start()
        if first_clause_pos > 100:
            preamble = full_cleaned_text[:first_clause_pos].strip()
            if len(preamble) > 100:
                chunks.append({
                    "content": preamble,
                    "metadata": {
                        "standard_id": self.standard_id,
                        "clause_id": "Foreword/Scope",
                        "scheme": self.scheme_type,
                        "filename": self.filename,
                        "page_number": 1,
                        "char_count": len(preamble)
                    }
                })

        for i, match in enumerate(matches):
            start_idx = match.start()
            end_idx = matches[i + 1].start() if (i + 1) < len(matches) else len(full_cleaned_text)

            clause_raw_id = match.group("clause_id").strip()
            clean_clause_id = re.sub(r"(?i)^(Clause|Section)\s*", "", clause_raw_id)
            clause_content = full_cleaned_text[start_idx:end_idx].strip()

            if len(clause_content) >= 40:
                # 2. MATCH THE CLAUSE TO ITS EXACT PAGE NUMBER
                clause_page = get_page_number(start_idx)

                chunks.append({
                    "content": clause_content,
                    "metadata": {
                        "standard_id": self.standard_id,
                        "clause_id": clean_clause_id,
                        "scheme": self.scheme_type,
                        "filename": self.filename,    # NEW: Added for frontend URL
                        "page_number": clause_page,   # NEW: Added for #page=X routing
                        "char_count": len(clause_content)
                    }
                })

        return chunks