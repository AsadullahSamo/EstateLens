import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.document import DocumentStatus, DocumentType


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    filename: str
    file_size: int
    mime_type: str
    status: DocumentStatus
    document_type: DocumentType | None = None
    page_count: int | None = None
    error_message: str | None = None
    processed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
