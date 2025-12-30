# 1. Base Image
FROM node:18-alpine AS base

# 2. Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install ALL dependencies including devDependencies (needed for build)
RUN npm ci

# 3. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (Critical for build)
RUN npx prisma generate

# Build the app
RUN npm run build

# 4. Production Runner Stage (The final, small image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# --- FIX START: Install tools needed for the init script ---
# We install these globally or locally so they are available for 'npm run docker:init'
RUN npm install -g ts-node typescript
RUN npm install papaparse @types/papaparse @prisma/client
# --- FIX END ---

# Copy the public assets
COPY --from=builder /app/public ./public

# Copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema/migrations/client for the init script
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy the generated client from builder to ensure it matches
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copy Scripts and Data
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/facebook_data.json ./facebook_data.json
COPY --from=builder --chown=nextjs:nodejs /app/merged_facebook_sentiment_results.csv ./merged_facebook_sentiment_results.csv
COPY --from=builder --chown=nextjs:nodejs /app/Comment_rows.csv ./Comment_rows.csv
# Ensure permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start the standalone server
CMD ["node", "server.js"]