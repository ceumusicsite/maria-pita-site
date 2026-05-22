import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import Header, HTTPException, Depends
from database import supabase

# Configurações de Hashing
ITERATIONS = 100000
ALGORITHM = "pbkdf2_sha256"

def get_password_hash(password: str) -> str:
    """Gera o hash PBKDF2-SHA256 da senha usando um salt aleatório."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        ITERATIONS
    )
    return f"{ALGORITHM}${ITERATIONS}${salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto plano confere com o hash armazenado."""
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != ALGORITHM:
            return False
        iterations = int(parts[1])
        salt = parts[2]
        stored_hash = parts[3]
        
        new_key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            iterations
        )
        return secrets.compare_digest(new_key.hex(), stored_hash)
    except Exception:
        return False

def generate_session_token() -> str:
    """Gera um token aleatório seguro para a sessão."""
    return secrets.token_hex(32)

def verify_admin_token(x_admin_token: str = Header(..., alias="Authorization")) -> dict:
    """
    Dependency do FastAPI para rotas protegidas.
    Verifica se o token Authorization (Bearer <token>) é válido no banco de dados.
    """
    token = x_admin_token
    if token.startswith("Bearer "):
        token = token[7:]
    
    try:
        # Buscar sessão ativa no Supabase
        response = supabase.table("admin_sessions").select("*, admin_users(*)").eq("token", token).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")
        
        session = response.data[0]
        expires_at = datetime.fromisoformat(session["expires_at"].replace("Z", "+00:00"))
        
        # Verificar expiração (UTC)
        if expires_at < datetime.now(timezone.utc):
            # Deletar sessão expirada
            supabase.table("admin_sessions").delete().eq("id", session["id"]).execute()
            raise HTTPException(status_code=401, detail="Sessão expirada")
            
        return session["admin_users"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Erro de autenticação: {str(e)}")
