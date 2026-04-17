from passlib.context import CryptContext

# This creates a password hashing tool using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Convert a normal password into a hashed password.
    Example:
    '123456' -> '$2b$12$.....'
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    This will be used later in login.
    It checks if the normal password matches the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)