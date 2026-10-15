from typing import NoReturn

from fastapi import APIRouter, status

from app.schemas.ml import MlForecast, MlForecastRequest, MlMetrics

router = APIRouter(prefix="/api/v1")


def not_implemented() -> NoReturn:
    from fastapi import HTTPException

    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="The contract is published; implementation belongs to a later milestone",
    )


@router.get("/ml/metrics", response_model=list[MlMetrics], tags=["ml"])
async def list_ml_metrics() -> NoReturn:
    not_implemented()


@router.post("/ml/forecast", response_model=MlForecast, tags=["ml"])
async def forecast(payload: MlForecastRequest) -> NoReturn:
    del payload
    not_implemented()

