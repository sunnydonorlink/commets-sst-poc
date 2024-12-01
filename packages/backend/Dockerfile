FROM node:18-bullseye-slim

WORKDIR /app/

COPY package.json prisma /app/
RUN npm install

RUN npx prisma generate
CMD echo "$DATABASE_URL" 
ADD /src /app/src
RUN npm run build

ENTRYPOINT ["node", "/app/dist/index.js"]