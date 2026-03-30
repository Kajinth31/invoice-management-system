from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile

from app.config import ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB
from app.services.gemini_service import parse_invoice_with_gemini

router = APIRouter()


@router.post("/upload")
async def process_invoice(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()

    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max allowed is {MAX_FILE_SIZE_MB} MB"
        )

    suffix = os.path.splitext(file.filename)[1] if file.filename else ".tmp"
    temp_file_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name

        invoice_items = parse_invoice_with_gemini(temp_file_path)
        return {"status": "success", "data": invoice_items}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Parsing error: {str(e)}")
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to process invoice")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)