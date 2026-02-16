from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.schemas.product import ProductResponse


class CartItemCreate(BaseModel):
    """Schema for adding item to cart."""
    product_id: str
    quantity: int = Field(..., gt=0)
    size: Optional[str] = None
    color: Optional[str] = None


class CartItemUpdate(BaseModel):
    """Schema for updating cart item."""
    quantity: int = Field(..., gt=0)


class CartItemResponse(BaseModel):
    """Schema for cart item response."""
    id: int
    product_id: str
    quantity: int
    size: Optional[str]
    color: Optional[str]
    created_at: datetime
    product: ProductResponse
    
    class Config:
        from_attributes = True
