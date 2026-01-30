# Backend - Maria Pita API

API REST desenvolvida com FastAPI para o site oficial de Maria Pita.

## 🚀 Instalação

1. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações do Supabase
```

4. Configure o banco de dados Supabase:
   - Veja o guia completo em `SUPABASE_SETUP.md`
   - Execute o script SQL em `database_schema.sql` no SQL Editor do Supabase

5. Execute o seed para popular o banco (opcional):
```bash
python seed_data.py
```

6. Inicie o servidor:
```bash
python server.py
# ou
uvicorn server:app --reload
```

## 📚 Endpoints

A API está disponível em `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`

### Tabelas do Banco de Dados

- `releases` - Lançamentos musicais
- `shows` - Shows e apresentações
- `products` - Produtos da loja
- `newsletter` - Inscritos na newsletter
- `booking_requests` - Solicitações de contratação

## 🛠️ Tecnologias

- FastAPI
- Supabase (PostgreSQL)
- Pydantic
- Python-dotenv

## 📖 Documentação Adicional

- `SUPABASE_SETUP.md` - Guia completo de configuração do Supabase
- `database_schema.sql` - Schema SQL para criar as tabelas
