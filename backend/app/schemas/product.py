from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any


class ProductCreate(BaseModel):
    """Schema for creating a product."""
    id: str
    name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    category: str
    description: Optional[str] = None
    long_description: Optional[str] = None
    image: Optional[str] = None
    hover_image: Optional[str] = None
    materials: Optional[List[str]] = []
    care: Optional[List[str]] = []
    details: Optional[List[str]] = []
    sizes: Optional[List[Any]] = []
    colors: Optional[List[Any]] = []
    made_in: Optional[str] = None


class ProductUpdate(BaseModel):
    """Schema for updating a product."""
    name: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    image: Optional[str] = None
    hover_image: Optional[str] = None
    materials: Optional[List[str]] = None
    care: Optional[List[str]] = None
    details: Optional[List[str]] = None
    sizes: Optional[List[Any]] = None
    colors: Optional[List[Any]] = None
    made_in: Optional[str] = None


class ProductResponse(BaseModel):
    """Schema for product response."""
    id: str
    name: str
    price: float
    category: str
    description: Optional[str]
    long_description: Optional[str]
    image: Optional[str]
    hover_image: Optional[str]
    materials: Optional[List[str]]
    care: Optional[List[str]]
    details: Optional[List[str]]
    sizes: Optional[List[Any]]
    colors: Optional[List[Any]]
    made_in: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
