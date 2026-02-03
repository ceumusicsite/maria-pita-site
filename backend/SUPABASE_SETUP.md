# Configuração do Supabase - Maria Pita

Este guia explica como configurar o banco de dados Supabase para o projeto Maria Pita.

## 📋 Pré-requisitos

- Conta no Supabase (https://supabase.com)
- Projeto criado no Supabase

## 🗄️ Configuração do Banco de Dados

### 1. Criar as Tabelas

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Copie e cole o conteúdo do arquivo `database_schema.sql`
5. Clique em **Run** para executar o script

Isso criará todas as tabelas necessárias:
- `releases` - Lançamentos musicais
- `shows` - Shows e apresentações
- `products` - Produtos da loja
- `newsletter` - Inscritos na newsletter
- `booking_requests` - Solicitações de contratação

### 2. Configurar Variáveis de Ambiente

No arquivo `backend/.env`, configure:

```env
SUPABASE_URL=https://ofuzaorumwmezffazdrj.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdXphb3J1bXdtZXpmZmF6ZHJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTc3ODgzMCwiZXhwIjoyMDg1MzU0ODMwfQ.a3vbqrMNQdRdSLFsWGD5z2y01TczI0aFDk4o7j6TtMY
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdXphb3J1bXdtZXpmZmF6ZHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3Nzg4MzAsImV4cCI6MjA4NTM1NDgzMH0.c048CVQe7qbv5-nErgDvrdlBjQK7KkY0RBpVJTPFG-k
CORS_ORIGINS=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- `SUPABASE_SERVICE_KEY` é a chave de serviço (service_role) - use apenas no backend
- `SUPABASE_ANON_KEY` é a chave pública (anon) - pode ser usada no frontend se necessário
- **NUNCA** exponha a `SUPABASE_SERVICE_KEY` no frontend ou em repositórios públicos

### 3. Popular o Banco de Dados (Opcional)

Execute o script de seed para popular o banco com dados de exemplo:

```bash
cd backend
python seed_data.py
```

## 🔒 Segurança (Row Level Security)

O schema SQL já configura Row Level Security (RLS) nas tabelas:

- **Leitura pública**: Qualquer um pode ler os dados
- **Escrita**: Apenas com a service_role key (usada pelo backend)
- **Newsletter e Booking**: Permitem inserção pública (para formulários)

## 📊 Verificar Dados

Você pode verificar os dados diretamente no Supabase:

1. Acesse **Table Editor** no painel do Supabase
2. Selecione qualquer tabela para ver os dados
3. Use o **SQL Editor** para consultas personalizadas

## 🧪 Testar a API

Após configurar tudo, teste a API:

```bash
# Inicie o servidor
cd backend
python server.py

# Em outro terminal, teste os endpoints
curl http://localhost:8000/api/releases
curl http://localhost:8000/api/shows
curl http://localhost:8000/api/products
```

Ou acesse a documentação interativa em: http://localhost:8000/docs

## 🔧 Troubleshooting

### Erro de conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se as tabelas foram criadas corretamente

### Erro de permissão
- Certifique-se de que o RLS está configurado corretamente
- Verifique se está usando a `SUPABASE_SERVICE_KEY` no backend
- Confirme que as políticas RLS foram criadas

### Erro ao inserir dados
- Verifique se os tipos de dados correspondem ao schema
- Confirme que campos obrigatórios estão preenchidos
- Verifique os logs do Supabase no painel
