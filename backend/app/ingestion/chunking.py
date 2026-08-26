import glob
import os
import re
import uuid
from app.core.vector_store import BISVectorStore
from app.ingestion.pdf_parser import BISPDFParser


def ingest_standard_pdf(filepath: str, standard_id: str, scheme_type: str = "ISI Mark"):
    """
    Extracts structured, cleaned clauses using BISPDFParser and indexes them into ChromaDB.
    """
    print(f"\n[Ingestion] Parsing: {filepath} ({standard_id})")
    
    parser = BISPDFParser(filepath=filepath, standard_id=standard_id, scheme_type=scheme_type)
    parsed_chunks = parser.parse()
    
    if not parsed_chunks:
        print(f"[Warning] No clauses extracted for {standard_id}. Check if the document is a scanned image.")
        return

    documents = []
    metadatas = []
    ids = []

    for item in parsed_chunks:
        documents.append(item["content"])
        metadatas.append(item["metadata"])
        
        clause_tag = item["metadata"]["clause_id"].replace(" ", "_").replace(".", "_")
        unique_id = f"{standard_id.replace(' ', '_')}_{clause_tag}_{uuid.uuid4().hex[:6]}"
        ids.append(unique_id)

    print(f"[Ingestion] Extracted {len(documents)} clean clauses.")
    
    # Store into ChromaDB
    db = BISVectorStore()
    print("[Ingestion] Embedding and persisting vectors...")
    db.add_documents(documents=documents, metadatas=metadatas, ids=ids)
    print(f"[Success] {standard_id} indexed successfully.")


if __name__ == "__main__":
    raw_pdf_dir = os.path.join(os.getcwd(), "app", "data", "raw_pdfs")
    
    # 1. Purge / reset Chroma collection once before batch ingestion
    db = BISVectorStore()
    try:
        db.client.delete_collection("bis_standards")
        db.collection = db.client.get_or_create_collection("bis_standards")
        print("[Database] Purged old collection and initialized clean database.")
    except Exception:
        pass

    # 2. Find all PDF files in the raw_pdfs folder
    pdf_files = glob.glob(os.path.join(raw_pdf_dir, "*.pdf"))

    if not pdf_files:
        print(f"[Warning] No PDF files found in {raw_pdf_dir}")

    # 3. Dynamic loop through all files
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        
        # Regex to extract the leading standard number (e.g., '8978' from '8978_2023.pdf' or 'IS_8978.pdf')
        match = re.search(r'(\d+)', filename)
        if match:
            std_num = match.group(1)
            standard_id = f"IS {std_num}"
        else:
            # Fallback if no digits found
            standard_id = os.path.splitext(filename)[0]

        try:
            ingest_standard_pdf(
                filepath=pdf_path,
                standard_id=standard_id,
                scheme_type="ISI Mark"
            )
        except Exception as e:
            print(f"[Error] Failed processing {filename}: {e}")