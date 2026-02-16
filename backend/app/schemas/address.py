from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AddressCreate(BaseModel):
    """Schema for creating an address."""
    full_name: str = Field(..., min_length=1)
    address_line1: str = Field(..., min_length=1)
    address_line2: Optional[str] = None
    city: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    zip_code: str = Field(..., min_length=1)
    country: str = Field(..., min_length=1)
    is_default: bool = False


class AddressUpdate(BaseModel):
    """Schema for updating an address."""
    full_name: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(BaseModel):
    """Schema for address response."""
    id: int
    full_name: str
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: str
    zip_code: str
    country: str
    is_default: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
