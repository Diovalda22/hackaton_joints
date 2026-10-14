from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.common import PriorityLevel, TaskStatus


class InspectionTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    priority: PriorityLevel
    status: TaskStatus
    assessment_id: str | None = None
    hotspot_id: str | None = None
    assignee_id: str | None = None
    created_by_id: str
    created_at: datetime
    updated_at: datetime


class InspectionTaskCreate(BaseModel):
    title: str
    priority: PriorityLevel
    assessment_id: str | None = None
    hotspot_id: str | None = None
    assignee_id: str | None = None


class InspectionTaskUpdate(BaseModel):
    status: TaskStatus | None = None
    assignee_id: str | None = None

