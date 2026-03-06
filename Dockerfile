FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN mkdir -p data
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
CMD [" node\,\server/index.js\]
