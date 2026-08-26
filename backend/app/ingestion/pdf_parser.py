import os
import re
import fitz  # PyMuPDF
from typing import List, Dict, Any, Optional


class BISPDFParser:
    """
    Production-grade parser for Bureau of Indian Standards (BIS) technical specification PDFs.
    Handles artifact removal, watermark stripping, header/footer normalization, 
    and clause-aware structural segmentation.
    """

    # Watermark and footer patterns common in BIS official PDFs
    NOISE_PATTERNS = [
        r"Free Standard provided by BIS via BSB Edge.*?(\n|$)",
        r"Price Group\s+\d+",
        r"BUREAU OF INDIAN STANDARDS\s*\n\s*MANAK BHAVAN.*?(?=\n\n|\Z)",
        r"भारतीय मानक ब्यूरो.*?(?=\n\n|\Z)",
        r"(?m)^\s*Page\s+\d+\s+of\s+\d+\s*$",
        r"(?m)^\s*\d+\s*$",  # Standalone page numbers
    ]

    # Regex to detect standard clauses (e.g., "5.1", "5.1.1", "Clause 4.2", "SECTION 3")
    CLAUSE_START_REGEX = re.compile(
        r"(?m)^(?P<clause_id>(?:Clause\s+|Section\s+)?\d+(?:\.\d+)*)\s+(?P<title>[A-Z][^\n]+)?",
        re.IGNORECASE
    )

    def __init__(self, filepath: str, standard_id: str, scheme_type: str = "ISI Mark"):
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"PDF not found at target path: {filepath}")
        
        self.filepath = filepath
        self.standard_id = standard_id
        self.scheme_type = scheme_type

    def _extract_raw_pages(self) -> List[str]:
        """Extracts text per page while filtering repetitive running headers."""
        doc = fitz.open(self.filepath)
        pages_text = []

        # Target pattern for running header: e.g. "IS 2347 : 2023"
        header_pattern = re.compile(re.escape(self.standard_id) + r"\s*:\s*\d{4}", re.IGNORECASE)

        for page in doc:
            text = page.get_text("text")
            # Strip isolated running header at top of pages
            lines = text.splitlines()
            cleaned_lines = []
            for line in lines:
                if header_pattern.search(line) and len(line.strip()) < 30:
                    continue  # Drop running header line
                cleaned_lines.append(line)
            pages_text.append("\n".join(cleaned_lines))

        return pages_text

    def _clean_text_artifacts(self, text: str) -> str:
        """Removes watermarks, unifies hyphenated line wraps, and normalizes whitespaces."""
        # 1. Remove noise and watermark disclaimers
        for pattern in self.NOISE_PATTERNS:
            text = re.sub(pattern, " ", text, flags=re.IGNORECASE | re.DOTALL)

        # 2. Fix hyphenated word breaks across lines (e.g. "speci-\nfication" -> "specification")
        text = re.sub(r"(\b\w+)-\n(\w+\b)", r"\1\2", text)

        # 3. Join broken lines that are part of the same sentence
        # If line does not end with a sentence terminator or colon, replace \n with a space
        text = re.sub(r"(?<![\.\:\;\?\!])\n(?!\n|[A-Z0-9\(\[\•\-])", " ", text)

        # 4. Collapse multiple blank lines and spaces
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()

    def parse(self) -> List[Dict[str, Any]]:
        """
        Parses the document into semantically complete, clause-aligned chunks.
        
        Returns:
            List of dictionaries containing:
                - content: Complete clause text
                - metadata: standard_id, clause_id, scheme, char_count
        """
        raw_pages = self._extract_raw_pages()
        full_cleaned_text = self._clean_text_artifacts("\n\n".join(raw_pages))

        # Split text by clause headers while retaining match positions
        matches = list(self.CLAUSE_START_REGEX.finditer(full_cleaned_text))
        chunks = []

        if not matches:
            # Fallback if standard does not follow numbered clause format (e.g. Annexes/Tables)
            chunks.append({
                "content": full_cleaned_text[:3000],
                "metadata": {
                    "standard_id": self.standard_id,
                    "clause_id": "General",
                    "scheme": self.scheme_type,
                    "char_count": len(full_cleaned_text[:3000])
                }
            })
            return chunks

        # Extract preamble/foreword before the first clause
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
                        "char_count": len(preamble)
                    }
                })

        # Iterate through matched clauses and extract full body text
        for i, match in enumerate(matches):
            start_idx = match.start()
            end_idx = matches[i + 1].start() if (i + 1) < len(matches) else len(full_cleaned_text)

            clause_raw_id = match.group("clause_id").strip()
            # Clean clause number (e.g., "Clause 5.1" -> "5.1")
            clean_clause_id = re.sub(r"(?i)^(Clause|Section)\s*", "", clause_raw_id)
            
            clause_content = full_cleaned_text[start_idx:end_idx].strip()

            # Ignore tiny fragments (< 40 characters)
            if len(clause_content) >= 40:
                chunks.append({
                    "content": clause_content,
                    "metadata": {
                        "standard_id": self.standard_id,
                        "clause_id": clean_clause_id,
                        "scheme": self.scheme_type,
                        "char_count": len(clause_content)
                    }
                })

        return chunks