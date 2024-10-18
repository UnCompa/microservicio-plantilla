FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm i --production && \
  npx prisma generate && \
  npx prisma migrate deploy && \
  npm install @nestjs/cli && \
  npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

ENV NODE_ENV=production
ENV LOG_LEVEL=error

EXPOSE 3000

CMD ["node", "dist/main"]
