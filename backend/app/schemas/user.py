from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str
    shop: str
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)