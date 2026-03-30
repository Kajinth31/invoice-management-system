from pymongo import MongoClient
import certifi
from app.config import MONGO_URI, DATABASE_NAME, PRODUCTS_COLLECTION

client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

db = client[DATABASE_NAME]
products_col = db[PRODUCTS_COLLECTION]