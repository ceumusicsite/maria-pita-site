-- Tabela de Configurações do Site (Redes Sociais)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instagram_url TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    spotify_url TEXT NOT NULL,
    tiktok_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Remover políticas se existirem
DROP POLICY IF EXISTS "Allow public read access on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow service role all on site_settings" ON site_settings;

-- Políticas RLS
CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow service role all on site_settings" ON site_settings FOR ALL USING (true);

-- Inserir dados iniciais
INSERT INTO site_settings (instagram_url, youtube_url, spotify_url, tiktok_url)
VALUES (
    'https://www.instagram.com/mariapitacantora_/',
    'https://www.youtube.com/@mariapitacantora',
    'https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n',
    'https://www.tiktok.com/@mariapitacantora'
);

CREATE INDEX IF NOT EXISTS idx_site_settings_id ON site_settings(id);
