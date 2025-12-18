from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.musicxml.parse import parse_musicxml_to_payload

router = APIRouter()


@router.post("/parse")
async def parse_musicxml(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename.")

    content_type = (file.content_type or "").lower()
    if content_type and "xml" not in content_type and "musicxml" not in content_type:
        # We still accept it (many browsers use application/octet-stream),
        # but this gives a clearer error if it's obviously wrong.
        pass

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")

    try:
        return parse_musicxml_to_payload(raw)
    except Exception as e:  # noqa: BLE001 - MVP: return useful error
        raise HTTPException(status_code=400, detail=f"Failed to parse MusicXML: {e}") from e


