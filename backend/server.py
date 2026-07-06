from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'change-me')

app = FastAPI(title="String Creations 03 API")
api_router = APIRouter(prefix="/api")


# ---------- Auth (shared-secret admin token) ----------

def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return True


# ---------- Models ----------

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    price: str = ""            # store as string so user can write "₹4,800" or "From ₹4,800"
    size: str = ""
    colour: str = ""
    thread: str = ""
    category: str = "Custom"    # Portrait, Mandala, Name, Logo, Custom, ...
    images: List[str] = Field(default_factory=list)   # base64 data URLs or hosted URLs
    video_url: str = ""
    in_stock: bool = True
    featured: bool = False
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ProductCreate(BaseModel):
    title: str
    description: str = ""
    price: str = ""
    size: str = ""
    colour: str = ""
    thread: str = ""
    category: str = "Custom"
    images: List[str] = Field(default_factory=list)
    video_url: str = ""
    in_stock: bool = True
    featured: bool = False
    order: int = 0


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    size: Optional[str] = None
    colour: Optional[str] = None
    thread: Optional[str] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None
    in_stock: Optional[bool] = None
    featured: Optional[bool] = None
    order: Optional[int] = None


DEFAULT_ABOUT = (
    "String art is the ancient craft of drawing with thread. A grid of tiny nails is hammered into a "
    "wooden panel, then a single unbroken length of cotton or silk is pulled taut between them, "
    "one anchor at a time. What emerges is not a print — it is a physical drawing made of tension, "
    "shadow and light. Every piece from Studio 03 is planned, plotted, hammered and threaded by "
    "hand. It carries the small imperfections of a human touch — because that is exactly what makes "
    "it yours."
)


class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site"
    brand_name: str = "String Creations 03"
    tagline: str = "Thread, pulled taut into memory."
    about_short: str = "One-of-one handcrafted string art. Signed, numbered and shipped worldwide."
    about_long: str = DEFAULT_ABOUT
    whatsapp: str = "919999999999"        # international format, no +
    email: str = "hello@stringcreations03.com"
    instagram: str = "https://instagram.com"
    facebook: str = ""
    youtube: str = ""
    phone: str = ""
    location: str = "Studio 03 · Ships worldwide"
    hours: str = "Mon–Sat · 10am – 7pm"
    turnaround: str = "Typical turnaround: 2–4 weeks"
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class SettingsUpdate(BaseModel):
    brand_name: Optional[str] = None
    tagline: Optional[str] = None
    about_short: Optional[str] = None
    about_long: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    hours: Optional[str] = None
    turnaround: Optional[str] = None


# ---------- Reviews ----------

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    city: str = ""
    rating: int = 5
    review: str
    product_id: str = ""
    product_name: str = ""
    image: str = ""
    approved: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReviewCreate(BaseModel):
    name: str
    city: str = ""
    rating: int
    review: str
    product_id: str = ""
    product_name: str = ""
    image: str = ""


class ReviewUpdate(BaseModel):
    approved: Optional[bool] = None


# ---------- Routes ----------

@api_router.get("/")
async def root():
    return {"message": "String Creations 03 API"}


@api_router.post("/admin/verify")
async def verify_admin(_: bool = Depends(require_admin)):
    return {"ok": True}


# --- Products ---

@api_router.get("/products", response_model=List[Product])
async def list_products():
    docs = await db.products.find({}, {"_id": 0}).sort([("order", 1), ("created_at", -1)]).to_list(500)
    return [Product(**d) for d in docs]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**doc)


@api_router.post("/products", response_model=Product)
async def create_product(payload: ProductCreate, _: bool = Depends(require_admin)):
    product = Product(**payload.model_dump())
    await db.products.insert_one(product.model_dump())
    return product


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, payload: ProductUpdate, _: bool = Depends(require_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.products.update_one({"id": product_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**doc)


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, _: bool = Depends(require_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}


# --- Settings ---

async def _get_or_create_settings() -> Settings:
    doc = await db.settings.find_one({"id": "site"}, {"_id": 0})
    if not doc:
        s = Settings()
        await db.settings.insert_one(s.model_dump())
        return s
    return Settings(**doc)


@api_router.get("/settings", response_model=Settings)
async def get_settings():
    return await _get_or_create_settings()


@api_router.put("/settings", response_model=Settings)
async def update_settings(payload: SettingsUpdate, _: bool = Depends(require_admin)):
    await _get_or_create_settings()
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.settings.update_one({"id": "site"}, {"$set": updates})
    doc = await db.settings.find_one({"id": "site"}, {"_id": 0})
    return Settings(**doc)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
