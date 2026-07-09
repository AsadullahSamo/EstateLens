export interface User {
    id: string
    email: string
    full_name: string
    role: "user" | "admin"
}

export interface Project {
    id: string
    name: string
    description: string | null
    risk_score: number | null
    created_at: string
    updated_at: string
}

export type DocumentStatus = "pending" | "processing" | "completed" | "failed"

export type DocumentType =
  | "contract" | "zoning_report" | "title_document" | "survey"
  | "council_document" | "planning_certificate" | "other";

export interface Document {
    id: string
    project_id: string
    filename: string
    file_size: number
    mime_type: string
    status: DocumentStatus
    document_type: DocumentType | null
    page_count: number | null
    error_message: string | null
    processed_at: string | null
    created_at: string
    updated_at: string
}

