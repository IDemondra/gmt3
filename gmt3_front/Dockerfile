# ── Build ──
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Base API côté CLIENT (navigateur) : same-origin, routée vers le back par Traefik.
# Inlinée dans le bundle client au build (préfixe VITE_).
ARG VITE_API_BASE=/api
ARG VITE_BACKEND_URL=
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN bun run build

# ── Runtime (serveur SSR Astro) ──
FROM oven/bun:latest AS runtime

WORKDIR /app

ENV NODE_ENV=production
# L'adapter node écoute sur HOST:PORT ; HOST=0.0.0.0 obligatoire en conteneur.
ENV HOST=0.0.0.0
ENV PORT=4321
# Base API côté SERVEUR (fetch SSR dans les .astro) -> backend interne.
ENV API_BASE_INTERNAL=http://gmt3_backend:3000/api

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4321

CMD ["bun", "./dist/server/entry.mjs"]
