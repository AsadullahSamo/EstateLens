from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routes.auth import router as auth_router

app = FastAPI(title="EstateLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth_router)

@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}