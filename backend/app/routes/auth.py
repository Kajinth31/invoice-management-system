from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate
from app.database import users_collection
from app.utils.security import hash_password

router = APIRouter()

@router.post("/register")
async def register_user(user: UserCreate):
    try:
        # Check if email already exists
        existing_user = await users_collection.find_one({"email": user.email})

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Extra safety check before hashing
        if len(user.password.encode("utf-8")) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password must be 72 bytes or less"
            )

        # Hash password
        hashed_password = hash_password(user.password)

        # Prepare user document
        new_user = {
            "name": user.name,
            "shop": user.shop,
            "email": user.email,
            "password": hashed_password
        }

        # Save user
        result = await users_collection.insert_one(new_user)

        return {
            "status": "success",
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }

    except HTTPException:
        raise
    except Exception as e:
        print("REGISTER ERROR:", e)
        raise HTTPException(status_code=500, detail="Registration failed")