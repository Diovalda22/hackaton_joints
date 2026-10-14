import pytest
from pydantic import ValidationError

from app.core.config import Settings
from app.schemas.common import MonitoringMode, QualityFlag
from app.schemas.groundwater import GroundwaterObservation


def test_production_requires_distinct_role_tokens() -> None:
    with pytest.raises(ValidationError):
        Settings(app_env="production", coordinator_token=None, field_officer_token=None)

    with pytest.raises(ValidationError):
        Settings(
            app_env="production",
            coordinator_token="same-token",
            field_officer_token="same-token",
        )

    with pytest.raises(ValidationError):
        Settings(
            app_env="production",
            coordinator_token="short-coordinator",
            field_officer_token="short-officer",
        )

    settings = Settings(
        app_env="production",
        coordinator_token="coordinator-token-with-at-least-32-characters",
        field_officer_token="field-officer-token-with-at-least-32-characters",
    )
    assert settings.app_env == "production"


def test_groundwater_null_is_preserved_and_historical_mode_is_explicit() -> None:
    observation = GroundwaterObservation.model_validate(
        {
            "id": "obs-1",
            "station_id": "BRG6",
            "observed_date": "2019-01-02",
            "observed_at": "2019-01-02T00:00:00Z",
            "gwt_m": None,
            "quality_flag": "MISSING",
            "source": "mmc1.xlsx",
            "mode": "HISTORICAL_REPLAY",
        }
    )

    assert observation.gwt_m is None
    assert observation.quality_flag is QualityFlag.MISSING
    assert observation.mode is MonitoringMode.HISTORICAL_REPLAY

