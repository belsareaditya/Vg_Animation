FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm i -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
