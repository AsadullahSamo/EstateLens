from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    client_url: str = "http://localhost:3000"
    jwt_secret: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    env: str = "development"
    supabase_url: str
    supabase_service_role_key: str
    supabase_storage_bucket: str = "documents"

    class Config:
        env_file = ".env"


settings = Settings()