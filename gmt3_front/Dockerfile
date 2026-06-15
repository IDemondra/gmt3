FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

# Same-origin API path baked into the bundle at build time (Vite static replace)
ARG VITE_API_BASE=/api
ARG VITE_BACKEND_URL=
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
