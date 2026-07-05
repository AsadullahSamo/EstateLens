import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db
from models.user import User
from schemas.project import ProjectResponse, ProjectCreate, ProjectUpdate
from middlewares.auth_middleware import get_current_user
from controllers import project_controller

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await project_controller.list_projects(db=db, owner_id=current_user.id)

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await project_controller.create_project(db=db, owner_id=current_user.id, payload=payload)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await project_controller.get_project(db=db, owner_id=current_user.id, project_id=project_id)

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    payload: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await project_controller.update_project(
        db=db, owner_id=current_user.id, project_id=project_id, payload=payload
    )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await project_controller.delete_project(
        db=db, owner_id=current_user.id, project_id=project_id
    )
