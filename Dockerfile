# Stage 1 - Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_NEWSAPI_KEY
ARG VITE_GUARDIAN_KEY
ARG VITE_NYT_KEY
ENV VITE_NEWSAPI_KEY=$VITE_NEWSAPI_KEY
ENV VITE_GUARDIAN_KEY=$VITE_GUARDIAN_KEY
ENV VITE_NYT_KEY=$VITE_NYT_KEY

RUN npm run build

# Stage 2 - Server
FROM nginx:alpine AS server
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
