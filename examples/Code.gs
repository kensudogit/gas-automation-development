/** Read-only example: totals amounts from column B in a sheet named 売上. */
function calculateSales() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open this script from a spreadsheet.');
  const sheet = spreadsheet.getSheetByName('売上');
  if (!sheet) throw new Error('Sheet 売上 not found.');
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const numRows = lastRow - 1;
  const rows = sheet.getRange(2, 2, numRows, 1).getValues();
  const total = rows.reduce((sum, row) => {
    const value = row[0];
    if (value === '' || value === null) return sum;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('Non-numeric sales amount found.');
    }
    return sum + value;
  }, 0);
  console.log(`Sales total: ${total}`);
  return total;
}
