#!/bin/sh
set -e

echo "[INIT] Starting GMT+3 backend..."
echo "[DB] Applying Drizzle migrations..."
bun x drizzle-kit migrate
exec bun run index.ts
