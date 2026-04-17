import re
from fastapi import APIRouter, HTTPException, Query
from pymongo import UpdateOne

from app.database import products_collection
from app.schemas.product import Product

router = APIRouter()


@router.post("/save")
async def save_to_db(products: list[Product]):
    """
    PURPOSE:
    Save a list of products into MongoDB.

    HOW IT WORKS:
    - Receives products from frontend
    - Loops through each product
    - Creates bulk update operations
    - If item already exists, update it
    - If item does not exist, insert it
    """

    try:
        operations = []

        for p in products:
            # Convert Pydantic model into normal dictionary
            product_data = p.model_dump()

            # Use item_number as the unique key for update/upsert
            operations.append(
                UpdateOne(
                    {"item_number": p.item_number},
                    {"$set": product_data},
                    upsert=True
                )
            )

        # If frontend sends empty list
        if not operations:
            return {
                "status": "success",
                "message": "No products to save"
            }

        # Because you are using Motor async MongoDB, use await here
        result = await products_collection.bulk_write(operations)

        return {
            "status": "success",
            "message": (
                f"Updated {result.modified_count} items and "
                f"added {len(result.upserted_ids)} new items"
            )
        }

    except Exception as e:
        print("SAVE ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to save products")


@router.get("/products/search")
async def search_products(query: str = Query(default="", max_length=100)):
    """
    PURPOSE:
    Search products by product name or item number.

    HOW IT WORKS:
    - Takes search text from frontend
    - Escapes special regex characters for safety
    - Searches MongoDB using regex
    - Returns up to 50 matching products
    """

    try:
        # Remove spaces at beginning/end
        cleaned_query = query.strip()

        # Escape regex special characters so user input is safe
        safe_query = re.escape(cleaned_query)

        mongo_query = {}

        # If user typed something, search by product_name or item_number
        if safe_query:
            mongo_query = {
                "$or": [
                    {"product_name": {"$regex": safe_query, "$options": "i"}},
                    {"item_number": {"$regex": safe_query, "$options": "i"}}
                ]
            }

        # Create MongoDB cursor
        cursor = products_collection.find(mongo_query).limit(50)

        results = []

        # Motor cursor must use async for
        async for doc in cursor:
            # Convert MongoDB ObjectId to string so React can read it
            doc["_id"] = str(doc["_id"])
            results.append(doc)

        return {
            "status": "success",
            "data": results
        }

    except Exception as e:
        print("SEARCH ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to search products")
    