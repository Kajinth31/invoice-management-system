import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load values from backend/.env
load_dotenv()

# Read values from environment
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_retail")

# Check if MONGO_URI exists
if not MONGO_URI:
    raise ValueError("MONGO_URI is missing in .env")

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Select database
db = client[DATABASE_NAME]

# Collections
users_collection = db["users"]
products_collection = db["products"]
invoices_collection = db["invoices"]