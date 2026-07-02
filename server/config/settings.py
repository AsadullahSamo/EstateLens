from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    client_url: str = "http://localhost:3000"
    env: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()