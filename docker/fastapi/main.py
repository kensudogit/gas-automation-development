"""
Local FastAPI stub for GAS FastApiClient.gs integration tests.

POST /api/v1/sales-snapshot — same path as gas/FastApiClient.gs
Optional Bearer token via API_BEARER_TOKEN (empty = auth disabled for local dev only).
"""

from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="GAS Automation Dev API", version="0.1.0")

EXPECTED_TOKEN = os.getenv("API_BEARER_TOKEN", "").strip()
_last_snapshot: dict | None = None


class SalesSnapshotIn(BaseModel):
    total: float = Field(..., description="Sales total from spreadsheet")
    capturedAt: str = Field(..., description="ISO8601 timestamp from GAS")


class SalesSnapshotOut(BaseModel):
    accepted: bool
    total: float
    receivedAt: str


def _verify_bearer(authorization: str | None) -> None:
    if not EXPECTED_TOKEN:
        return
    if not authorization or authorization != f"Bearer {EXPECTED_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid or missing Bearer token")


@app.get("/")
def root() -> dict:
    return {
        "service": "gas-automation-development",
        "title": app.title,
        "version": app.version,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "POST /api/v1/sales-snapshot": "GAS FastApiClient と同じパス",
            "GET /api/v1/last-snapshot": "直近 POST の確認（開発専用）",
        },
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "gas-automation-development"}


@app.get("/api/v1/last-snapshot")
def last_snapshot() -> dict:
    """Dev-only: inspect last POST payload."""
    if _last_snapshot is None:
        raise HTTPException(status_code=404, detail="No snapshot received yet")
    return _last_snapshot


@app.post("/api/v1/sales-snapshot", response_model=SalesSnapshotOut)
def sales_snapshot(
    body: SalesSnapshotIn,
    authorization: str | None = Header(default=None),
) -> SalesSnapshotOut:
    global _last_snapshot
    _verify_bearer(authorization)
    received = datetime.now(timezone.utc).isoformat()
    _last_snapshot = {"total": body.total, "capturedAt": body.capturedAt, "receivedAt": received}
    return SalesSnapshotOut(accepted=True, total=body.total, receivedAt=received)
