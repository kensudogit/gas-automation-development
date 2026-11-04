# gas-automation-development

Google Apps Script（GAS）自動化の Skill と、**clasp で push できるスターター**（`gas/`）です。

## クイックスタート

1. 詳細手順: [references/setup-ja.md](references/setup-ja.md)
2. ローカル検証:

```bash
npm run check
# 初回: .\scripts\bootstrap.ps1
```

3. スプレッドシートに `gas/` をデプロイ（clasp または手動コピー）
4. `calculateSalesFromActiveSheet` を実行して OAuth を承認

## Docker

- **検証:** `npm run docker:check` または `docker compose --profile check run --rm check`
- **FastAPI スタブ（GAS 連携練習）:** `npm run docker:api` → http://127.0.0.1:8000

詳細: [references/docker-ja.md](references/docker-ja.md)（GAS から localhost へは直接届かない点を記載）

## リポジトリ構成

| パス | 用途 |
|------|------|
| `SKILL.md` | Cursor / Claude Code 用 Skill 定義 |
| `gas/` | 本番向けスターター（売上集計・ロック・日次トリガー・FastAPI クライアント雛形） |
| `docker/` | Dockerfile（check / api） |
| `docker-compose.yml` | ローカル API と検証コンテナ |
| `examples/` | Skill 検証用の最小サンプル（読み取り専用 `Code.gs`） |
| `references/` | 運用・セキュリティ・セットアップ |
| `tests/` | Node / Python のパッケージ・ロジックテスト |

## Skill のインストール

### Cursor（プロジェクト）

```text
c:\devlop\.cursor\skills\gas-automation-development\
```

に本フォルダをコピー（または同期）。

### Claude Code（ユーザー）

```text
%USERPROFILE%\.claude\skills\gas-automation-development\
```

## clasp

`clasp.json.example` を `.clasp.json` にコピーし、`scriptId` を設定してから `clasp push`。

**ユーザー明示の承認なしに本番 push / トリガー作成 / メール送信は行わないこと**（Skill 方針）。

## 含まれる機能（gas/）

- **売上合計**（シート「売上」・B 列・読み取り中心）
- **LockService** 付き日次ハンドラ
- **idempotent** なトリガー再インストール
- **FastAPI** 向け `UrlFetchApp` ラッパ（リトライ・Script Properties 設定）

## 制限

Skill のインストールだけでは Google 認可は付与されません。初回実行時に OAuth が必要です。
# gas-automation-development
