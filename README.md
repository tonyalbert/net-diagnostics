# Sistema de Diagnósticos de Rede

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
├── docker-compose.yml
└── README.md           # Este arquivo
```

## Início Rápido

### Docker

```bash
# Construir e iniciar (backend + frontend + banco)
docker-compose up --build

# Rodar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

O banco de dados será criado e populado automaticamente na primeira execução.

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

# Rodar servidor
python run.py
```

#### 2. Frontend

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

## Login

- **Usuário:** `admin`
- **Senha:** `admin`

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/diagnostics` - Listar diagnósticos
- `GET /api/diagnostics/:id` - Buscar por ID
- `GET /api/diagnostics/aggregate` - Dados agregados
- `GET /api/diagnostics/statistics` - Estatísticas
