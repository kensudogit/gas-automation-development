'use strict';
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
module.exports = { sumSales };
