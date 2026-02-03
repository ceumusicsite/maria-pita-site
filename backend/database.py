"""
Módulo de conexão com o Supabase usando httpx
"""
import os
from dotenv import load_dotenv
from pathlib import Path
import httpx
from typing import Any, Dict, List, Optional

ROOT_DIR = Path(__file__).parent
env_path = ROOT_DIR / '.env'
load_dotenv(env_path)

# Configuração do Supabase
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar configurados no .env")

class SupabaseClient:
    """Cliente simplificado para Supabase usando httpx"""
    
    def __init__(self, url: str, key: str):
        self.base_url = f"{url}/rest/v1"
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        self.client = httpx.Client(headers=self.headers, timeout=30.0)
    
    def table(self, table_name: str):
        return Table(self, table_name)
    
    def __del__(self):
        self.client.close()

class QueryBuilder:
    """Construtor de queries para Supabase"""
    
    def __init__(self, client: SupabaseClient, table_name: str):
        self.client = client
        self.table_name = table_name
        self._select_fields = "*"
        self._filters = []
        self._order_by = None
        self._limit_value = None
    
    def select(self, fields: str = "*"):
        self._select_fields = fields
        return self
    
    def eq(self, column: str, value: Any):
        self._filters.append(f"{column}=eq.{value}")
        return self
    
    def order(self, column: str, desc: bool = False):
        direction = "desc" if desc else "asc"
        self._order_by = f"{column}.{direction}"
        return self
    
    def limit(self, count: int):
        self._limit_value = count
        return self
    
    def execute(self):
        url = f"{self.client.base_url}/{self.table_name}"
        params = {"select": self._select_fields}
        
        for filter_str in self._filters:
            key, value = filter_str.split("=", 1)
            params[key] = value
        
        if self._order_by:
            params["order"] = self._order_by
        
        if self._limit_value:
            params["limit"] = str(self._limit_value)
        
        response = self.client.client.get(url, params=params)
        response.raise_for_status()
        
        return type('Response', (), {'data': response.json()})()

class Table:
    """Representa uma tabela do Supabase"""
    
    def __init__(self, client: SupabaseClient, table_name: str):
        self.client = client
        self.table_name = table_name
    
    def select(self, fields: str = "*"):
        return QueryBuilder(self.client, self.table_name).select(fields)
    
    def insert(self, data: Dict[str, Any] | List[Dict[str, Any]]):
        url = f"{self.client.base_url}/{self.table_name}"
        response = self.client.client.post(url, json=data)
        response.raise_for_status()
        return type('Response', (), {'data': response.json()})()
    
    def update(self, data: Dict[str, Any]):
        url = f"{self.client.base_url}/{self.table_name}"
        response = self.client.client.patch(url, json=data)
        response.raise_for_status()
        return type('Response', (), {'data': response.json()})()
    
    def delete(self):
        url = f"{self.client.base_url}/{self.table_name}"
        response = self.client.client.delete(url)
        response.raise_for_status()
        return type('Response', (), {'data': response.json()})()

# Criar cliente Supabase
supabase = SupabaseClient(SUPABASE_URL, SUPABASE_KEY)
