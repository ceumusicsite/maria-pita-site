-- Criar tabela de notícias
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image TEXT,
    icon TEXT DEFAULT 'newspaper',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por data
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);

-- Criar índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- Criar índice para busca por publicado
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);

-- Inserir dados de exemplo
INSERT INTO news (title, excerpt, content, category, date, icon, published) VALUES
('Novo Single em Breve', 'Prepare-se para o novo single que está chegando! Uma explosão de energia e emoção.', 'Maria Pita está prestes a lançar seu novo single que promete agitar a cena musical. Com uma produção impecável e letras marcantes, este lançamento representa um novo capítulo na carreira da artista.', 'Lançamento', NOW(), 'music', true),

('Entrevista Exclusiva', 'Confira a entrevista completa onde Maria Pita fala sobre o processo criativo do novo álbum.', 'Em uma conversa franca e inspiradora, Maria Pita abre o coração para falar sobre as inspirações por trás do novo álbum, os desafios enfrentados durante a produção e seus planos para o futuro.', 'Mídia', NOW() - INTERVAL ''1 day'', 'radio', true),

('Bastidores da Turnê', 'Veja fotos e vídeos exclusivos dos bastidores da última apresentação.', 'Confira momentos únicos e especiais dos bastidores da turnê. Desde a preparação antes do show até os momentos de descontração com a equipe, tudo que você não viu no palco.', 'Bastidores', NOW() - INTERVAL ''2 days'', 'newspaper', true),

('Clipe Novo Atinge 1 Milhão de Views', 'O clipe mais recente ultrapassa a marca de 1 milhão de visualizações em tempo recorde!', 'Em menos de uma semana, o novo clipe de Maria Pita já conquistou mais de 1 milhão de visualizações no YouTube, provando mais uma vez a força e o carisma da artista junto ao público.', 'Lançamento', NOW() - INTERVAL ''3 days'', 'music', true),

('Show Esgotado em São Paulo', 'Apresentação especial na capital paulista teve todos os ingressos vendidos.', 'O show de Maria Pita em São Paulo foi um sucesso absoluto, com ingressos esgotados semanas antes do evento. A apresentação foi marcada por momentos emocionantes e uma energia contagiante.', 'Bastidores', NOW() - INTERVAL ''5 days'', 'newspaper', true),

('Parceria Musical Anunciada', 'Maria Pita anuncia colaboração inédita com grande nome da música brasileira.', 'Uma parceria que promete ser histórica: Maria Pita confirmou colaboração com um dos maiores nomes da música brasileira. O projeto está em fase final de produção e deve ser lançado em breve.', 'Mídia', NOW() - INTERVAL ''7 days'', 'radio', true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_news_updated_at ON news;
CREATE TRIGGER trigger_update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_news_updated_at();
