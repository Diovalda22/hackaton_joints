from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FieldReport(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    task_id: str
    observed_at: datetime
    result: str
    note: str
    is_simulation: bool
    evidence_url: str | None = None
    submitted_by_id: str
    created_at: datetime


class FieldReportCreate(BaseModel):
    observed_at: datetime
    result: str = Field(min_length=1, max_length=100)
    note: str = Field(min_length=1, max_length=5000)
    is_simulation: bool = True
    evidence_url: str | None = None

