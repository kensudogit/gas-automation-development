# GAS operations and safety

## Setup
1. Create a bound Apps Script project from Google Sheets or a standalone Apps Script project.
2. Copy relevant code and review `appsscript.json` scopes.
3. Run the read-only example with a test spreadsheet first.
4. Approve OAuth access after verifying the requested scopes.
5. For clasp: install and authenticate separately, review target script ID and environment before `clasp push` or `clasp deploy`.

## Triggers
- Time-driven triggers are approximate; never promise an exact 09:30 execution.
- Ensure trigger handler is idempotent; consider LockService and durable job keys.
- Monitor failures in Apps Script executions and configure notification procedures.

## FastAPI integration
- Call HTTPS endpoints with UrlFetchApp and validate response status and JSON shape.
- Use Script Properties for non-public configuration and an appropriate secret-management design for high-value credentials.
- Enforce server-side auth, authorization, rate limits, and replay protections.

## Production checklist
- Confirm owner, deployment target, scopes, quota limits, privacy impact, and test evidence.
- Back up scripts and any affected Sheet data before changes.
- Obtain explicit approval for external mail, calendar changes, Drive deletes, or production writes.
- Document rollback steps and who can revoke triggers/deployments.
