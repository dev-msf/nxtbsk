FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"] 