from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.documents import router as document_router

app = FastAPI(title="EstateLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(document_router)

@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}