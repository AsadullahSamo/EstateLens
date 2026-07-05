import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate


async def create_project(db: AsyncSession, owner_id: uuid.UUID, payload: ProjectCreate) -> Project: 
    project = Project(**payload.model_dump(), owner_id=owner_id)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def list_projects(db: AsyncSession, owner_id: uuid.UUID) -> list[Project]:
    result = await db.execute(
        select(Project).where(Project.owner_id == owner_id).order_by(Project.created_at.desc())
    )
    return result.scalars().all()


async def get_project(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID) -> Project:
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.owner_id == owner_id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


async def update_project(
    db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID, payload: ProjectUpdate
) -> Project:
    
    project = await get_project(db, owner_id, project_id)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, owner_id: uuid.UUID, project_id: uuid.UUID) -> None:
    project = await get_project(db, owner_id, project_id)
    await db.delete(project)
    await db.commit()


