from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.address import Address
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update user profile."""
    update_data = user_data.model_dump(exclude_unset=True)
    
    # Check if email is being changed and if it's already taken
    if "email" in update_data:
        result = await db.execute(
            select(User).where(
                User.email == update_data["email"],
                User.id != current_user.id
            )
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user


# Address endpoints
@router.get("/addresses", response_model=List[AddressResponse])
async def list_addresses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all addresses for current user."""
    result = await db.execute(
        select(Address).where(Address.user_id == current_user.id)
    )
    addresses = result.scalars().all()
    
    return addresses


@router.post("/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(
    address_data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new address."""
    # If this is set as default, unset other defaults
    if address_data.is_default:
        result = await db.execute(
            select(Address).where(
                Address.user_id == current_user.id,
                Address.is_default == True
            )
        )
        existing_defaults = result.scalars().all()
        for addr in existing_defaults:
            addr.is_default = False
    
    new_address = Address(
        user_id=current_user.id,
        **address_data.model_dump()
    )
    
    db.add(new_address)
    await db.commit()
    await db.refresh(new_address)
    
    return new_address


@router.put("/addresses/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update an address."""
    result = await db.execute(
        select(Address).where(
            Address.id == address_id,
            Address.user_id == current_user.id
        )
    )
    address = result.scalar_one_or_none()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    update_data = address_data.model_dump(exclude_unset=True)
    
    # If setting as default, unset other defaults
    if update_data.get("is_default"):
        result = await db.execute(
            select(Address).where(
                Address.user_id == current_user.id,
                Address.is_default == True,
                Address.id != address_id
            )
        )
        existing_defaults = result.scalars().all()
        for addr in existing_defaults:
            addr.is_default = False
    
    for field, value in update_data.items():
        setattr(address, field, value)
    
    await db.commit()
    await db.refresh(address)
    
    return address


@router.delete("/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an address."""
    result = await db.execute(
        select(Address).where(
            Address.id == address_id,
            Address.user_id == current_user.id
        )
    )
    address = result.scalar_one_or_none()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    await db.delete(address)
    await db.commit()
    
    return None
