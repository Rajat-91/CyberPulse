
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship

from backend.app.database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_format = Column(String(10), nullable=False)
    total_logs = Column(Integer, default=0, nullable=False)
    total_alerts = Column(Integer, default=0, nullable=False)
    high_alerts = Column(Integer, default=0, nullable=False)
    medium_alerts = Column(Integer, default=0, nullable=False)

    uploaded_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    alerts = relationship(
        "Alert",
        back_populates="upload",
        cascade="all, delete-orphan"
    )


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    upload_id = Column(
        Integer,
        ForeignKey("uploads.id", ondelete="CASCADE"),
        nullable=False
    )

    type = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    source_ip = Column(String(100), nullable=True)
    severity = Column(String(20), nullable=False)
    status = Column(String(20), default="Open", nullable=False)

    detected_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    upload = relationship("Upload", back_populates="alerts")
