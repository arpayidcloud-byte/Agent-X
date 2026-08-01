# syntax=docker/dockerfile:1
# Agent-X API server image (monorepo pnpm workspace).

FROM node:22-slim AS build
WORKDIR /app
# openssl CLI lets prisma generate detect the right engine target.
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
# Match the pnpm version that produced pnpm-lock.yaml (host: 9.15.0).
RUN npm install -g pnpm@9.15.0
COPY . .
RUN pnpm install --frozen-lockfile
# Generate the Prisma client (schema: packages/shared/persistence) so the
# production image ships a ready-to-query client (no .prisma/client otherwise).
RUN pnpm --filter @agent-xai/persistence db:generate
RUN pnpm --filter @agent-xai/api build

FROM node:22-slim
# Prisma query engine needs libssl/openssl at runtime (Debian glibc build).
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 4000
CMD ["node", "apps/api/dist/agentx-server.js"]
