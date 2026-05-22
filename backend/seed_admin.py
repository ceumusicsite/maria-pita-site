import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from database import supabase
from security import get_password_hash

def seed_admin():
    # 1. Seed admin user
    try:
        existing = supabase.table("admin_users").select("*").eq("username", "admin").execute()
        if existing.data:
            print("Usuário admin já existe no banco.")
        else:
            password_hash = get_password_hash("admin123")
            data = {
                "username": "admin",
                "password_hash": password_hash
            }
            response = supabase.table("admin_users").insert(data).execute()
            if response.data:
                print("Usuário admin criado com sucesso!")
            else:
                print("Erro ao cadastrar usuário admin.")
    except Exception as e:
        print(f"Erro ao verificar/criar usuário admin: {e}")

    # 2. Seed shipping settings if empty
    try:
        shipping_existing = supabase.table("shipping_settings").select("*").execute()
        if shipping_existing.data:
            print("Configurações de frete já existem.")
        else:
            shipping_data = {
                "origin_cep": "01001-000",
                "base_fee_pac": 15.00,
                "base_fee_sedex": 25.00,
                "additional_item_fee": 2.00
            }
            response = supabase.table("shipping_settings").insert(shipping_data).execute()
            if response.data:
                print("Configurações de frete padrão criadas com sucesso!")
            else:
                print("Erro ao criar configurações de frete padrão.")
    except Exception as e:
        print(f"Erro ao verificar/criar configurações de frete: {e}")

if __name__ == "__main__":
    seed_admin()
