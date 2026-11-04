# Script Properties 一覧

Apps Script → プロジェクトの設定 → スクリプト プロパティ

| キー | 必須 | 説明 |
|------|------|------|
| `FASTAPI_BASE_URL` | FastAPI 利用時 | 例 `https://api.example.com`（末尾スラッシュなし推奨） |
| `FASTAPI_BEARER_TOKEN` | 任意 | `Authorization: Bearer` に付与 |
| `POST_SALES_TO_FASTAPI` | 任意 | `true` のとき日次ジョブ後に POST（サーバー準備後のみ） |

**秘密情報は Git にコミットしない。** 本番値は Google の Script Properties のみに置く。
