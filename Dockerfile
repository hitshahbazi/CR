# ---------- Build client ----------
FROM node:20-alpine AS client-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client ./
RUN npm run build


# ---------- Run server ----------
FROM node:20-alpine AS server
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend source (everything except client build, which we copy from stage)
COPY . .

# Overwrite client/build with the built output
COPY --from=client-build /app/client/build ./client/build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]