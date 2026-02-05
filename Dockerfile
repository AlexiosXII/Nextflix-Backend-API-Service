# Multi-stage Dockerfile using Bun
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy lock and manifest first to leverage layer caching
COPY package.json bun.lockb tsconfig.json tsconfig.build.json nest-cli.json .swcrc ./

# Install dependencies (including dev deps) and build
RUN bun install --frozen-lockfile

# Copy source and build
COPY src ./src
RUN bun run build

FROM oven/bun:latest AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Only copy manifests and install production deps
COPY package.json bun.lockb .swcrc ./
RUN bun install --production --frozen-lockfile

EXPOSE 3000

# Start the built Nest application
CMD ["node", "dist/main"]
