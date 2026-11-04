# Docker（ローカル開発）

GAS 本体は Google 上で動きます。Docker は **テスト実行** と **FastAPI 連携のローカル検証** 用です。

## 前提

- Docker Desktop（または Docker Engine + Compose v2）
- リポジトリ直下の `.env` に `COMPOSE_BAKE=0` を入れてあります（Windows で `docker compose build` が buildx エラーになる場合の回避）。不要なら削除して構いません。

## 1. Skill / ロジック検証

```bash
docker compose --profile check run --rm check
```

`npm run check` と同等（SalesLogic 同期・Node テスト・Python validate）です。

## 2. FastAPI スタブ（GAS 連携の練習用）

```bash
docker compose up api --build
```

| URL | 用途 |
|-----|------|
| http://127.0.0.1:8000/health | 死活 |
| POST http://127.0.0.1:8000/api/v1/sales-snapshot | GAS `postSalesTotalToFastApi_` と同じパス |
| GET http://127.0.0.1:8000/api/v1/last-snapshot | 直近 POST の確認（開発専用） |

デフォルト Bearer: `dev-local-token`（`.env` で `API_BEARER_TOKEN` を変更可能）。

### GAS Script Properties（ローカル API 向け）

| キー | 値の例 |
|------|--------|
| `FASTAPI_BASE_URL` | `http://127.0.0.1:8000` ※GAS からは **公開 HTTPS URL** が必要なため、実際の GAS 実行では ngrok 等でトンネルするか、デプロイ先 API を使う |
| `FASTAPI_BEARER_TOKEN` | `dev-local-token` |

**注意:** Google Apps Script の `UrlFetchApp` は **localhost に直接アクセスできません**。ローカル Docker API は、同リポジトリの curl / 統合テスト、または ngrok / Cloud Run など **外部から到達可能な URL** 経由で GAS と接続してください。

### curl で POST 確認

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/sales-snapshot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-local-token" \
  -d "{\"total\": 300, \"capturedAt\": \"2026-01-01T00:00:00.000Z\"}"
```

## 3. 停止

```bash
docker compose down
```

## 4. 本番

本番 API は別ホスト（Railway / ECS 等）にデプロイし、`FASTAPI_BASE_URL` を HTTPS の本番 URL に設定してください。Docker Compose の `api` サービスは開発専用です。
