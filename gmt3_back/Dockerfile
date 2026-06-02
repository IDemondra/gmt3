FROM jarredsumner/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

# Ensure data directory exists
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
