from pydantic import BaseModel
from typing import Optional


class Product(BaseModel):
    # Optional means this field can be empty if OCR does not find it
    item_number: Optional[str] = ""
    product_name: str
    quantity: Optional[int] = 0
    units_per_case: float
    case_price: float
    vat_code: Optional[str] = ""
    rrp: Optional[float] = 0.0
    individualVat: Optional[float] = None
    individualMargin: Optional[float] = None