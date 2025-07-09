# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências (com cache eficiente)
RUN npm ci

# Copia o restante da aplicação
COPY . .

# Build do projeto
RUN npm run build

# -------- Stage 2: Production --------
FROM nginx:1.25-alpine

# Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia build da aplicação para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expondo a porta padrão
EXPOSE 80

# Healthcheck opcional
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --spider http://localhost || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]    