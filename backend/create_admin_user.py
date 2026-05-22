import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from database import supabase
from security import get_password_hash

def main():
    username = "gabrieldesouza100@gmail.com"
    password = "97872715"
    
    try:
        # Check if already exists
        existing = supabase.table("admin_users").select("*").eq("username", username).execute()
        if existing.data:
            # Update password
            print(f"Usuario {username} ja existe. Atualizando a senha...")
            password_hash = get_password_hash(password)
            response = supabase.table("admin_users").update({"password_hash": password_hash}).eq("username", username).execute()
            if response.data:
                print("Senha atualizada com sucesso!")
            else:
                print("Erro ao atualizar a senha.")
        else:
            # Create user
            print(f"Criando novo usuario admin: {username}...")
            password_hash = get_password_hash(password)
            data = {
                "username": username,
                "password_hash": password_hash
            }
            response = supabase.table("admin_users").insert(data).execute()
            if response.data:
                print("Usuario criado com sucesso!")
            else:
                print("Erro ao cadastrar usuario.")
    except Exception as e:
        print(f"Erro: {str(e)}")

if __name__ == "__main__":
    main()
