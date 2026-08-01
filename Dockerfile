# syntax=docker/dockerfile:1
# Agent-X API server image (monorepo pnpm workspace).

FROM node:22-alpine AS build
WORKDIR /app
# Match the pnpm version that produced pnpm-lock.yaml (host: 9.15.0).
RUN npm install -g pnpm@9.15.0
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @agent-xai/api build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 4000
CMD ["node", "apps/api/dist/agentx-server.js"]
