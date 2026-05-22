const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.startsWith('192.168.'));

const API_BASE_URL = isLocalhost ? (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000') : '';

// Static fallbacks containing live production data from Supabase
const staticReleases = [
  {
    "id": "b0797544-e0b4-42cd-b214-5311a1bc54dc",
    "title": "Se Levante",
    "description": "Confira o videoclipe oficial do single \"Se Levante\", uma mensagem forte de fé, superação e renovo.",
    "cover_url": "https://img.youtube.com/vi/mb7rskqf1A4/maxresdefault.jpg",
    "spotify_url": "https://open.spotify.com/album/se-levante",
    "youtube_url": "https://www.youtube.com/watch?v=mb7rskqf1A4",
    "release_date": "2024-01-15",
    "featured": true
  },
  {
    "id": "17073082-7d60-49c5-af41-49c6f99caa88",
    "title": "Sou Teu Pai (feat. Eli Soares)",
    "description": "Uma parceria emocionante e cheia de unção entre Maria Pita e Eli Soares na canção \"Sou Teu Pai\".",
    "cover_url": "https://img.youtube.com/vi/uX25tegU6SI/maxresdefault.jpg",
    "spotify_url": "https://open.spotify.com/album/sou-teu-pai-eli",
    "youtube_url": "https://www.youtube.com/watch?v=uX25tegU6SI",
    "release_date": "2024-03-05",
    "featured": true
  },
  {
    "id": "17073082-7d60-49c5-af41-49c6f99caa91",
    "title": "Sou Teu Pai (feat. Samuel Messias)",
    "description": "Uma parceria emocionante e cheia de unção entre Maria Pita e Samuel Messias na canção \"Sou Teu Pai\".",
    "cover_url": "https://img.youtube.com/vi/aioMdIBKvt8/maxresdefault.jpg",
    "spotify_url": "https://open.spotify.com/album/sou-teu-pai-samuel",
    "youtube_url": "https://www.youtube.com/watch?v=aioMdIBKvt8",
    "release_date": "2024-03-20",
    "featured": true
  },
  {
    "id": "c68c6344-93d4-4837-878b-1e77e8fa566c",
    "title": "Eu Cuido (feat. Eurice Diniz)",
    "description": "Canção de conforto e amor de Deus interpretada por Maria Pita em parceria com a consagrada Eurice Diniz.",
    "cover_url": "https://img.youtube.com/vi/2vnOLhljeV4/maxresdefault.jpg",
    "spotify_url": "https://open.spotify.com/album/eu-cuido",
    "youtube_url": "https://www.youtube.com/watch?v=2vnOLhljeV4",
    "release_date": "2025-02-10",
    "featured": true
  },
  {
    "id": "f9993658-2a47-41f6-865d-5a3d7482fcc0",
    "title": "Vem de Deus",
    "description": "Adoração que eleva a alma e fortalece a fé. Uma canção profunda que exalta a soberania de Deus.",
    "cover_url": "https://img.youtube.com/vi/S4Jve-nf9dU/maxresdefault.jpg",
    "spotify_url": "https://open.spotify.com/album/vem-de-deus",
    "youtube_url": "https://www.youtube.com/watch?v=S4Jve-nf9dU",
    "release_date": "2025-01-05",
    "featured": true
  }
];

const staticShows = [
  {
    "id": "d1754990-b480-41dd-ab6e-4f4bb6eca567",
    "date": "2026-07-15",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "venue": "Catedral do Louvor",
    "event_name": "Noite de Adoração",
    "time": "20:00"
  },
  {
    "id": "7c0d303d-bc1d-4d66-b020-338d89144b0d",
    "date": "2026-08-22",
    "city": "São Paulo",
    "state": "SP",
    "venue": "Arena Gospel",
    "event_name": "Congresso Nacional de Jovens",
    "time": "19:30"
  },
  {
    "id": "3b560fe5-0d32-4be4-8f8d-1973e429e7a6",
    "date": "2026-09-05",
    "city": "Belo Horizonte",
    "state": "MG",
    "venue": "Grande Templo",
    "event_name": "Festival da Fé",
    "time": "18:00"
  },
  {
    "id": "cb00062e-1ac1-4341-9c95-e4aacabf24f2",
    "date": "2026-10-18",
    "city": "Brasília",
    "state": "DF",
    "venue": "Ginásio de Brasília",
    "event_name": "Conferência Renovo",
    "time": "19:00"
  },
  {
    "id": "b338766a-e814-486e-b12a-fece509ee219",
    "date": "2026-11-12",
    "city": "Curitiba",
    "state": "PR",
    "venue": "Teatro Guaíra",
    "event_name": "Adoração e Louvor",
    "time": "20:30"
  }
];

const staticProducts = [
  {
    "id": "a1eb74bf-77ed-480c-bac9-f686cf36a6eb",
    "name": "CD Maria Pita - Fé e Esperança",
    "description": "CD físico contendo os maiores sucessos de Maria Pita, incluindo \"Sou Teu Pai\" e \"Se Levante\". Acompanha encarte especial.",
    "price": 25.00,
    "image_url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?crop=entropy&cs=srgb&fm=jpg&q=85",
    "category": "CDs",
    "stock": 50,
    "featured": true
  },
  {
    "id": "97ec87f7-06e7-45ef-bb70-64a3b3873281",
    "name": "Camiseta Oficial Maria Pita - Fé",
    "description": "Camiseta oficial 100% algodão, tecido premium, cor preta com estampa estilizada da palavra Fé e assinatura da artista.",
    "price": 49.90,
    "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=srgb&fm=jpg&q=85",
    "category": "Camisetas",
    "stock": 100,
    "featured": true
  },
  {
    "id": "633e1327-5b38-417a-8f50-38185fed1794",
    "name": "Pôster Autografado Maria Pita",
    "description": "Pôster exclusivo tamanho A3 impresso em papel fotográfico de alta qualidade, assinado pessoalmente por Maria Pita.",
    "price": 15.00,
    "image_url": "https://images.unsplash.com/photo-1611329857570-f02f340e7378?crop=entropy&cs=srgb&fm=jpg&q=85",
    "category": "Pôsteres",
    "stock": 200,
    "featured": false
  },
  {
    "id": "4fc4431a-a748-46e7-95bf-f9641d8e4e0d",
    "name": "Kit Adoração Completo",
    "description": "Kit promocional imperdível contendo 1 CD Fé e Esperança + 1 Camiseta Oficial Preta + 1 Pôster Autografado.",
    "price": 79.90,
    "image_url": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?crop=entropy&cs=srgb&fm=jpg&q=85",
    "category": "Kits",
    "stock": 30,
    "featured": true
  }
];

const staticNews = [
  {
    "id": "6f7b5b78-d366-483f-a05a-4f67267d9e99",
    "title": "Novo Single \"Eu Cuido\" com Eurice Diniz é Lançado!",
    "excerpt": "O aguardado single \"Eu Cuido\", uma parceria especial entre Maria Pita e Eurice Diniz, já está disponível em todas as plataformas digitais e no YouTube com clipe oficial.",
    "content": null,
    "category": "Lançamento",
    "date": "2025-02-10T12:00:00Z",
    "image": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=srgb&fm=jpg&q=85",
    "icon": "music",
    "published": true
  },
  {
    "id": "be6892c4-790b-4d01-8dbb-d7101e21764b",
    "title": "Maria Pita Anuncia Agenda de Shows para Segundo Semestre de 2026",
    "excerpt": "Confira todas as cidades e datas confirmadas da turnê de adoração \"Fé e Esperança\" que passará pelas principais capitais do país.",
    "content": null,
    "category": "Mídia",
    "date": "2026-05-15T15:30:00Z",
    "image": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=srgb&fm=jpg&q=85",
    "icon": "newspaper",
    "published": true
  },
  {
    "id": "29107912-3008-4fc6-b4a8-c737c9d1dc35",
    "title": "Bastidores do Gravação do Clipe \"Sou Teu Pai\"",
    "excerpt": "Confira fotos exclusivas e os momentos marcantes de adoração nos bastidores da gravação do videoclipe oficial com a participação do cantor Samuel Messias.",
    "content": null,
    "category": "Bastidores",
    "date": "2024-03-25T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&q=85",
    "icon": "radio",
    "published": true
  }
];

const staticAbout = {
  "id": "177e030c-4a00-4b16-bc5a-112fe670b928",
  "name": "Maria Pita",
  "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=srgb&fm=jpg&q=85",
  "description": "Maria Pita é cantora e compositora gospel, nascida e criada no Brasil. Desde cedo encontrou na música e na fé a força para seguir seu chamado. Sua voz e suas canções carregam uma mensagem de esperança, amor e adoração que atravessa gerações. Com influências que vão do pop ao worship contemporâneo, Maria Pita une letras que falam direto ao coração a melodias que ficam na memória. Já se apresentou em igrejas, congressos e eventos por todo o país, levando adoração e testemunho onde vai. Para ela, a música é mais que profissão: é ministério. Cada show e cada música são uma oportunidade de conectar pessoas a Deus e de celebrar a vida com gratidão.",
  "mission": "Usar o dom da música para glorificar a Deus e levar pessoas a uma experiência transformadora com Cristo, através de canções que falam ao coração e elevam a alma."
};

export const api = {
  getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers: this.getHeaders()
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`API GET failed for ${endpoint}, returning fallback data:`, error);
      
      const cleanEndpoint = endpoint.split('?')[0];
      
      if (cleanEndpoint === '/releases') {
        if (endpoint.includes('featured=true')) {
          return staticReleases.filter(r => r.featured);
        }
        return staticReleases;
      }
      
      if (cleanEndpoint === '/shows') {
        return staticShows;
      }
      
      if (cleanEndpoint === '/products') {
        let result = staticProducts;
        if (endpoint.includes('featured=true')) {
          result = result.filter(p => p.featured);
        }
        const categoryMatch = endpoint.match(/category=([^&]+)/);
        if (categoryMatch) {
          const category = decodeURIComponent(categoryMatch[1]);
          result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        return result;
      }
      
      if (cleanEndpoint === '/about') {
        return staticAbout;
      }
      
      if (cleanEndpoint === '/news') {
        return staticNews;
      }
      
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`API POST failed for ${endpoint}, returning mock success:`, error);
      if (endpoint === '/booking' || endpoint === '/newsletter') {
        return { status: 'success', message: 'Mensagem recebida com sucesso (Modo Fallback)' };
      }
      throw error;
    }
  },

  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `API Error: ${response.statusText}`);
    }
    return await response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `API Error: ${response.statusText}`);
    }
    return await response.json();
  }
};
