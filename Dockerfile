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

# Instala Express para servir os arquivos da pasta dist
RUN npm install express

# Garante que o server.js está na raiz
# (caso você o tenha criado fora de /src ou similar)

# Expondo a porta que o Express usará
EXPOSE 3000

# Comando de inicialização
CMD ["node", "server.js"]