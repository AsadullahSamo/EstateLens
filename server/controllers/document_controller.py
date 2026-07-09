import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from models.document import Document, DocumentStatus
from controllers import project_controller
from services import storage_service


ALLOWED_MIME_TYPES = {"application/pdf"}


async def create_document(
    db: AsyncSession,
    owner_id: uuid.UUID,
    project_id: uuid.UUID,
    filename: str,
    content: bytes,
    content_type: str
) -> Document:
    await project_controller.get_project(db, owner_id, project_id)

    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are supported")
    
    document = Document(
        project_id=project_id,
        filename=filename,
        file_url="",
        file_size=len(content),
        mime_type=content_type,
        status=DocumentStatus.PENDING
    )

    db.add(document)
    await db.flush()
    await db.refresh(document)
    
    storage_path = f"{project_id}/{document.id}/{filename}"
    
    try:
        await storage_service.upload_file(storage_path, content, content_type)
        document.file_url = storage_path
    except Exception as exc:
        document.status = DocumentStatus.FAILED
        document.error_message = str(exc)

    await db.commit()
    await db.refresh(document)

    return document

async def list_documents(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID) -> list[Document]:
    await project_controller.get_project(db, owner_id, project_id)

    result = await db.execute(
        select(Document).where(Document.project_id == project_id).order_by(Document.created_at.desc())
    )

    return result.scalars().all()