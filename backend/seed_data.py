from database import supabase

def seed_database():
    print("Seeding database...")
    print("Nota: Dados existentes serao mantidos (nao ha limpeza automatica)")
    
    # Seed releases
    releases = [
        {
            "title": "Se Levante",
            "description": "Um hino de coragem e fé que inspira a superar desafios",
            "cover_url": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "spotify_url": "https://open.spotify.com/track/example",
            "youtube_url": "https://youtube.com/watch?v=example",
            "release_date": "2024-01-15",
            "featured": True
        },
        {
            "title": "Sou Teu Pai",
            "description": "Mensagem poderosa sobre o amor paternal de Deus",
            "cover_url": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=srgb&fm=jpg&q=85",
            "spotify_url": "https://open.spotify.com/track/example2",
            "youtube_url": "https://youtube.com/watch?v=example2",
            "release_date": "2024-03-20",
            "featured": True
        },
        {
            "title": "Vem de Deus",
            "description": "Adoração que eleva a alma e fortalece a fé",
            "cover_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&q=85",
            "spotify_url": "https://open.spotify.com/track/example3",
            "youtube_url": "https://youtube.com/watch?v=example3",
            "release_date": "2024-05-10",
            "featured": True
        },
        {
            "title": "Eu Cuido",
            "description": "Canção de conforto e proteção divina",
            "cover_url": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?crop=entropy&cs=srgb&fm=jpg&q=85",
            "spotify_url": "https://open.spotify.com/track/example4",
            "youtube_url": "https://youtube.com/watch?v=example4",
            "release_date": "2024-07-22",
            "featured": False
        },
    ]
    
    for release in releases:
        supabase.table("releases").insert(release)
    print(f"[OK] Inserted {len(releases)} releases")
    
    # Seed shows
    shows = [
        {
            "date": "2025-02-15",
            "city": "São Paulo",
            "state": "SP",
            "venue": "Igreja Batista Central",
            "event_name": "Congresso de Jovens 2025",
            "time": "19:00"
        },
        {
            "date": "2025-03-10",
            "city": "Rio de Janeiro",
            "state": "RJ",
            "venue": "Catedral Evangélica",
            "event_name": "Noite de Louvor",
            "time": "20:00"
        },
        {
            "date": "2025-03-25",
            "city": "Belo Horizonte",
            "state": "MG",
            "venue": "Arena Gospel",
            "event_name": "Festival de Fé",
            "time": "18:30"
        },
        {
            "date": "2025-04-08",
            "city": "Brasília",
            "state": "DF",
            "venue": "Templo da Paz",
            "event_name": "Conferência Nacional",
            "time": "19:30"
        },
        {
            "date": "2025-04-22",
            "city": "Curitiba",
            "state": "PR",
            "venue": "Igreja Renovada",
            "event_name": "Show de Adoração",
            "time": "20:00"
        },
    ]
    
    for show in shows:
        supabase.table("shows").insert(show)
    print(f"[OK] Inserted {len(shows)} shows")
    
    # Seed products
    products = [
        {
            "name": "CD Maria Pita - Fé e Esperança",
            "description": "CD com todas as músicas de Maria Pita. Inclui sucessos como Se Levante, Sou Teu Pai e muito mais.",
            "price": 25.00,
            "image_url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "CDs",
            "stock": 50,
            "featured": True
        },
        {
            "name": "Camiseta Maria Pita - Preta",
            "description": "Camiseta oficial 100% algodão com estampa exclusiva.",
            "price": 49.90,
            "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Camisetas",
            "stock": 100,
            "featured": True
        },
        {
            "name": "Camiseta Maria Pita - Rosa",
            "description": "Camiseta rosa vibrante com logo oficial da artista.",
            "price": 49.90,
            "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Camisetas",
            "stock": 80,
            "featured": False
        },
        {
            "name": "Pôster Oficial Maria Pita",
            "description": "Pôster de alta qualidade 60x40cm. Perfeito para decorar seu quarto.",
            "price": 15.00,
            "image_url": "https://images.unsplash.com/photo-1611329857570-f02f340e7378?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Pôsteres",
            "stock": 200,
            "featured": False
        },
        {
            "name": "Kit Maria Pita Completo",
            "description": "Kit especial com CD + Camiseta + Pôster + Adesivos exclusivos.",
            "price": 79.90,
            "image_url": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Kits",
            "stock": 30,
            "featured": True
        },
        {
            "name": "Chaveiro Maria Pita",
            "description": "Chaveiro em metal com logo oficial.",
            "price": 12.00,
            "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Acessórios",
            "stock": 150,
            "featured": False
        },
    ]
    
    for product in products:
        supabase.table("products").insert(product)
    print(f"[OK] Inserted {len(products)} products")
    
    print("[OK] Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
