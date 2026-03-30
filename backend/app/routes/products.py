import re
from fastapi import APIRouter, HTTPException, Query
from pymongo import UpdateOne

from app.database import products_col
from app.models import Product

router = APIRouter()


@router.post("/save")
async def save_to_db(products: list[Product]):
    try:
        operations = []

        for p in products:
            operations.append(
                UpdateOne(
                    {"item_number": p.item_number},
                    {"$set": p.model_dump()},
                    upsert=True
                )
            )

        if not operations:
            return {
                "status": "success",
                "message": "No products to save"
            }

        result = products_col.bulk_write(operations)

        return {
            "status": "success",
            "message": (
                f"Updated {result.modified_count} items and "
                f"added {len(result.upserted_ids)} new items"
            )
        }

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save products")


@router.get("/products/search")
async def search_products(query: str = Query(default="", max_length=100)):
    try:
        safe_query = re.escape(query.strip())

        mongo_query = {}
        if safe_query:
            mongo_query = {
                "$or": [
                    {"product_name": {"$regex": safe_query, "$options": "i"}},
                    {"item_number": {"$regex": safe_query, "$options": "i"}}
                ]
            }

        cursor = products_col.find(mongo_query).limit(50)

        results = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        return {"status": "success", "data": results}

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to search products")