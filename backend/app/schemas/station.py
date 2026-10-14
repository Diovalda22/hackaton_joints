from pydantic import BaseModel, ConfigDict


class Station(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    region: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    coordinate_source: str | None = None

