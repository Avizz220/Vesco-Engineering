# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including dev (for build)
RUN npm install

COPY . .

# Generate Prisma Client & Build TypeScript
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Run
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
