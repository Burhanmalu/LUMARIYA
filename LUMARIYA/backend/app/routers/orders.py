from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all orders for the current user."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific order by ID."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(
            Order.id == order_id,
            Order.user_id == current_user.id
        )
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new order (checkout)."""
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )
    
    # Calculate totals
    subtotal = 0.0
    order_items = []
    
    for item_data in order_data.items:
        # Get product
        result = await db.execute(
            select(Product).where(Product.id == item_data.product_id)
        )
        product = result.scalar_one_or_none()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item_data.product_id} not found"
            )
        
        item_total = product.price * item_data.quantity
        subtotal += item_total
        
        order_items.append({
            "product_id": product.id,
            "product_name": product.name,
            "quantity": item_data.quantity,
            "price": product.price,
            "size": item_data.size,
            "color": item_data.color
        })
    
    # Calculate tax and shipping
    tax = subtotal * 0.18  # 18% GST for India
    shipping = 0.0 if subtotal > 5000 else 200  # Free shipping over ₹5000
    total = subtotal + tax + shipping
    
    # Create order
    new_order = Order(
        user_id=current_user.id,
        status="pending",
        subtotal=subtotal,
        tax=tax,
        shipping=shipping,
        total=total,
        shipping_address=order_data.shipping_address
    )
    
    db.add(new_order)
    await db.flush()  # Get order ID
    
    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(order_item)
    
    await db.commit()
    
    # Reload with items
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == new_order.id)
    )
    created_order = result.scalar_one()
    
    return created_order


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    new_status: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Update order status (admin only)."""
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order.status = new_status
    await db.commit()
    
    return {"message": "Order status updated successfully"}
