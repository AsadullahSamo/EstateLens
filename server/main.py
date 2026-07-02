from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings

app = FastAPI(title="EstateLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}