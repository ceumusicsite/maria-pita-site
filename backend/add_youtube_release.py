"""
Script para adicionar um release com vídeo do YouTube
"""
from database import supabase
from datetime import datetime

def add_youtube_release(youtube_url=None):
    """Adiciona um release com vídeo do YouTube"""
    
    # URL fornecida ou padrão
    if youtube_url is None:
        youtube_url = "https://www.youtube.com/watch?v=mb7rskqf1A4&list=RDEMzFMowVXry3q4Od_yFQGfxw&start_radio=1"
    
    # Extrair ID do vídeo da URL
    if "watch?v=" in youtube_url:
        video_id = youtube_url.split("watch?v=")[1].split("&")[0]
    else:
        video_id = "mb7rskqf1A4"  # fallback
    
    # Thumbnail padrão do YouTube
    cover_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
    
    # Dados do release
    release_data = {
        "title": "Maria Pita - Novo Lançamento",
        "description": "Confira o mais recente lançamento de Maria Pita. Uma música que toca o coração e inspira através da palavra de Deus.",
        "cover_url": cover_url,
        "youtube_url": youtube_url,
        "release_date": datetime.now().strftime("%Y-%m-%d"),
        "featured": True
    }
    
    try:
        print(f"Adicionando release com vídeo do YouTube: {youtube_url}")
        response = supabase.table("releases").insert(release_data)
        
        if response.data:
            print(f"[OK] Release adicionado com sucesso!")
            print(f"ID: {response.data[0]['id']}")
            print(f"Título: {response.data[0]['title']}")
            print(f"URL do YouTube: {response.data[0]['youtube_url']}")
        else:
            print("[ERRO] Falha ao adicionar release")
            
    except Exception as e:
        print(f"[ERRO] Erro ao adicionar release: {str(e)}")

if __name__ == "__main__":
    import sys
    # Se uma URL foi passada como argumento, usa ela; senão usa a padrão
    youtube_url = sys.argv[1] if len(sys.argv) > 1 else None
    add_youtube_release(youtube_url)


