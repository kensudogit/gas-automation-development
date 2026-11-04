/**
 * Pure sales aggregation (no Google APIs).
 * AUTO-GENERATED from examples/sales.js — run: npm run sync
 */
function sumSales(rows) {
  return rows.reduce((sum, row) => {
    const value = row[0];
    if (value === '' || value === null) return sum;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError('Non-numeric sales amount');
    }
    return sum + value;
  }, 0);
}

