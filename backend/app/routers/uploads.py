import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from ..config import settings

router = APIRouter(prefix="/uploads", tags=["uploads"])

# Allowed image content types mapped to the extension we store them with.
ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)):
    """Store an uploaded image and return a public URL for it.

    Files are written to `settings.upload_dir` and served under
    `/static/uploads/<name>`. For production behind an ephemeral container,
    swap the disk write for object storage — the returned contract (a URL)
    stays the same.
    """
    ext = ALLOWED_TYPES.get(file.content_type)
    if ext is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type; expected JPEG, PNG, WebP or GIF",
        )

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large (max 5 MB)",
        )

    dest_dir = Path(settings.upload_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    (dest_dir / name).write_bytes(data)

    url = f"{settings.public_base_url.rstrip('/')}/static/uploads/{name}"
    return {"url": url, "filename": name}
