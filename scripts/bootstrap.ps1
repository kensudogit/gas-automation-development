# GAS スターターのローカル準備（clasp は npx 経由）
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "Installing npm dependencies (optional @google/clasp)..."
npm install

Write-Host "Syncing SalesLogic.js..."
npm run sync

Write-Host "Running tests..."
npm run validate

if (-not (Test-Path ".clasp.json")) {
  Copy-Item "clasp.json.example" ".clasp.json"
  Write-Host "Created .clasp.json from example — set scriptId before push."
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. npx clasp login"
Write-Host "  2. Edit .clasp.json → scriptId"
Write-Host "  3. npx clasp push"
Write-Host "  4. Run calculateSalesFromActiveSheet in Apps Script editor"
Write-Host "See references/setup-ja.md"
