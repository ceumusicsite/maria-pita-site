"""API REST do site oficial Maria Pita - FastAPI."""
import sys
import traceback
from pathlib import Path

ROOT_DIR = Path(__file__).parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

LOG_FILE = ROOT_DIR / "startup_error.log"

try:
    import logging
    import os
    from typing import List, Optional
    from datetime import datetime, timezone, timedelta

    from dotenv import load_dotenv
    from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends, Header
    from pydantic import BaseModel, ConfigDict, EmailStr
    from starlette.middleware.cors import CORSMiddleware

    from database import supabase
    from security import verify_admin_token, verify_password, generate_session_token, get_password_hash

    load_dotenv(ROOT_DIR / '.env')
except Exception as e:
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("Startup error during imports:\n")
        f.write(traceback.format_exc())
    raise


# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Release(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    cover_url: str
    spotify_url: Optional[str] = None
    youtube_url: Optional[str] = None
    release_date: str
    featured: bool = False

class ReleaseCreate(BaseModel):
    title: str
    description: str
    cover_url: str
    spotify_url: Optional[str] = None
    youtube_url: Optional[str] = None
    release_date: str
    featured: bool = False

class Show(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    date: str
    city: str
    state: str
    venue: str
    event_name: str
    time: Optional[str] = None

class ShowCreate(BaseModel):
    date: str
    city: str
    state: str
    venue: str
    event_name: str
    time: Optional[str] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int = 0
    featured: bool = False

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    category: str
    stock: int = 0
    featured: bool = False

class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    subscribed_at: str

class NewsletterCreate(BaseModel):
    email: EmailStr

class BookingRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    organization: str
    city: str
    state: str
    event_date: str
    email: EmailStr
    phone: str
    message: str
    created_at: str
    status: str = "pending"

class BookingCreate(BaseModel):
    name: str
    organization: str
    city: str
    state: str
    event_date: str
    email: EmailStr
    phone: str
    message: str

class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    excerpt: str
    content: Optional[str] = None
    category: str
    date: str
    image: Optional[str] = None
    icon: Optional[str] = None
    published: bool = True

class NewsCreate(BaseModel):
    title: str
    excerpt: str
    content: Optional[str] = None
    category: str
    date: str
    image: Optional[str] = None
    icon: Optional[str] = None
    published: bool = True

class Artist(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    photo_url: str
    description: str
    mission: Optional[str] = None

class SiteSettingsResponse(BaseModel):
    id: str
    instagram_url: str
    youtube_url: str
    spotify_url: str
    tiktok_url: str

class SiteSettingsUpdate(BaseModel):
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    spotify_url: Optional[str] = None
    tiktok_url: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Maria Pita API - Official Website"}

# About / Artist (Sobre - Maria Pita)
@api_router.get("/about", response_model=Artist)
async def get_about():
    try:
        response = supabase.table("artist").select("*").limit(1).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="About not found")
        artist = response.data[0]
        artist["id"] = str(artist["id"])
        return artist
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching about: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

# Releases
@api_router.get("/releases", response_model=List[Release])
async def get_releases(featured: Optional[bool] = Query(None)):
    try:
        query = supabase.table("releases").select("*")

        if featured is not None:
            query = query.eq("featured", featured)

        query = query.order("release_date", desc=True).limit(100)
        response = query.execute()

        # Converter UUIDs para string
        releases = []
        for item in response.data:
            item['id'] = str(item['id'])
            if item.get('release_date'):
                item['release_date'] = str(item['release_date'])
            releases.append(item)

        return releases
    except Exception as e:
        logger.error("Error fetching releases: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.get("/releases/{release_id}", response_model=Release)
async def get_release(release_id: str):
    try:
        response = supabase.table("releases").select("*").eq("id", release_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Release not found")

        release = response.data[0]
        release['id'] = str(release['id'])
        if release.get('release_date'):
            release['release_date'] = str(release['release_date'])

        return release
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching release: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.post("/releases", response_model=Release)
async def create_release(release_input: ReleaseCreate, admin: dict = Depends(verify_admin_token)):
    try:
        release_data = release_input.model_dump()
        response = supabase.table("releases").insert(release_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create release")

        release = response.data[0]
        release['id'] = str(release['id'])
        if release.get('release_date'):
            release['release_date'] = str(release['release_date'])

        return release
    except Exception as e:
        logger.error("Error creating release: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

# Shows
@api_router.get("/shows", response_model=List[Show])
async def get_shows(state: Optional[str] = Query(None)):
    try:
        query = supabase.table("shows").select("*")

        if state:
            query = query.eq("state", state)

        query = query.order("date", desc=False).limit(100)
        response = query.execute()

        # Converter UUIDs e datas para string
        shows = []
        for item in response.data:
            item['id'] = str(item['id'])
            if item.get('date'):
                item['date'] = str(item['date'])
            shows.append(item)

        return shows
    except Exception as e:
        logger.error("Error fetching shows: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.post("/shows", response_model=Show)
async def create_show(show_input: ShowCreate, admin: dict = Depends(verify_admin_token)):
    try:
        show_data = show_input.model_dump()
        response = supabase.table("shows").insert(show_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create show")

        show = response.data[0]
        show['id'] = str(show['id'])
        if show.get('date'):
            show['date'] = str(show['date'])

        return show
    except Exception as e:
        logger.error(f"Error creating show: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
):
    try:
        query = supabase.table("products").select("*")

        if category:
            query = query.eq("category", category)
        if featured is not None:
            query = query.eq("featured", featured)

        query = query.limit(100)
        response = query.execute()

        # Converter UUIDs para string
        products = []
        for item in response.data:
            item['id'] = str(item['id'])
            products.append(item)

        return products
    except Exception as e:
        logger.error("Error fetching products: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    try:
        response = supabase.table("products").select("*").eq("id", product_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")

        product = response.data[0]
        product['id'] = str(product['id'])

        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching product: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate, admin: dict = Depends(verify_admin_token)):
    try:
        product_data = product_input.model_dump()
        response = supabase.table("products").insert(product_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create product")

        product = response.data[0]
        product['id'] = str(product['id'])

        return product
    except Exception as e:
        logger.error("Error creating product: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

# Newsletter
@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(subscriber_input: NewsletterCreate):
    try:
        # Check if already subscribed
        existing = (
            supabase.table("newsletter")
            .select("*")
            .eq("email", subscriber_input.email)
            .execute()
        )

        if existing.data:
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        subscriber_data = subscriber_input.model_dump()
        response = supabase.table("newsletter").insert(subscriber_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to subscribe")

        subscriber = response.data[0]
        subscriber['id'] = str(subscriber['id'])
        if subscriber.get('subscribed_at'):
            subscriber['subscribed_at'] = str(subscriber['subscribed_at'])

        return subscriber
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error subscribing newsletter: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

# News
@api_router.get("/news", response_model=List[News])
async def get_news(category: Optional[str] = Query(None), limit: int = Query(10)):
    try:
        query = supabase.table("news").select("*")

        if category:
            query = query.eq("category", category)

        query = query.eq("published", True).order("date", desc=True).limit(limit)
        response = query.execute()

        # Converter UUIDs e datas para string
        news_items = []
        for item in response.data:
            item['id'] = str(item['id'])
            if item.get('date'):
                item['date'] = str(item['date'])
            news_items.append(item)

        return news_items
    except Exception as e:
        logger.error("Error fetching news: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.get("/news/{news_id}", response_model=News)
async def get_news_item(news_id: str):
    try:
        response = supabase.table("news").select("*").eq("id", news_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="News not found")

        news = response.data[0]
        news['id'] = str(news['id'])
        if news.get('date'):
            news['date'] = str(news['date'])

        return news
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching news item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/news", response_model=News)
async def create_news(news_input: NewsCreate, admin: dict = Depends(verify_admin_token)):
    try:
        news_data = news_input.model_dump()
        response = supabase.table("news").insert(news_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create news")

        news = response.data[0]
        news['id'] = str(news['id'])
        if news.get('date'):
            news['date'] = str(news['date'])

        return news
    except Exception as e:
        logger.error("Error creating news: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

# Booking
@api_router.post("/booking", response_model=BookingRequest)
async def create_booking(booking_input: BookingCreate):
    try:
        booking_data = booking_input.model_dump()
        response = supabase.table("booking_requests").insert(booking_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create booking request")

        booking = response.data[0]
        booking['id'] = str(booking['id'])
        if booking.get('event_date'):
            booking['event_date'] = str(booking['event_date'])
        if booking.get('created_at'):
            booking['created_at'] = str(booking['created_at'])

        return booking
    except Exception as e:
        logger.error("Error creating booking: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e

@api_router.get("/booking", response_model=List[BookingRequest])
async def get_bookings(status: Optional[str] = Query(None), admin: dict = Depends(verify_admin_token)):
    try:
        query = supabase.table("booking_requests").select("*")

        if status:
            query = query.eq("status", status)

        query = query.order("created_at", desc=True).limit(100)
        response = query.execute()

        # Converter UUIDs e datas para string
        bookings = []
        for item in response.data:
            item['id'] = str(item['id'])
            if item.get('event_date'):
                item['event_date'] = str(item['event_date'])
            if item.get('created_at'):
                item['created_at'] = str(item['created_at'])
            bookings.append(item)

        return bookings
    except Exception as e:
        logger.error("Error fetching bookings: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e)) from e


# --- ADMIN AUTHENTICATION ---
class LoginInput(BaseModel):
    username: str
    password: str

@api_router.post("/auth/login")
async def login(credentials: LoginInput):
    try:
        response = supabase.table("admin_users").select("*").eq("username", credentials.username).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")
        
        user = response.data[0]
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")
        
        token = generate_session_token()
        expires_at = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        
        session_data = {
            "user_id": user["id"],
            "token": token,
            "expires_at": expires_at
        }
        session_response = supabase.table("admin_sessions").insert(session_data).execute()
        if not session_response.data:
            raise HTTPException(status_code=500, detail="Falha ao criar sessão")
            
        return {"token": token, "username": user["username"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no login: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/logout")
async def logout(x_admin_token: str = Header(..., alias="Authorization")):
    token = x_admin_token
    if token.startswith("Bearer "):
        token = token[7:]
    try:
        supabase.table("admin_sessions").delete().eq("token", token).execute()
        return {"message": "Sessão encerrada com sucesso"}
    except Exception as e:
        logger.error(f"Erro no logout: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/verify")
async def verify(admin: dict = Depends(verify_admin_token)):
    return {"status": "ok", "username": admin["username"]}

# --- SHIPPING AND CART INTEGRATION ---
class CartItemInput(BaseModel):
    product_id: str
    quantity: int

class ShippingCalculateInput(BaseModel):
    cep_destino: str
    items: List[CartItemInput]

@api_router.post("/shipping/calculate")
async def calculate_shipping(input_data: ShippingCalculateInput):
    import httpx
    cep = input_data.cep_destino.replace("-", "").replace(" ", "")
    if len(cep) != 8 or not cep.isdigit():
        raise HTTPException(status_code=400, detail="CEP inválido. Deve conter 8 dígitos.")
        
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://viacep.com.br/ws/{cep}/json/")
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Erro ao consultar ViaCEP")
            viacep_data = response.json()
            if "erro" in viacep_data:
                raise HTTPException(status_code=400, detail="CEP não encontrado")
    except Exception as e:
        logger.error(f"Erro ao consultar ViaCEP: {e}")
        raise HTTPException(status_code=400, detail="CEP inválido ou erro de consulta.")

    try:
        settings_response = supabase.table("shipping_settings").select("*").limit(1).execute()
        if settings_response.data:
            settings = settings_response.data[0]
        else:
            settings = {
                "base_fee_pac": 15.00,
                "base_fee_sedex": 25.00,
                "additional_item_fee": 2.00
            }
    except Exception as e:
        logger.error(f"Erro ao buscar configurações de frete: {e}")
        settings = {
            "base_fee_pac": 15.00,
            "base_fee_sedex": 25.00,
            "additional_item_fee": 2.00
        }

    state = viacep_data.get("uf", "SP")
    sudeste = ["SP", "RJ", "MG", "ES"]
    sul = ["PR", "SC", "RS"]
    centro_oeste = ["DF", "GO", "MT", "MS"]
    nordeste = ["BA", "PE", "CE", "RN", "PB", "AL", "SE", "PI", "MA"]
    norte = ["AM", "PA", "RO", "RR", "AC", "TO", "AP"]
    
    if state in sudeste:
        multiplier = 1.0
        days_pac = "3 a 5"
        days_sedex = "1 a 2"
    elif state in sul:
        multiplier = 1.2
        days_pac = "5 a 7"
        days_sedex = "2 a 3"
    elif state in centro_oeste:
        multiplier = 1.3
        days_pac = "6 a 8"
        days_sedex = "2 a 4"
    elif state in nordeste:
        multiplier = 1.5
        days_pac = "7 a 10"
        days_sedex = "3 a 5"
    elif state in norte:
        multiplier = 1.8
        days_pac = "10 a 15"
        days_sedex = "4 a 7"
    else:
        multiplier = 1.0
        days_pac = "5 a 10"
        days_sedex = "2 a 5"

    total_quantity = sum(item.quantity for item in input_data.items)
    additional_fee = float(settings["additional_item_fee"]) * (total_quantity - 1) if total_quantity > 1 else 0.0

    cost_pac = round((float(settings["base_fee_pac"]) * multiplier) + additional_fee, 2)
    cost_sedex = round((float(settings["base_fee_sedex"]) * multiplier) + additional_fee, 2)

    return {
        "cep": cep,
        "logradouro": viacep_data.get("logradouro", ""),
        "bairro": viacep_data.get("bairro", ""),
        "localidade": viacep_data.get("localidade", ""),
        "uf": state,
        "options": [
            {
                "method": "PAC",
                "cost": cost_pac,
                "delivery_time": f"{days_pac} dias úteis"
            },
            {
                "method": "SEDEX",
                "cost": cost_sedex,
                "delivery_time": f"{days_sedex} dias úteis"
            }
        ]
    }

# --- ORDERS ---
class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderCreateInput(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    cep: str
    address: str
    number: str
    complement: Optional[str] = None
    neighborhood: str
    city: str
    state: str
    shipping_method: str
    shipping_cost: float
    payment_method: str
    items: List[OrderItemCreate]

@api_router.post("/orders")
async def create_order(order_input: OrderCreateInput):
    try:
        products_to_update = []
        subtotal = 0.0
        
        for item in order_input.items:
            prod_response = supabase.table("products").select("*").eq("id", item.product_id).execute()
            if not prod_response.data:
                raise HTTPException(status_code=404, detail=f"Produto {item.product_id} não encontrado")
            
            prod = prod_response.data[0]
            if prod["stock"] < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Estoque insuficiente para {prod['name']}. Disponível: {prod['stock']}"
                )
            
            subtotal += float(prod["price"]) * item.quantity
            products_to_update.append({
                "product": prod,
                "quantity": item.quantity
            })
            
        total_amount = subtotal + order_input.shipping_cost
        
        order_data = {
            "customer_name": order_input.customer_name,
            "customer_email": order_input.customer_email,
            "customer_phone": order_input.customer_phone,
            "cep": order_input.cep,
            "address": order_input.address,
            "number": order_input.number,
            "complement": order_input.complement,
            "neighborhood": order_input.neighborhood,
            "city": order_input.city,
            "state": order_input.state,
            "shipping_method": order_input.shipping_method,
            "shipping_cost": order_input.shipping_cost,
            "total_amount": total_amount,
            "status": "pending",
            "payment_method": order_input.payment_method
        }
        
        order_response = supabase.table("orders").insert(order_data).execute()
        if not order_response.data:
            raise HTTPException(status_code=500, detail="Falha ao criar o pedido")
            
        created_order = order_response.data[0]
        order_id = created_order["id"]
        
        for item_data in products_to_update:
            prod = item_data["product"]
            qty = item_data["quantity"]
            
            order_item_data = {
                "order_id": order_id,
                "product_id": prod["id"],
                "product_name": prod["name"],
                "price": float(prod["price"]),
                "quantity": qty
            }
            supabase.table("order_items").insert(order_item_data).execute()
            
            new_stock = prod["stock"] - qty
            supabase.table("products").update({"stock": new_stock}).eq("id", prod["id"]).execute()
            
        return {
            "id": order_id,
            "total_amount": total_amount,
            "status": "pending",
            "message": "Pedido criado com sucesso!"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao criar pedido: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

# --- ADMIN ORDERS CRUD ---
@api_router.get("/orders")
async def get_orders(status: Optional[str] = Query(None), admin: dict = Depends(verify_admin_token)):
    try:
        query = supabase.table("orders").select("*")
        if status:
            query = query.eq("status", status)
        query = query.order("created_at", desc=True)
        response = query.execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao obter pedidos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/orders/{order_id}")
async def get_order_details(order_id: str, admin: dict = Depends(verify_admin_token)):
    try:
        order_response = supabase.table("orders").select("*").eq("id", order_id).execute()
        if not order_response.data:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
            
        order = order_response.data[0]
        items_response = supabase.table("order_items").select("*").eq("order_id", order_id).execute()
        order["items"] = items_response.data
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter detalhes do pedido: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class OrderStatusUpdateInput(BaseModel):
    status: str
    tracking_code: Optional[str] = None

@api_router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    update_data: OrderStatusUpdateInput,
    admin: dict = Depends(verify_admin_token)
):
    try:
        order_response = supabase.table("orders").select("status").eq("id", order_id).execute()
        if not order_response.data:
            raise HTTPException(status_code=404, detail="Pedido não encontrado")
            
        data_to_update = {
            "status": update_data.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        if update_data.tracking_code is not None:
            data_to_update["tracking_code"] = update_data.tracking_code
            
        response = supabase.table("orders").update(data_to_update).eq("id", order_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar o status do pedido")
            
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar status do pedido: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN PRODUCT CRUD (PUT/DELETE/PATCH) ---
class ProductUpdateInput(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    featured: Optional[bool] = None

@api_router.patch("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_input: ProductUpdateInput,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("products").select("*").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
            
        update_data = product_input.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("products").update(update_data).eq("id", product_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar o produto")
            
        product = response.data[0]
        product["id"] = str(product["id"])
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar produto: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin: dict = Depends(verify_admin_token)):
    try:
        existing = supabase.table("products").select("*").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
            
        supabase.table("products").delete().eq("id", product_id).execute()
        return {"message": "Produto deletado com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao deletar produto: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN SHOWS CRUD (PUT/DELETE/PATCH) ---
class ShowUpdateInput(BaseModel):
    date: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    venue: Optional[str] = None
    event_name: Optional[str] = None
    time: Optional[str] = None

@api_router.patch("/shows/{show_id}", response_model=Show)
async def update_show(
    show_id: str,
    show_input: ShowUpdateInput,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("shows").select("*").eq("id", show_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Show não encontrado")
            
        update_data = show_input.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("shows").update(update_data).eq("id", show_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar o show")
            
        show = response.data[0]
        show["id"] = str(show["id"])
        if show.get("date"):
            show["date"] = str(show["date"])
        return show
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar show: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/shows/{show_id}")
async def delete_show(show_id: str, admin: dict = Depends(verify_admin_token)):
    try:
        existing = supabase.table("shows").select("*").eq("id", show_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Show não encontrado")
            
        supabase.table("shows").delete().eq("id", show_id).execute()
        return {"message": "Show deletado com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao deletar show: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN RELEASES CRUD (PUT/DELETE/PATCH) ---
class ReleaseUpdateInput(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    spotify_url: Optional[str] = None
    youtube_url: Optional[str] = None
    release_date: Optional[str] = None
    featured: Optional[bool] = None

@api_router.patch("/releases/{release_id}", response_model=Release)
async def update_release(
    release_id: str,
    release_input: ReleaseUpdateInput,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("releases").select("*").eq("id", release_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Lançamento não encontrado")
            
        update_data = release_input.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("releases").update(update_data).eq("id", release_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar o lançamento")
            
        release = response.data[0]
        release["id"] = str(release["id"])
        if release.get("release_date"):
            release["release_date"] = str(release["release_date"])
        return release
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar lançamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/releases/{release_id}")
async def delete_release(release_id: str, admin: dict = Depends(verify_admin_token)):
    try:
        existing = supabase.table("releases").select("*").eq("id", release_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Lançamento não encontrado")
            
        supabase.table("releases").delete().eq("id", release_id).execute()
        return {"message": "Lançamento deletado com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao deletar lançamento: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN ABOUT (PATCH) ---
class AboutUpdateInput(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None
    description: Optional[str] = None
    mission: Optional[str] = None

@api_router.patch("/about", response_model=Artist)
async def update_about(
    about_input: AboutUpdateInput,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("artist").select("*").limit(1).execute()
        if not existing.data:
            insert_data = {
                "name": about_input.name or "Maria Pita",
                "photo_url": about_input.photo_url or "",
                "description": about_input.description or "",
                "mission": about_input.mission
            }
            response = supabase.table("artist").insert(insert_data).execute()
        else:
            artist_id = existing.data[0]["id"]
            update_data = about_input.model_dump(exclude_unset=True)
            update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
            response = supabase.table("artist").update(update_data).eq("id", artist_id).execute()
            
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar o perfil")
            
        artist = response.data[0]
        artist["id"] = str(artist["id"])
        return artist
    except Exception as e:
        logger.error(f"Erro ao atualizar perfil: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- SHIPPING SETTINGS ---
class ShippingSettingsResponse(BaseModel):
    id: str
    origin_cep: str
    base_fee_pac: float
    base_fee_sedex: float
    additional_item_fee: float

@api_router.get("/shipping/settings", response_model=ShippingSettingsResponse)
async def get_shipping_settings(admin: dict = Depends(verify_admin_token)):
    try:
        response = supabase.table("shipping_settings").select("*").limit(1).execute()
        if not response.data:
            default_data = {
                "origin_cep": "01001-000",
                "base_fee_pac": 15.00,
                "base_fee_sedex": 25.00,
                "additional_item_fee": 2.00
            }
            insert_res = supabase.table("shipping_settings").insert(default_data).execute()
            if not insert_res.data:
                raise HTTPException(status_code=500, detail="Falha ao inicializar configurações de frete")
            settings = insert_res.data[0]
        else:
            settings = response.data[0]
            
        settings["id"] = str(settings["id"])
        return settings
    except Exception as e:
        logger.error(f"Erro ao obter configurações de frete: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ShippingSettingsUpdate(BaseModel):
    origin_cep: Optional[str] = None
    base_fee_pac: Optional[float] = None
    base_fee_sedex: Optional[float] = None
    additional_item_fee: Optional[float] = None

@api_router.patch("/shipping/settings", response_model=ShippingSettingsResponse)
async def update_shipping_settings(
    settings_input: ShippingSettingsUpdate,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("shipping_settings").select("*").limit(1).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Configurações de frete não encontradas")
            
        settings_id = existing.data[0]["id"]
        update_data = settings_input.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        response = supabase.table("shipping_settings").update(update_data).eq("id", settings_id).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Falha ao atualizar configurações de frete")
            
        settings = response.data[0]
        settings["id"] = str(settings["id"])
        return settings
    except Exception as e:
        logger.error(f"Erro ao atualizar configurações de frete: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- SITE SETTINGS (SOCIAL LINKS) ---
@api_router.get("/settings/social", response_model=SiteSettingsResponse)
async def get_social_settings():
    try:
        response = supabase.table("site_settings").select("*").limit(1).execute()
        if not response.data:
            # Let's seed default links if none exist (safety fallback)
            default_data = {
                "instagram_url": "https://www.instagram.com/mariapitacantora_/",
                "youtube_url": "https://www.youtube.com/@mariapitacantora",
                "spotify_url": "https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n",
                "tiktok_url": "https://www.tiktok.com/@mariapitacantora"
            }
            insert_res = supabase.table("site_settings").insert(default_data).execute()
            if not insert_res.data:
                raise HTTPException(status_code=500, detail="Falha ao inicializar configurações sociais")
            settings = insert_res.data[0]
        else:
            settings = response.data[0]
            
        settings["id"] = str(settings["id"])
        return settings
    except Exception as e:
        logger.error(f"Erro ao obter configurações sociais: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/settings/social", response_model=SiteSettingsResponse)
async def update_social_settings(
    settings_input: SiteSettingsUpdate,
    admin: dict = Depends(verify_admin_token)
):
    try:
        existing = supabase.table("site_settings").select("*").limit(1).execute()
        if not existing.data:
            default_data = {
                "instagram_url": settings_input.instagram_url or "https://www.instagram.com/mariapitacantora_/",
                "youtube_url": settings_input.youtube_url or "https://www.youtube.com/@mariapitacantora",
                "spotify_url": settings_input.spotify_url or "https://open.spotify.com/intl-pt/artist/7fw7DfkvI0fMyEKfOw0k6n",
                "tiktok_url": settings_input.tiktok_url or "https://www.tiktok.com/@mariapitacantora"
            }
            insert_res = supabase.table("site_settings").insert(default_data).execute()
            if not insert_res.data:
                raise HTTPException(status_code=500, detail="Falha ao inicializar configurações sociais")
            settings = insert_res.data[0]
        else:
            settings_id = existing.data[0]["id"]
            update_data = settings_input.model_dump(exclude_unset=True)
            update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
            
            response = supabase.table("site_settings").update(update_data).eq("id", settings_id).execute()
            if not response.data:
                raise HTTPException(status_code=500, detail="Falha ao atualizar configurações sociais")
            settings = response.data[0]
            
        settings["id"] = str(settings["id"])
        return settings
    except Exception as e:
        logger.error(f"Erro ao atualizar configurações sociais: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
