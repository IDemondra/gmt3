#!/bin/sh
set -e

echo "[INIT] Applying drizzle schema to volume DB..."
bunx drizzle-kit push --force

echo "[INIT] Starting GMT+3 backend..."
exec bun run index.ts
