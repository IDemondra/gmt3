#!/bin/sh
set -e

echo "[INIT] Starting GMT+3 backend..."
exec bun run index.ts
