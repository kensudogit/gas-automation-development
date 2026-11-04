'use strict';
const assert = require('node:assert/strict');
const { sumSales } = require('../examples/sales');
assert.equal(sumSales([[100], [200], [''], [0]]), 300);
assert.equal(sumSales([]), 0);
assert.throws(() => sumSales([['abc']]), /Non-numeric/);
console.log('sales tests passed');
