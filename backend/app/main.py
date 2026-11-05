
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from worker.log_parser import parse_log_file
from worker.detection_rules import analyze_logs

import os
import tempfile


app = FastAPI(
    title="CyberPulse API",
    description="Cybersecurity Log Analysis and Threat Monitoring",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {
        "message": "Welcome to CyberPulse API",
        "status": "Running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CyberPulse Backend"
    }


@app.post("/api/upload")
async def upload_logs(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing"
        )

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in [".csv", ".json"]:
        raise HTTPException(
            status_code=400,
            detail="Only CSV and JSON files are supported"
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="File size cannot exceed 10 MB"
        )

    temporary_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="wb",
            suffix=extension,
            delete=False
        ) as temporary_file:

            temporary_file.write(content)
            temporary_path = temporary_file.name

        events = parse_log_file(temporary_path)

        alerts = analyze_logs(events)

        high_alerts = sum(
            1 for alert in alerts
            if alert["severity"] == "High"
        )

        medium_alerts = sum(
            1 for alert in alerts
            if alert["severity"] == "Medium"
        )

        return {
            "success": True,
            "filename": file.filename,
            "total_logs": len(events),
            "total_alerts": len(alerts),
            "high_alerts": high_alerts,
            "medium_alerts": medium_alerts,
            "alerts": alerts
        }

    except (ValueError, UnicodeDecodeError) as error:
        raise HTTPException(
            status_code=400,
            detail=f"Could not process file: {str(error)}"
        )

    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)

        await file.close()
