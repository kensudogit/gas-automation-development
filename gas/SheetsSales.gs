/** Spreadsheet adapter: sheet 売上 column B from row 2. */
var SALES_SHEET_NAME = '売上';
var SALES_AMOUNT_COLUMN = 2;
var SALES_DATA_START_ROW = 2;

function getSalesSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Open this script from a bound spreadsheet project.');
  }
  const sheet = spreadsheet.getSheetByName(SALES_SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found: ' + SALES_SHEET_NAME);
  }
  return sheet;
}

function readSalesAmountRows_() {
  const sheet = getSalesSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < SALES_DATA_START_ROW) return [];
  const numRows = lastRow - SALES_DATA_START_ROW + 1;
  return sheet
    .getRange(SALES_DATA_START_ROW, SALES_AMOUNT_COLUMN, numRows, 1)
    .getValues();
}

/** Manual / menu entry: compute total and log (read-only). */
function calculateSalesFromActiveSheet() {
  const rows = readSalesAmountRows_();
  const total = sumSales(rows);
  console.log('Sales total: ' + total);
  return total;
}

/** Time-driven trigger handler (idempotent, uses lock). */
function runDailySalesReport() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    console.warn('runDailySalesReport: could not acquire lock, skipping.');
    return;
  }
  try {
    const total = calculateSalesFromActiveSheet();
    maybePostSalesTotalToFastApi_(total);
  } finally {
    lock.releaseLock();
  }
}

/** POST only when POST_SALES_TO_FASTAPI=true and FastAPI is configured. */
function maybePostSalesTotalToFastApi_(total) {
  const enabled =
    PropertiesService.getScriptProperties().getProperty('POST_SALES_TO_FASTAPI') ===
    'true';
  if (!enabled) return;
  try {
    postSalesTotalToFastApi_(total);
    console.log('Posted sales total to FastAPI.');
  } catch (err) {
    console.error('FastAPI post failed: ' + err.message);
    throw err;
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('自動化')
    .addItem('売上合計を計算（ログ）', 'calculateSalesFromActiveSheet')
    .addItem('日次トリガーを再インストール', 'installDailySalesTrigger')
    .addItem('FastAPI へ売上合計を送信（要設定）', 'manualPostSalesToFastApi')
    .addToUi();
}

/** Menu: one-off POST when Script Properties are configured. */
function manualPostSalesToFastApi() {
  try {
    const total = calculateSalesFromActiveSheet();
    postSalesTotalToFastApi_(total);
    SpreadsheetApp.getActiveSpreadsheet().toast('FastAPI へ送信しました', '自動化', 5);
  } catch (err) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '送信失敗: ' + err.message,
      '自動化',
      8
    );
    throw err;
  }
}
