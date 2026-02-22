from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List
import os
import uuid
import shutil

from app.database import get_db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency that requires admin access."""
    if current_user.is_admin != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/stats")
async def get_admin_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get aggregate admin dashboard statistics."""
    # Total products
    result = await db.execute(select(func.count(Product.id)))
    total_products = result.scalar() or 0

    # Total users
    result = await db.execute(select(func.count(User.id)))
    total_users = result.scalar() or 0

    # Total orders
    result = await db.execute(select(func.count(Order.id)))
    total_orders = result.scalar() or 0

    # Total revenue
    result = await db.execute(select(func.coalesce(func.sum(Order.total), 0)))
    revenue = result.scalar() or 0

    # Pending orders
    result = await db.execute(
        select(func.count(Order.id)).where(Order.status == "pending")
    )
    pending_orders = result.scalar() or 0

    return {
        "totalProducts": total_products,
        "totalUsers": total_users,
        "totalOrders": total_orders,
        "revenue": round(float(revenue), 2),
        "pendingOrders": pending_orders,
        "lowStockItems": 0
    }


@router.get("/orders")
async def list_all_orders(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all orders for admin view."""
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.user))
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    return [
        {
            "id": order.id,
            "status": order.status,
            "total": order.total,
            "subtotal": order.subtotal,
            "tax": order.tax,
            "shipping": order.shipping,
            "shipping_address": order.shipping_address,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "customer_name": order.user.full_name if order.user else "Unknown",
            "customer_email": order.user.email if order.user else "Unknown",
            "items": [
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "price": item.price,
                    "size": item.size,
                    "color": item.color
                }
                for item in order.items
            ]
        }
        for order in orders
    ]


@router.get("/users")
async def list_all_users(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """List all users for admin view."""
    result = await db.execute(
        select(User).order_by(User.created_at.desc())
    )
    users = result.scalars().all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_admin,
            "oauth_provider": user.oauth_provider,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]


@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Toggle admin role for a user."""
    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own admin status"
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Toggle admin status
    user.is_admin = 0 if user.is_admin == 1 else 1
    await db.commit()

    return {"message": f"User role updated", "is_admin": user.is_admin}


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(require_admin)
):
    """Upload a product image."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG, WebP, or GIF)"
        )

    # Generate unique filename
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the URL path
    image_url = f"http://localhost:8000/static/uploads/{filename}"

    return {"url": image_url, "filename": filename}
