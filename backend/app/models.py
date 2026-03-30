from pydantic import BaseModel, Field
from typing import Optional


class Product(BaseModel):
    item_number: str = Field(..., min_length=1)
    product_name: str = Field(..., min_length=1)
    units_per_case: int = Field(..., ge=1)
    quantity: int = Field(..., ge=0)
    case_price: float = Field(..., ge=0)
    rrp: float = Field(..., ge=0)
    vat_code: str = Field(..., min_length=1, max_length=5)
    individualVat: Optional[float] = Field(default=None, ge=0)
    individualMargin: Optional[float] = Field(default=None, ge=0)