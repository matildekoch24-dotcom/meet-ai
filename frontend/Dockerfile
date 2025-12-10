# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
ENV NODE_ENV=production

# Install serve to run the application
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

# Railway provides the PORT environment variable dynamically
EXPOSE 3000

# Start the app using serve
# -s: Single-page application mode (redirects 404s to index.html)
# -l: Listen on specific port
CMD serve -s dist -l tcp://0.0.0.0:$PORT
