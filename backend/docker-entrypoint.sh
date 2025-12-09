#!/bin/bash
set -e

echo "🚀 Iniciando backend..."

# Criar diretório do banco se não existir
mkdir -p instance

# Verificar se o banco já existe
if [ ! -f "instance/default.db" ]; then
    echo "Criando e populando banco de dados..."
    python create_and_populate_db.py
    echo "Banco de dados criado e populado!"
else
    echo "Banco de dados já existe, pulando criação..."
fi

# Executar comando passado
exec "$@"

