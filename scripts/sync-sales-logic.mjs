#!/usr/bin/env node
/**
 * Copy sumSales from examples/sales.js → gas/SalesLogic.js (GAS global scope).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'examples', 'sales.js');
const targetPath = path.join(root, 'gas', 'SalesLogic.js');

const source = fs.readFileSync(sourcePath, 'utf8');
const fnMatch = source.match(/function sumSales[\s\S]*?\n}\n/);
if (!fnMatch) {
  console.error('sumSales not found in examples/sales.js');
  process.exit(1);
}

const header = `/**
 * Pure sales aggregation (no Google APIs).
 * AUTO-GENERATED from examples/sales.js — run: npm run sync
 */
`;

fs.writeFileSync(targetPath, header + fnMatch[0] + '\n', 'utf8');
console.log('Synced gas/SalesLogic.js from examples/sales.js');
