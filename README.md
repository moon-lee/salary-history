# Salary History — Finance Flow AI Extension

## Dev (standalone)
```bash
npm install
npm run dev   # http://localhost:5173
```

## Build + Install
```bash
npm run build   # or: node D:/finance_flow_ai/scripts/sdk/cli.mjs build .
# Then in Finance Flow AI: Extensions → Install Folder → pick build/extension → Restart
```

Uses `src/styles/*` (tokens + layout) and `finance-logger` for consistent UI/logging.

## Install-time schema note

Tables (`salary_history_pay_slips`, `salary_history_rate_history`) are created
at install time by the app's `ExtensionInstaller` → `createExtensionTables`
(`table-ddl.ts`), which emits plain `CREATE TABLE IF NOT EXISTS` without
`CHECK` constraints, secondary indexes, or the single-current partial-unique
index the old Core migration `006` provided. The single-current invariant
(at most one rate row with `effective_to IS NULL`) is enforced in code by
`addNewRate()` (`src/dao/pay-rate-history.ts` — closes the previous current
row before inserting the new one). Same trade-off as every user extension.
