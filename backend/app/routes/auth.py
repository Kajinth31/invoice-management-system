from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import users_collection
from app.utils.security import hash_password, verify_password

router = APIRouter()


class UserCreate(BaseModel):
    name: str
    shop: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register_user(user: UserCreate):
    try:
        existing_user = await users_collection.find_one({"email": user.email})

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        if len(user.password.encode("utf-8")) > 72:
            raise HTTPException(status_code=400, detail="Password must be 72 bytes or less")

        hashed_password = hash_password(user.password)

        new_user = {
            "name": user.name,
            "shop": user.shop,
            "email": user.email,
            "password": hashed_password
        }

        result = await users_collection.insert_one(new_user)

        return {
            "status": "success",
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }

    except HTTPException:
        raise
    except Exception as e:
        print("REGISTER ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
async def login_user(user: UserLogin):
    try:
        print("LOGIN EMAIL RECEIVED:", user.email)

        existing_user = await users_collection.find_one({"email": user.email})
        print("FOUND USER:", existing_user)

        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")

        password_ok = verify_password(user.password, existing_user["password"])

        if not password_ok:
            raise HTTPException(status_code=401, detail="Invalid password")

        return {
            "status": "success",
            "message": "Login successful",
            "token": str(existing_user["_id"]),  # temporary token for now
            "user": {
                "id": str(existing_user["_id"]),
                "name": existing_user["name"],
                "shop": existing_user["shop"],
                "email": existing_user["email"]
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print("LOGIN ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))