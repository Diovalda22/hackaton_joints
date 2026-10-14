from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import MonitoringMode, QualityFlag, VerificationStatus


class Hotspot(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    external_key: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    acquired_at: datetime
    source_product: str
    sensor: str
    frp: float | None = None
    confidence_raw: str | None = None
    verification_status: VerificationStatus
    source: str
    quality_flag: QualityFlag
    mode: MonitoringMode
    last_synced_at: datetime

