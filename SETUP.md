# Guia de Setup - Maria Pita

Este guia irá ajudá-lo a configurar o projeto localmente.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **MongoDB** - [Download MongoDB](https://www.mongodb.com/try/download/community) ou use MongoDB Atlas (cloud)
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🔧 Configuração Passo a Passo

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd maria-pita
```

### 2. Configuração do Backend

```bash
# Navegue até a pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Copie o arquivo de exemplo e edite conforme necessário
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac

# Edite o arquivo .env com suas configurações do MongoDB
```

**Configuração do MongoDB:**

Se estiver usando MongoDB local:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="maria_pita_db"
CORS_ORIGINS="http://localhost:3000"
```

Se estiver usando MongoDB Atlas:
```env
MONGO_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="maria_pita_db"
CORS_ORIGINS="http://localhost:3000"
```

**Popule o banco de dados (opcional):**
```bash
python seed_data.py
```

**Inicie o servidor:**
```bash
python server.py
# ou
uvicorn server:app --reload
```

O backend estará rodando em `http://localhost:8000`
Documentação da API: `http://localhost:8000/docs`

### 3. Configuração do Frontend

Abra um novo terminal:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install
# ou
yarn install

# Configure as variáveis de ambiente
# Copie o arquivo de exemplo
copy .env.example .env  # Windows
# ou
cp .env.example .env    # Linux/Mac

# Edite o arquivo .env
# Se o backend estiver rodando localmente:
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Inicie o servidor de desenvolvimento:**
```bash
npm start
# ou
yarn start
```

O frontend estará rodando em `http://localhost:3000`

## ✅ Verificação

1. Backend rodando: Acesse `http://localhost:8000/docs` - você deve ver a documentação interativa da API
2. Frontend rodando: Acesse `http://localhost:3000` - você deve ver a aplicação React
3. Teste a API: Na documentação (`/docs`), teste o endpoint `GET /api/releases`

## 🐛 Troubleshooting

### Erro de conexão com MongoDB

- Verifique se o MongoDB está rodando: `mongosh` ou `mongo`
- Verifique a URL de conexão no arquivo `.env`
- Se estiver usando MongoDB Atlas, verifique se seu IP está na whitelist

### Erro de CORS

- Certifique-se de que `CORS_ORIGINS` no backend inclui a URL do frontend
- Verifique se ambas as aplicações estão rodando nas portas corretas

### Erro ao instalar dependências do frontend

- Tente limpar o cache: `npm cache clean --force`
- Delete `node_modules` e `package-lock.json`, depois execute `npm install` novamente

### Porta já em uso

- Backend: Altere a porta no `server.py` ou use `uvicorn server:app --port 8001`
- Frontend: O React perguntará se deseja usar outra porta automaticamente

## 📚 Próximos Passos

- Explore a documentação da API em `/docs`
- Consulte `design_guidelines.json` para entender o design system
- Leia os READMEs específicos em `backend/README.md` e `frontend/README.md`

## 🆘 Suporte

Se encontrar problemas, verifique:
1. Versões do Python e Node.js
2. Logs do backend e frontend
3. Configurações do arquivo `.env`
4. Status do MongoDB
