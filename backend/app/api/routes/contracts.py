from datetime import datetime
from typing import Annotated, NoReturn

from fastapi import APIRouter, Depends, status

from app.core.security import get_current_user, require_roles
from app.schemas.common import MonitoringMode, UserRole
from app.schemas.ml import MlForecast, MlForecastRequest, MlMetrics
from app.schemas.priority import PriorityAssessment
from app.schemas.report import FieldReport, FieldReportCreate
from app.schemas.task import InspectionTask, InspectionTaskCreate, InspectionTaskUpdate
from app.schemas.user import User

router = APIRouter(prefix="/api/v1")


def not_implemented() -> NoReturn:
    from fastapi import HTTPException

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="The contract is published; implementation belongs to a later milestone",
    )


@router.get("/priorities", response_model=list[PriorityAssessment], tags=["priorities"])
async def list_priorities(
    mode: MonitoringMode,
    as_of: datetime,
) -> NoReturn:
    del mode, as_of
    not_implemented()


@router.get("/tasks", response_model=list[InspectionTask], tags=["tasks"])
async def list_tasks(
    user: Annotated[User, Depends(get_current_user)],
) -> NoReturn:
    del user
    not_implemented()


@router.post(
    "/tasks", response_model=InspectionTask, status_code=status.HTTP_201_CREATED, tags=["tasks"]
)
async def create_task(
    payload: InspectionTaskCreate,
    user: Annotated[User, Depends(require_roles(UserRole.COORDINATOR))],
) -> NoReturn:
    del payload, user
    not_implemented()


@router.get("/tasks/{task_id}", response_model=InspectionTask, tags=["tasks"])
async def get_task(
    task_id: str,
    user: Annotated[User, Depends(get_current_user)],
) -> NoReturn:
    del task_id, user
    not_implemented()


@router.patch("/tasks/{task_id}", response_model=InspectionTask, tags=["tasks"])
async def update_task(
    task_id: str,
    payload: InspectionTaskUpdate,
    user: Annotated[User, Depends(get_current_user)],
) -> NoReturn:
    del task_id, payload, user
    not_implemented()


@router.post(
    "/tasks/{task_id}/reports",
    response_model=FieldReport,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"],
)
async def create_report(
    task_id: str,
    payload: FieldReportCreate,
    user: Annotated[User, Depends(require_roles(UserRole.FIELD_OFFICER))],
) -> NoReturn:
    del task_id, payload, user
    not_implemented()


@router.get("/ml/metrics", response_model=list[MlMetrics], tags=["ml"])
async def list_ml_metrics() -> NoReturn:
    not_implemented()


@router.post("/ml/forecast", response_model=MlForecast, tags=["ml"])
async def forecast(payload: MlForecastRequest) -> NoReturn:
    del payload
    not_implemented()

