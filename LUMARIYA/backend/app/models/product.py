from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    """Product model for e-commerce catalog."""
    
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False, index=True)
    description = Column(Text)
    long_description = Column(Text)
    image = Column(String)
    hover_image = Column(String)
    materials = Column(JSON)  # Array of materials
    care = Column(JSON)  # Array of care instructions
    details = Column(JSON)  # Array of detail points
    colors = Column(JSON)  # Array of color objects with availability
    made_in = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    cart_items = relationship("Cart", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
