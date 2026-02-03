-- Tabela do perfil da artista (Sobre) - uma única linha para Maria Pita
CREATE TABLE IF NOT EXISTS artist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL DEFAULT 'Maria Pita',
    photo_url TEXT NOT NULL,
    description TEXT NOT NULL,
    mission TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garantir uma única linha (opcional: usar id fixo)
-- Inserir registro inicial da Maria Pita (rode apenas uma vez; para trocar foto/texto, edite no Supabase)
INSERT INTO artist (name, photo_url, description, mission) VALUES (
    'Maria Pita',
    '/images/maria-pita-sobre.png',
    'Maria Pita é cantora e compositora gospel, nascida e criada no Brasil. Desde cedo encontrou na música e na fé a força para seguir seu chamado. Sua voz e suas canções carregam uma mensagem de esperança, amor e adoração que atravessa gerações.

Com influências que vão do pop ao worship contemporâneo, Maria Pita une letras que falam direto ao coração a melodias que ficam na memória. Já se apresentou em igrejas, congressos e eventos por todo o país, levando adoração e testemunho onde vai.

Para ela, a música é mais que profissão: é ministério. Cada show e cada música são uma oportunidade de conectar pessoas a Deus e de celebrar a vida com gratidão.',
    'Usar o dom da música para glorificar a Deus e levar pessoas a uma experiência transformadora com Cristo, através de canções que falam ao coração e elevam a alma.'
);

CREATE INDEX IF NOT EXISTS idx_artist_id ON artist(id);

ALTER TABLE artist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on artist" ON artist FOR SELECT USING (true);
CREATE POLICY "Allow service role all on artist" ON artist FOR ALL USING (true);
