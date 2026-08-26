import os
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any

# Define the local path where ChromaDB will persist data safely inside the app directory
DB_PATH = os.path.join(os.getcwd(), "app", "data", "chroma_data")

class BISVectorStore:
    def __init__(self, collection_name: str = "bis_standards"):
        # Ensure the persistent directory exists
        os.makedirs(DB_PATH, exist_ok=True)
        
        # Initialize the persistent Chroma client so data survives server restarts
        self.client = chromadb.PersistentClient(path=DB_PATH)
        
        # Initialize the local bilingual embedding model (BGE-M3)
        self.embedder = SentenceTransformer('BAAI/bge-m3')
        
        # Get or create the vector collection
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def _generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Converts text chunks into dense numerical vectors."""
        embeddings = self.embedder.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """Adds text documents, metadata tags, and unique IDs into the vector store."""
        if not documents:
            return
        embeddings = self._generate_embeddings(documents)
        self.collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Searches the vector store for the most relevant legal clauses matching the query."""
        query_embedding = self._generate_embeddings([query])
        
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            include=["documents", "metadatas"]
        )
        
        formatted_results = []
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "content": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i]
                })
        return formatted_results