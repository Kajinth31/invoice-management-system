from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import ALLOWED_ORIGINS
from app.routes.upload import router as upload_router
from app.routes.products import router as products_router

app = FastAPI(title="SmartRetail API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(products_router, prefix="/api", tags=["Products"])


@app.get("/")
def root():
    return {"message": "SmartRetail API is running"}