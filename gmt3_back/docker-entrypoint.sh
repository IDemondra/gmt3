#!/bin/sh
set -e

DB_FILE="./data/gmt3.db"

# Apply schema only on a fresh DB — drizzle-kit push is not idempotent (libsql
# errors on pre-existing indexes). On an already-provisioned volume, skip.
TABLE_COUNT=$(bun -e "import {Database} from 'bun:sqlite'; const db=new Database('${DB_FILE}'); console.log(db.query(\"SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'\").get().n)")
TABLE_COUNT=${TABLE_COUNT:-0}

if [ "$TABLE_COUNT" -eq 0 ]; then
	echo "[INIT] Empty DB — applying drizzle schema..."
	bunx drizzle-kit push --force
else
	echo "[INIT] Schema present (${TABLE_COUNT} tables) — skipping push."
fi

echo "[INIT] Starting GMT+3 backend..."
exec bun run index.ts
