import asyncio
import uuid

from config.database import AsyncSessionLocal
from models.document import Document, DocumentStatus
from services import ocr_service, chunking_service, vector_service, classification_service


async def process_document(document_id: uuid.UUID, project_id: uuid.UUID, content: bytes) -> None:
    async with AsyncSessionLocal() as db:
        document = await db.get(Document, document_id)
        if not document:
            return
        
        document.status = DocumentStatus.PROCESSING
        await db.commit()

        try:
            pages = await asyncio.to_thread(ocr_service.extract_pages, content)
            document.page_count = len(pages)

            chunks = await asyncio.to_thread(chunking_service.chunk_pages, pages)
            await asyncio.to_thread(vector_service.index_chunks, str(project_id), str(document_id), chunks)

            full_text = " ".join(page.text for page in pages)
            document.document_type = await asyncio.to_thread(classification_service.classify_document, full_text)

            document.status = DocumentStatus.COMPLETED
            document.error_message = None
        except Exception as exc:
            document.status = DocumentStatus.FAILED
            document.error_message = str(exc)

        await db.commit()