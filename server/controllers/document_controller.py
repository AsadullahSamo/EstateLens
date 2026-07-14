import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from models.document import Document, DocumentStatus
from controllers import project_controller
from services import storage_service, vector_service


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

async def get_document(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID, document_id: uuid.UUID) -> Document:
    await project_controller.get_project(db, owner_id, project_id)

    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.project_id == project_id)
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document

async def delete_document(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID, document_id: uuid.UUID) -> None:
    document = await get_document(db, owner_id, project_id, document_id)

    if document.file_url:
        await storage_service.delete_file(document.file_url)

    vector_service.delete_document_chunks(str(document_id))

    await db.delete(document)
    await db.commit()

async def get_download_url(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID, document_id: uuid.UUID) -> str:
    document = await get_document(db, owner_id, project_id, document_id)

    if not document.file_url:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="File not available")
    
    return await storage_service.get_signed_url(document.file_url, download_filename=document.filename)