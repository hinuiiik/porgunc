# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG DATABASE_URI
ARG NEXT_PUBLIC_SERVER_URL
ARG CRON_SECRET
ARG PREVIEW_SECRET
ARG PAYLOAD_SECRET

ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV CRON_SECRET=${CRON_SECRET}
ENV PREVIEW_SECRET=${PREVIEW_SECRET}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm exec payload migrate --yes --env=production; \
  elif [ -f yarn.lock ]; then \
    npx payload migrate --yes --env=production; \
  elif [ -f package-lock.json ]; then \
    npx payload migrate --yes --env=production; \
  else \
    echo "No lockfile found for migration." && exit 1; \
  fi

# 🏗️ Build Next.js after migrations
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV CRON_SECRET=${CRON_SECRET}
ENV PREVIEW_SECRET=${PREVIEW_SECRET}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js
