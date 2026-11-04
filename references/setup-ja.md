# セットアップ手順（日本語）

## 1. スプレッドシートにバインド

1. Google スプレッドシートを新規作成する。
2. シート名を **売上** に変更し、B2 以降に数値（売上金額）を入力する。
3. **拡張機能 → Apps Script** でエディタを開く。

## 2. ローカル準備（Windows）

```powershell
cd C:\devlop\gas-automation-development
.\scripts\bootstrap.ps1
```

`npm run check` でロジック同期・Node テスト・Skill 検証を一括実行できます。

## 3. コードを配置

### 手動コピー

`gas/` フォルダ内のファイルを Apps Script エディタに同名で追加する。

### clasp（推奨・開発者向け）

```bash
npm install
npx clasp login
cp clasp.json.example .clasp.json
# .clasp.json の scriptId を対象プロジェクト ID に書き換え
npx clasp push
```

**本番 push の前に** Script ID・OAuth スコープ・影響範囲を必ず確認してください。

## 4. 初回実行

1. エディタで `calculateSalesFromActiveSheet` を選択して実行。
2. 権限の承認（スプレッドシート読み取り・トリガー管理・外部 URL は FastAPI 利用時）。
3. 実行ログで合計が表示されることを確認。

スプレッドシートを開き直すとメニュー **自動化** が表示されます。

## 5. 日次トリガー

- メニュー **自動化 → 日次トリガーを再インストール**、または `installDailySalesTrigger` を実行。
- 時刻は **おおよそ 9 時（Asia/Tokyo）** です。分単位の正確な実行は保証されません。

## 6. FastAPI 連携（任意）

詳細: [script-properties.md](script-properties.md)

- 手動送信: メニュー **自動化 → FastAPI へ売上合計を送信**
- 日次自動 POST: `POST_SALES_TO_FASTAPI` = `true`（サーバー準備後のみ）

## 7. ロールバック

- トリガー: `removeDailySalesTrigger` または Apps Script → トリガー画面から削除。
- コード: clasp / バージョン履歴から復元。
- スプレッドシート: 変更前のコピーを Drive に保管。

## 8. ローカルテスト

```bash
npm run check
```

Google API は叩きません。`examples/sales.js` の純粋ロジックのみ検証します。
