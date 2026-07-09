import uuid
import fitz

from config.database import AsyncSessionLocal
from models.document import Document, DocumentStatus


async def process_document(document_id: uuid.UUID, content: bytes) -> None:
    async with AsyncSessionLocal() as db:
        document = await db.get(Document, document_id)
        if not document:
            return
        
        document.status = DocumentStatus.PROCESSING
        await db.commit()

        try:
            pdf = fitz.open(stream=content, filetype="pdf")
            document.page_count = pdf.page_count
            pdf.close()
            document.status = DocumentStatus.COMPLETED
            document.error_message = None
        except Exception as exc:
            document.status = DocumentStatus.FAILED
            document.error_message = str(exc)

        await db.commit()