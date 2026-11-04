---
name: gas-automation-development
description: Build, review, test, and operate Google Apps Script automations for Sheets, Gmail, Calendar, Drive, scheduled triggers, and secure FastAPI integrations. Use when creating or modifying GAS projects, clasp workflows, or Google Workspace automation.
---

# GAS automation development

Use this skill for Google Apps Script development and maintenance.

## Workflow
1. Identify the target Google services, spreadsheet IDs, deployment environment, expected schedule, quotas, and consent requirements. Never invent identifiers or credentials.
2. Inspect existing source and `appsscript.json` before modifying it. Prefer least-privilege OAuth scopes; request user approval before sending emails, modifying calendars, or changing production data.
3. Write small idempotent functions with clear inputs and outputs. Batch Sheets operations; avoid per-row API calls. Use `LockService` for concurrent triggers and `PropertiesService` for non-public configuration, not for large secrets when a dedicated secret manager is available.
4. Treat external URLs and spreadsheet content as untrusted. Validate inputs, protect tokens, and avoid logging personal information or secrets.
5. Handle quotas, HTTP failures, retries with bounded exponential backoff, and trigger time variability. GAS time-driven triggers are not exact-time schedulers.
6. Separate pure logic from Google service adapters so Node.js tests can run locally. Use `clasp` only when available and authorized; never silently deploy to production.
7. For a FastAPI integration use HTTPS, a server-side authentication mechanism, timeout handling, and explicit authorization. Do not embed private keys in browser code.
8. Before destructive edits, record rollback instructions and request confirmation. Report what was tested versus what needs real Google authorization.

## Outputs
- Working `.gs` or `.js` code and `appsscript.json` where needed.
- Setup and authorization steps, explicit scopes, test plan, and rollback plan.
- Risks, quota assumptions, and verification results.

## References
- Read `references/setup-ja.md` for step-by-step spreadsheet and clasp setup (Japanese).
- Read `references/operations.md` for deployment, security, and trigger practices.
- Use `gas/` as the clasp-ready starter (Sheets sales, triggers, FastAPI client stub).
- Adapt `examples/Code.gs` and `examples/appsscript.json` for the minimal read-only sample.
- Run `npm run check` (sync SalesLogic, Node tests, Python validate) before push.
- Run `scripts/bootstrap.ps1` on Windows for first-time clasp setup via `npx clasp`.

## Never
- Claim an external deployment, mail send, or trigger creation succeeded without tool evidence.
- Run production writes or external communications without explicit user authorization.
- Promise no warnings in all environments; distinguish skill metadata warnings from runtime authorization and quota errors.
