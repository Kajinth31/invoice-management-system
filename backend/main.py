from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import google.generativeai as genai
import json
import os
import shutil
import certifi
from pydantic import BaseModel


# This tells FastAPI exactly what a "Product" is
class Product(BaseModel):
    item_number: str
    product_name: str
    units_per_case: int
    quantity: int
    case_price: float
    rrp: float
    vat_code: str
    
app = FastAPI()

# 1. Allow React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 2. SETUP MONGODB ---
MONGO_URI = ""
# The "Universal Windows Fix" for SSL Handshake errors
try:
    ca = certifi.where()
    # We add 'tlsAllowInvalidCertificates' as a backup if your local Windows CA is outdated
    client = MongoClient(
        MONGO_URI, 
        tlsCAFile=ca,
        tls=True,
        tlsAllowInvalidCertificates=True 
    )
    db = client["smart_retail"]
    products_col = db["products"]
    # Quick test to see if the connection is alive
    client.admin.command('ping')
    print("✅ MongoDB Atlas Connection Successful!")
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}") 
# --- 3. SETUP GEMINI ---
# ⚠️ REPLACE THIS WITH YOUR REAL GOOGLE API KEY!
genai.configure(api_key="")

# --- 4. THE UPLOAD ENDPOINT ---
@app.post("/api/upload")
async def process_invoice(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    try:
        # Save the uploaded file temporarily so Gemini can read it
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"File {file.filename} received. Sending to Gemini...")

        # Upload to Gemini
        myfile = genai.upload_file(temp_file_path)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # The Super-Charged Prompt
        prompt = """
        Analyze this wholesale invoice image row by row. Extract the product table into a strict JSON list of dictionaries.
        
        CRITICAL INSTRUCTION: Be extremely careful with row alignment. Read straight across from left to right for each item. 
        Notice that the Weight/Size (e.g., 120G, 100G) is floating in its own unlabelled column.
        Notice that the UOP column usually contains a hyphen (-).
        
        Use exactly these keys:
        - "item_number" (string)
        - "product_name" (string, COMBINE the Product Description and the Weight/Size)
        - "units_per_case" (integer, from the UOS column)
        - "quantity" (integer, from the Qty column)
        - "case_price" (float, from the Price(£) column. MUST match the exact row!)
        - "rrp" (float, from the RRP(£) column)
        - "vat_code" (string, from the VAT column, usually 'Z' or 'A')
        
        Return ONLY valid JSON. No markdown, no explanations.
        """
        
        response = model.generate_content([myfile, prompt])
        raw_json = response.text.replace('```json', '').replace('```', '').strip()
        
        # Clean up the temporary file
        os.remove(temp_file_path)

        # Convert to Python dictionary and return to React
        invoice_items = json.loads(raw_json)
        return {"status": "success", "data": invoice_items}

    except Exception as e:
        print(f"Error: {e}")
        # Clean up the file if it crashes
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))


# --- 5. THE SAVE ENDPOINT ---
from pymongo import UpdateOne # Add this to the top of your file!

@app.post("/api/save")
async def save_to_db(products: list[Product]):
    try:
        # Create a list of "Update or Insert" commands
        operations = []
        for p in products:
            operations.append(
                UpdateOne(
                    {"item_number": p.item_number}, # 1. Search for this exact product
                    {"$set": p.dict()},             # 2. Update it with the new price/data
                    upsert=True                     # 3. If it doesn't exist, create it!
                )
            )
        
        # Execute all updates at once
        result = products_col.bulk_write(operations)
        
        return {
            "status": "success", 
            "message": f"Successfully updated {result.modified_count} items and added {result.upserted_count} new items!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/products/search")
async def search_products(query: str = ""):
    try:
        # Search MongoDB for product names that contain the query string (case-insensitive)
        cursor = products_col.find(
            {"product_name": {"$regex": query, "$options": "i"}}
        ).limit(50)
        
        results = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"]) # Convert MongoDB ID to string
            results.append(doc)
            
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))