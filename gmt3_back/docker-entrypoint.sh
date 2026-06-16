#!/bin/sh
set -e

echo "[INIT] Applying pending migrations..."
bunx drizzle-kit migrate

echo "[INIT] Starting GMT+3 backend..."
exec bun run index.ts
