from datetime import date

from pydantic import BaseModel, Field


class MlMetrics(BaseModel):
    model_version: str
    station_id: str
    training_from: date
    training_to: date
    test_from: date
    test_to: date
    test_size: int = Field(gt=0)
    mae_cm: float = Field(ge=0)
    rmse_cm: float = Field(ge=0)
    baseline_mae_cm: float = Field(ge=0)
    baseline_rmse_cm: float = Field(ge=0)
    beats_baseline: bool
    features: list[str]


class MlForecastRequest(BaseModel):
    station_id: str
    as_of: date


class MlForecast(BaseModel):
    station_id: str
    as_of: date
    forecast_for: date
    predicted_gwt_m: float
    model_version: str
    is_historical: bool

