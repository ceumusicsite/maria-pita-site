from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from database import supabase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
        logger.error(f"Error fetching about: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error fetching releases: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error fetching release: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/releases", response_model=Release)
async def create_release(release_input: ReleaseCreate):
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
        logger.error(f"Error creating release: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error fetching shows: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/shows", response_model=Show)
async def create_show(show_input: ShowCreate):
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
async def get_products(category: Optional[str] = Query(None), featured: Optional[bool] = Query(None)):
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
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate):
    try:
        product_data = product_input.model_dump()
        response = supabase.table("products").insert(product_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create product")
        
        product = response.data[0]
        product['id'] = str(product['id'])
        
        return product
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Newsletter
@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(subscriber_input: NewsletterCreate):
    try:
        # Check if already subscribed
        existing = supabase.table("newsletter").select("*").eq("email", subscriber_input.email).execute()
        
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
        logger.error(f"Error subscribing newsletter: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error fetching news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
async def create_news(news_input: NewsCreate):
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
        logger.error(f"Error creating news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/booking", response_model=List[BookingRequest])
async def get_bookings(status: Optional[str] = Query(None)):
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
        logger.error(f"Error fetching bookings: {str(e)}")
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
