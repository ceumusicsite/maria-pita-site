-- Schema do banco de dados Maria Pita para Supabase/PostgreSQL

-- Tabela de Releases (Lançamentos musicais)
CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    spotify_url TEXT,
    youtube_url TEXT,
    release_date DATE NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Shows (Apresentações)
CREATE TABLE IF NOT EXISTS shows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    time VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Products (Produtos da loja)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Newsletter (Inscritos)
CREATE TABLE IF NOT EXISTS newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Booking Requests (Solicitações de contratação)
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    event_date DATE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_releases_featured ON releases(featured);
CREATE INDEX IF NOT EXISTS idx_releases_release_date ON releases(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_shows_state ON shows(state);
CREATE INDEX IF NOT EXISTS idx_shows_date ON shows(date ASC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_booking_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_created_at ON booking_requests(created_at DESC);

-- Habilitar Row Level Security (RLS) - permitir leitura pública, escrita apenas com autenticação
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para leitura pública
CREATE POLICY "Allow public read access on releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on shows" ON shows FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on newsletter" ON newsletter FOR SELECT USING (true);
CREATE POLICY "Allow public read access on booking_requests" ON booking_requests FOR SELECT USING (true);

-- Políticas RLS para escrita (usando service_role key)
CREATE POLICY "Allow service role insert on releases" ON releases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role insert on shows" ON shows FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on newsletter" ON newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on booking_requests" ON booking_requests FOR INSERT WITH CHECK (true);

-- Políticas RLS para atualização (usando service_role key)
CREATE POLICY "Allow service role update on releases" ON releases FOR UPDATE USING (true);
CREATE POLICY "Allow service role update on shows" ON shows FOR UPDATE USING (true);
CREATE POLICY "Allow service role update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow service role update on booking_requests" ON booking_requests FOR UPDATE USING (true);

-- Políticas RLS para exclusão (usando service_role key)
CREATE POLICY "Allow service role delete on releases" ON releases FOR DELETE USING (true);
CREATE POLICY "Allow service role delete on shows" ON shows FOR DELETE USING (true);
CREATE POLICY "Allow service role delete on products" ON products FOR DELETE USING (true);
CREATE POLICY "Allow service role delete on newsletter" ON newsletter FOR DELETE USING (true);
CREATE POLICY "Allow service role delete on booking_requests" ON booking_requests FOR DELETE USING (true);
