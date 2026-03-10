# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production

# ── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled Angular app (Angular 17+ application builder outputs to browser/)
COPY --from=builder /app/dist/demo/browser /usr/share/nginx/html

# nginx config: serve SPA with fallback routing
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # SPA fallback: unknown paths return index.html for Angular Router\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Disable caching for index.html so deploys are picked up immediately\n\
    location = /index.html {\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
