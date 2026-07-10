from storage3 import AsyncStorageClient

from config.settings import settings


_storage_client = AsyncStorageClient(
    f"{settings.supabase_url}/storage/v1",
    {
        "apiKey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}"
    }
)


async def upload_file(path: str, content: bytes, content_type: str) -> None:
    bucket = _storage_client.from_(settings.supabase_storage_bucket)
    await bucket.upload(path, content, {"content_type": content_type})

async def delete_file(path: str) -> None:
    bucket = _storage_client.from_(settings.supabase_storage_bucket)
    await bucket.remove([path])

async def get_signed_url(path: str, expires_in: int = 300, download_filename: str | None = None) -> str:
    bucket = _storage_client.from_(settings.supabase_storage_bucket)
    options = {"download": download_filename} if download_filename else {}
    response = await bucket.create_signed_url(path, expires_in, options)
    return response["signedURL"]