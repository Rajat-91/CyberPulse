from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models

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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
async def upload_logs(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
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

        new_upload = models.Upload(
            filename=file.filename,
            file_format=extension.replace(".", "").upper(),
            total_logs=len(events),
            total_alerts=len(alerts),
            high_alerts=high_alerts,
            medium_alerts=medium_alerts
        )

        db.add(new_upload)
        db.flush()

        for alert in alerts:
            new_alert = models.Alert(
                upload_id=new_upload.id,
                type=alert.get("type", "Unknown threat"),
                description=alert.get("description", ""),
                source_ip=alert.get("source_ip", "Unknown"),
                severity=alert.get("severity", "Low"),
                status="Open"
            )

            db.add(new_alert)

        db.commit()
        db.refresh(new_upload)

        saved_alerts = (
            db.query(models.Alert)
            .filter(models.Alert.upload_id == new_upload.id)
            .all()
        )

        return {
            "success": True,
            "upload_id": new_upload.id,
            "filename": new_upload.filename,
            "file_format": new_upload.file_format,
            "total_logs": new_upload.total_logs,
            "total_alerts": new_upload.total_alerts,
            "high_alerts": new_upload.high_alerts,
            "medium_alerts": new_upload.medium_alerts,
            "alerts": [
                {
                    "id": alert.id,
                    "type": alert.type,
                    "description": alert.description,
                    "source_ip": alert.source_ip,
                    "severity": alert.severity,
                    "status": alert.status,
                    "detected_at": alert.detected_at.isoformat()
                }
                for alert in saved_alerts
            ]
        }

    except (ValueError, UnicodeDecodeError) as error:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Could not process file: {str(error)}"
        )

    except Exception as error:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Upload processing failed: {str(error)}"
        )

    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)

        await file.close()


@app.get("/api/uploads")
def get_uploads(db: Session = Depends(get_db)):
    uploads = (
        db.query(models.Upload)
        .order_by(models.Upload.uploaded_at.desc())
        .all()
    )

    return {
        "success": True,
        "uploads": [
            {
                "id": upload.id,
                "filename": upload.filename,
                "file_format": upload.file_format,
                "total_logs": upload.total_logs,
                "total_alerts": upload.total_alerts,
                "high_alerts": upload.high_alerts,
                "medium_alerts": upload.medium_alerts,
                "uploaded_at": upload.uploaded_at.isoformat()
            }
            for upload in uploads
        ]
    }


@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = (
        db.query(models.Alert)
        .order_by(models.Alert.detected_at.desc())
        .all()
    )

    return {
        "success": True,
        "alerts": [
            {
                "id": alert.id,
                "upload_id": alert.upload_id,
                "type": alert.type,
                "description": alert.description,
                "source_ip": alert.source_ip,
                "severity": alert.severity,
                "status": alert.status,
                "detected_at": alert.detected_at.isoformat()
            }
            for alert in alerts
        ]
    }


@app.patch("/api/alerts/{alert_id}/status")
def update_alert_status(
    alert_id: int,
    status: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    if status not in ["Open", "Resolved"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Open or Resolved"
        )

    alert = (
        db.query(models.Alert)
        .filter(models.Alert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=404,
            detail="Alert not found"
        )

    alert.status = status

    db.commit()
    db.refresh(alert)

    return {
        "success": True,
        "message": "Alert status updated successfully",
        "alert": {
            "id": alert.id,
            "status": alert.status
        }
    }

