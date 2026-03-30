import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_retail")
PRODUCTS_COLLECTION = os.getenv("PRODUCTS_COLLECTION", "products")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

ALLOWED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
]

MAX_FILE_SIZE_MB = 10

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is missing in .env")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")