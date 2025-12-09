FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

