from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any


class OrderItemCreate(BaseModel):
    """Schema for creating order item."""
    product_id: str
    quantity: int = Field(..., gt=0)
    color: Optional[str] = None


class OrderItemResponse(BaseModel):
    """Schema for order item response."""
    id: int
    product_id: Optional[str]
    product_name: str
    quantity: int
    price: float
    color: Optional[str]
    
    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    """Schema for creating an order (checkout)."""
    items: List[OrderItemCreate]
    shipping_address: Any  # JSON object with address details
    

class OrderResponse(BaseModel):
    """Schema for order response."""
    id: int
    status: str
    total: float
    subtotal: float
    tax: float
    shipping: float
    shipping_address: Any
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True
