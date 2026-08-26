import os
import uuid
from app.core.vector_store import BISVectorStore
from app.ingestion.pdf_parser import BISPDFParser


def ingest_standard_pdf(filepath: str, standard_id: str, scheme_type: str):
    """
    Extracts structured, cleaned clauses using BISPDFParser and indexes them into ChromaDB.
    """
    print(f"\n[Ingestion] Parsing: {filepath} ({standard_id})")
    
    parser = BISPDFParser(filepath=filepath, standard_id=standard_id, scheme_type=scheme_type)
    parsed_chunks = parser.parse()
    
    if not parsed_chunks:
        print(f"[Warning] No clauses extracted for {standard_id}")
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
    
    # Reset Chroma collection to purge previous chopped chunks
    db = BISVectorStore()
    try:
        db.client.delete_collection("bis_standards")
        db.collection = db.client.get_or_create_collection("bis_standards")
        print("[Database] Purged old corrupted collection.")
    except Exception:
        pass

    file_1 = os.path.join(raw_pdf_dir, "1863_1979_reff2019.pdf")
    file_2 = os.path.join(raw_pdf_dir, "2347_2023.pdf")

    if os.path.exists(file_1):
        ingest_standard_pdf(file_1, standard_id="IS 1863", scheme_type="Structural")
    
    if os.path.exists(file_2):
        ingest_standard_pdf(file_2, standard_id="IS 2347", scheme_type="ISI Mark")