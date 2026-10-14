from uuid import UUID

import pytest
from conftest import AsgiClient

from app.api.routes.monitoring import get_monitoring_repository
from app.main import app
from app.schemas.hotspot import HotspotPage


class FakeRepository:
    calls: dict

    def __init__(self) -> None:
        self.calls = {}

    async def list_stations(self):
        return []

    async def station_exists(self, station_id: UUID) -> bool:
        return station_id.int == 1

    async def list_groundwater(self, station_id, **kwargs):
        self.calls = kwargs
        return []

    async def list_hotspots(self, **kwargs):
        self.calls = kwargs
        return HotspotPage(items=[], total=0, limit=kwargs["limit"], offset=kwargs["offset"])


@pytest.fixture
def repository():
    fake = FakeRepository()

    async def override():
        return fake

    app.dependency_overrides[get_monitoring_repository] = override
    yield fake
    app.dependency_overrides.clear()


def test_groundwater_uuid_range_and_current_mode(client: AsgiClient, repository) -> None:
    assert client.get("/api/v1/stations/not-a-uuid/groundwater").status_code == 422
    missing = "/api/v1/stations/00000000-0000-0000-0000-000000000002/groundwater"
    assert client.get(missing).status_code == 404
    path = "/api/v1/stations/00000000-0000-0000-0000-000000000001/groundwater"
    assert client.get(path + "?from=2019-02-01&to=2019-01-01").status_code == 422
    response = client.get(path + "?mode=CURRENT_MONITORING")
    assert response.status_code == 200
    assert response.json() == []
    assert repository.calls["mode"] == "CURRENT_MONITORING"


def test_hotspot_filters_and_pagination(client: AsgiClient, repository) -> None:
    response = client.get(
        "/api/v1/hotspots?from=2019-01-01&to=2019-01-02&bbox=100,-3,104,0"
        "&satellite=N&source_product=VIIRS_SNPP_HISTORICAL&limit=10&offset=20"
    )
    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0, "limit": 10, "offset": 20}
    assert repository.calls["satellite"] == "N"
    assert repository.calls["bbox"].west == 100
    for query in ("limit=1001", "offset=-1", "bbox=104,0,100,-3", "from=invalid"):
        assert client.get("/api/v1/hotspots?" + query).status_code == 422
