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
