# Sistema de Diagnósticos de Rede

Sistema para monitoramento e análise de diagnósticos de rede com dashboard interativo.

## Estrutura do Projeto

```
net-diagnostics/
├── backend/              # API Flask (Python)
│   ├── app/
│   │   ├── models/      # Modelos do banco de dados
│   │   ├── routes/      # Endpoints da API
│   │   ├── services/    # Lógica de negócio
│   │   └── utils/       # Validadores e utilitários
│   ├── instance/        # Banco de dados SQLite (gerado)
│   ├── requirements.txt # Dependências Python
│   └── run.py          # Inicializa a aplicação
│
├── frontend/            # Interface React
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/      # Páginas da aplicação
│   │   └── services/   # Cliente API
│   └── package.json    # Dependências Node.js
│
├── Makefile            # Comandos simplificados
└── README.md           # Este arquivo
```

## Início Rápido

### Windows

```bash
# Setup inicial
setup.bat

# Rodar a aplicação
run.bat
```

### Manual (Passo a Passo)

#### 1. Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual
.venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Criar banco de dados
python create_and_populate_db.py

# Voltar para a raiz
cd ..
```

#### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Voltar para a raiz
cd ..
```

#### 3. Executar

```bash
# Agora use o run.bat
run.bat
```

## Login

- **Usuário:** `admin`
- **Senha:** `admin`

## Comandos Úteis

```bash
run.bat              # Roda aplicação completa
run.bat backend      # Apenas backend
run.bat frontend     # Apenas frontend
run.bat db-setup     # Recriar banco de dados
run.bat clean        # Limpar cache
run.bat help         # Ver ajuda
```

## URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/diagnostics` - Listar diagnósticos
- `GET /api/diagnostics/:id` - Buscar por ID
- `GET /api/diagnostics/aggregate` - Dados agregados
- `GET /api/diagnostics/statistics` - Estatísticas
