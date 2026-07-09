import uuid

from fastapi import APIRouter, status, Depends, UploadFile, BackgroundTasks, File
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db
from models.user import User
from schemas.document import DocumentResponse
from middlewares.auth_middleware import get_current_user
from controllers import document_controller
from services.document_processing_service import process_document


router = APIRouter(prefix="/api/projects/{project_id}/documents", tags=["documents"])


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    content = await file.read()
    
    document = await document_controller.create_document(
        db=db, 
        project_id=project_id,
        owner_id=current_user.id,
        filename=file.filename,
        content=content,
        content_type=file.content_type
    )

    background_tasks.add_task(process_document, document.id, content)
    return document


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await document_controller.list_documents(db=db, owner_id=current_user.id, project_id=project_id)