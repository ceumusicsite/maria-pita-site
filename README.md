# Maria Pita - Site Oficial

Site oficial da artista gospel Maria Pita, desenvolvido com React (frontend) e FastAPI (backend).

## 🎨 Design

O site segue um design moderno com tema escuro e acentos neon rosa, criando uma experiência imersiva que remete ao palco de um show. Consulte `design_guidelines.json` para mais detalhes sobre o design system.

## 🏗️ Estrutura do Projeto

```
maria-pita/
├── backend/          # API FastAPI com MongoDB
│   ├── server.py     # Servidor principal
│   ├── requirements.txt
│   └── .env          # Variáveis de ambiente
├── frontend/         # Aplicação React
│   ├── src/          # Código fonte
│   ├── public/       # Arquivos estáticos
│   └── package.json
├── design_guidelines.json  # Diretrizes de design
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- MongoDB (local ou remoto)
- npm ou yarn

### Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Crie um ambiente virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente no arquivo `.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="maria_pita_db"
CORS_ORIGINS="http://localhost:3000"
```

5. Inicie o servidor:
```bash
python server.py
# ou
uvicorn server:app --reload
```

O backend estará disponível em `http://localhost:8000`

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

O frontend estará disponível em `http://localhost:3000`

## 📚 API Endpoints

### Releases
- `GET /api/releases` - Lista todos os releases
- `GET /api/releases?featured=true` - Lista releases em destaque
- `GET /api/releases/{id}` - Obtém um release específico
- `POST /api/releases` - Cria um novo release

### Shows
- `GET /api/shows` - Lista todos os shows
- `GET /api/shows?state=SP` - Lista shows por estado
- `POST /api/shows` - Cria um novo show

### Products
- `GET /api/products` - Lista todos os produtos
- `GET /api/products?category=camisetas` - Lista produtos por categoria
- `GET /api/products?featured=true` - Lista produtos em destaque
- `GET /api/products/{id}` - Obtém um produto específico
- `POST /api/products` - Cria um novo produto

### Newsletter
- `POST /api/newsletter` - Inscreve um email na newsletter

### Booking
- `POST /api/booking` - Cria uma solicitação de contratação
- `GET /api/booking` - Lista todas as solicitações
- `GET /api/booking?status=pending` - Lista por status

## 🛠️ Tecnologias

### Backend
- FastAPI
- MongoDB (Motor)
- Pydantic
- Python-dotenv

### Frontend
- React 18
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- Craco

## 📝 Scripts Disponíveis

### Na raiz do projeto (package.json)
- `npm run dev` ou `npm run dev:frontend` - Inicia o frontend
- `npm run dev:backend` - Inicia o backend
- `npm run build` - Cria build de produção do frontend
- `npm install` - Instala dependências do frontend
- `npm run install:backend` - Instala dependências do backend
- `npm run install:all` - Instala todas as dependências
- `npm run seed` - Popula o banco com dados iniciais

### Backend (dentro de `backend/`)
- `python server.py` - Inicia o servidor
- `python seed_data.py` - Popula o banco com dados iniciais
- `uvicorn server:app --reload` - Inicia com reload automático

### Frontend (dentro de `frontend/`)
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm test` - Executa os testes

## 🎯 Funcionalidades

- ✨ Design moderno com tema escuro e acentos neon rosa
- 🎵 Galeria de releases musicais
- 📅 Agenda de shows
- 🛍️ Loja de produtos/merchandising
- 📧 Newsletter
- 📞 Formulário de contratação/booking
- 📱 Design responsivo

## 📄 Licença

Este projeto é privado e propriedade de Maria Pita.
