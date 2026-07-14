import chromadb

from config.settings import settings
from services.chunking_service import Chunk

_client = chromadb.PersistentClient(path=settings.chroma_persist_directory)
_collection = _client.get_or_create_collection(name="documents")


def index_chunks(project_id: str, document_id: str, chunks: list[Chunk]) -> None:
    if not chunks:
        return
    
    ids = [f"{document_id}_{chunk.chunk_index}" for chunk in chunks]
    documents = [chunk.text for chunk in chunks]
    metadatas = [
        {
            "project_id": project_id,
            "document_id": document_id,
            "page_number": chunk.page_number,
            "chunk_index": chunk.chunk_index,
        }
        for chunk in chunks
    ]

    _collection.add(ids=ids, documents=documents, metadatas=metadatas)


def delete_document_chunks(document_id: str) -> None:
    _collection.delete(where={"document_id": document_id})