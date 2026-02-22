from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


@router.get("/", response_model=List[CartItemResponse])
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all items in user's cart."""
    result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.product))
        .where(Cart.user_id == current_user.id)
    )
    cart_items = result.scalars().all()
    
    return cart_items


@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add an item to cart."""
    # Verify product exists
    result = await db.execute(select(Product).where(Product.id == item_data.product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Check if item already in cart with same size/color
    result = await db.execute(
        select(Cart).where(
            Cart.user_id == current_user.id,
            Cart.product_id == item_data.product_id,
            Cart.size == item_data.size,
            Cart.color == item_data.color
        )
    )
    existing_item = result.scalar_one_or_none()
    
    if existing_item:
        # Update quantity
        existing_item.quantity += item_data.quantity
        await db.commit()
        await db.refresh(existing_item)
        
        # Load product relationship
        result = await db.execute(
            select(Cart)
            .options(selectinload(Cart.product))
            .where(Cart.id == existing_item.id)
        )
        cart_item = result.scalar_one()
        return cart_item
    
    # Create new cart item
    new_item = Cart(
        user_id=current_user.id,
        **item_data.model_dump()
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    # Load product relationship
    result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.product))
        .where(Cart.id == new_item.id)
    )
    cart_item = result.scalar_one()
    
    return cart_item


@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update cart item quantity."""
    result = await db.execute(
        select(Cart).where(
            Cart.id == item_id,
            Cart.user_id == current_user.id
        )
    )
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    cart_item.quantity = item_data.quantity
    await db.commit()
    await db.refresh(cart_item)
    
    # Load product relationship
    result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.product))
        .where(Cart.id == cart_item.id)
    )
    updated_item = result.scalar_one()
    
    return updated_item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove an item from cart."""
    result = await db.execute(
        select(Cart).where(
            Cart.id == item_id,
            Cart.user_id == current_user.id
        )
    )
    cart_item = result.scalar_one_or_none()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    await db.delete(cart_item)
    await db.commit()
    
    return None


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Clear all items from cart."""
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id)
    )
    cart_items = result.scalars().all()
    
    for item in cart_items:
        await db.delete(item)
    
    await db.commit()
    
    return None
