"""
Seed data script to populate the database with initial products.
Run this script after setting up your NeonDB connection.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import get_settings
from app.models.product import Product
from app.database import Base

settings = get_settings()

# Product data from frontend
PRODUCTS = [
    {
        "id": "silk-evening-coat",
        "name": "Silk Evening Coat",
        "price": 2450,
        "category": "Rida",
        "image": "/elegant-black-silk-evening-coat-luxury-fashion.jpg",
        "hover_image": "/elegant-black-silk-evening-coat-back-view-luxury.jpg",
        "description": "A masterpiece of understated elegance",
        "long_description": "Crafted from the finest mulberry silk, this evening coat represents the pinnacle of Italian tailoring. Each piece is hand-finished by our master artisans in Florence, ensuring unparalleled quality and attention to detail. The fluid silhouette drapes effortlessly, creating a timeless look suitable for the most discerning occasions.",
        "materials": ["100% Mulberry Silk", "Silk charmeuse lining", "Mother of pearl buttons"],
        "care": ["Dry clean only", "Store on padded hanger", "Avoid direct sunlight"],
        "sizes": [
            {"size": "XS", "available": True},
            {"size": "S", "available": True},
            {"size": "M", "available": True},
            {"size": "L", "available": False},
            {"size": "XL", "available": True},
        ],
        "colors": [
            {"name": "Noir", "hex": "#0A0A0A", "available": True},
            {"name": "Ivory", "hex": "#F5F5DC", "available": True},
            {"name": "Midnight", "hex": "#191970", "available": False},
        ],
        "details": ["Hand-stitched lapels", "Interior pocket with silk trim", "Custom LUMARIYA hardware", "Numbered authenticity tag"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "cashmere-wrap-dress",
        "name": "Cashmere Wrap Dress",
        "price": 1890,
        "category": "Rida",
        "image": "/cream-cashmere-wrap-dress-elegant-luxury-fashion.jpg",
        "hover_image": "/cream-cashmere-wrap-dress-side-view-luxury.jpg",
        "description": "Effortless sophistication in pure cashmere",
        "long_description": "This wrap dress is woven from Grade-A Mongolian cashmere, selected for its exceptional softness and durability. The wrap silhouette flatters every figure while the generous proportions ensure comfort without compromising elegance. A wardrobe essential that transitions seamlessly from day to evening.",
        "materials": ["100% Grade-A Mongolian Cashmere", "Silk blend lining", "Self-tie belt"],
        "care": ["Dry clean recommended", "May be hand washed in cold water", "Lay flat to dry"],
        "sizes": [
            {"size": "XS", "available": True},
            {"size": "S", "available": False},
            {"size": "M", "available": True},
            {"size": "L", "available": True},
            {"size": "XL", "available": True},
        ],
        "colors": [
            {"name": "Cream", "hex": "#FFFDD0", "available": True},
            {"name": "Camel", "hex": "#C19A6B", "available": True},
            {"name": "Grey Mélange", "hex": "#808080", "available": True},
        ],
        "details": ["Double-faced construction", "Hand-rolled edges", "Adjustable wrap closure", "Signature interior label"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "tailored-wool-blazer",
        "name": "Tailored Wool Blazer",
        "price": 1650,
        "category": "Rida",
        "image": "/navy-wool-tailored-blazer-luxury-menswear-fashion.jpg",
        "hover_image": "/navy-wool-tailored-blazer-open-luxury-fashion.jpg",
        "description": "The foundation of modern elegance",
        "long_description": "Cut from Super 150s wool sourced from the finest Australian merino sheep, this blazer exemplifies LUMARIYA's commitment to exceptional quality. The half-canvas construction allows for a natural drape while maintaining structure. Each blazer requires over 30 hours of handwork to complete.",
        "materials": ["100% Super 150s Merino Wool", "Bemberg cupro lining", "Horn buttons"],
        "care": ["Dry clean only", "Steam to refresh", "Store with cedar blocks"],
        "sizes": [
            {"size": "46", "available": True},
            {"size": "48", "available": True},
            {"size": "50", "available": True},
            {"size": "52", "available": True},
            {"size": "54", "available": False},
        ],
        "colors": [
            {"name": "Navy", "hex": "#000080", "available": True},
            {"name": "Charcoal", "hex": "#36454F", "available": True},
            {"name": "Black", "hex": "#0A0A0A", "available": True},
        ],
        "details": ["Half-canvas construction", "Working cuff buttons", "Pick-stitched lapels", "Interior passport pocket"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "merino-turtleneck",
        "name": "Merino Turtleneck",
        "price": 485,
        "category": "Rida",
        "image": "/charcoal-merino-wool-turtleneck-sweater-luxury-min.jpg",
        "hover_image": "/charcoal-merino-turtleneck-detail-texture-luxury.jpg",
        "description": "Essential luxury for every season",
        "long_description": "Knitted from extra-fine merino wool in a 12-gauge construction, this turtleneck offers exceptional warmth without bulk. The ribbed neck, cuffs, and hem provide subtle texture while maintaining a clean, minimal aesthetic. An indispensable foundation piece for the considered wardrobe.",
        "materials": ["100% Extra-fine Merino Wool", "12-gauge knit construction"],
        "care": ["Hand wash cold", "Dry flat", "Do not tumble dry"],
        "sizes": [
            {"size": "XS", "available": True},
            {"size": "S", "available": True},
            {"size": "M", "available": True},
            {"size": "L", "available": True},
            {"size": "XL", "available": False},
        ],
        "colors": [
            {"name": "Charcoal", "hex": "#36454F", "available": True},
            {"name": "Ecru", "hex": "#F5F5DC", "available": True},
            {"name": "Burgundy", "hex": "#722F37", "available": True},
            {"name": "Forest", "hex": "#228B22", "available": False},
        ],
        "details": ["Fully fashioned construction", "Reinforced seams", "Ribbed trim details", "Embroidered interior label"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "leather-belt",
        "name": "Artisan Leather Belt",
        "price": 320,
        "category": "Rida",
        "image": "/brown-leather-belt-gold-buckle-luxury-accessory-mi.jpg",
        "hover_image": "/brown-leather-belt-detail-stitching-luxury.jpg",
        "description": "Handcrafted from Tuscan leather",
        "long_description": "Each belt is cut from a single piece of vegetable-tanned Tuscan leather, selected for its natural grain and character. The solid brass buckle is cast using traditional methods and finished by hand. With proper care, this belt will develop a beautiful patina over years of wear.",
        "materials": ["Vegetable-tanned Tuscan leather", "Solid brass buckle", "Hand-stitched edges"],
        "care": ["Condition with leather balm", "Store flat or rolled", "Avoid water exposure"],
        "sizes": [
            {"size": "80", "available": True},
            {"size": "85", "available": True},
            {"size": "90", "available": True},
            {"size": "95", "available": True},
            {"size": "100", "available": True},
        ],
        "colors": [
            {"name": "Cognac", "hex": "#9A463D", "available": True},
            {"name": "Dark Brown", "hex": "#3E2723", "available": True},
            {"name": "Black", "hex": "#0A0A0A", "available": True},
        ],
        "details": ["3.5cm width", "Single-prong buckle", "Burnished edges", "Embossed LUMARIYA logo"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "silk-scarf",
        "name": "Silk Twill Scarf",
        "price": 295,
        "category": "Rida",
        "image": "/silk-scarf-abstract-pattern-luxury-accessory-elega.jpg",
        "hover_image": "/silk-scarf-draped-luxury-fashion-accessory.jpg",
        "description": "Woven poetry in silk",
        "long_description": "Printed using traditional screen-printing techniques, each scarf requires up to 12 separate screens to achieve its depth of color. The hand-rolled edges are a hallmark of true luxury, executed by skilled artisans who have perfected this craft over decades.",
        "materials": ["100% Silk twill", "Hand-rolled edges", "Screen-printed design"],
        "care": ["Dry clean only", "Store in tissue paper", "Avoid perfume contact"],
        "sizes": [
            {"size": "70x70cm", "available": True},
            {"size": "90x90cm", "available": True},
        ],
        "colors": [
            {"name": "Archive Print", "hex": "#D4AF37", "available": True},
            {"name": "Geometric", "hex": "#708090", "available": True},
            {"name": "Botanical", "hex": "#228B22", "available": True},
        ],
        "details": ["12-color screen print", "Hand-rolled hem", "90x90cm dimensions", "Signature LUMARIYA motif"],
        "made_in": "Como, Italy",
    },
    {
        "id": "linen-trousers",
        "name": "Relaxed Linen Trousers",
        "price": 580,
        "category": "Rida",
        "image": "/beige-linen-trousers-relaxed-fit-luxury-fashion.jpg",
        "hover_image": "/beige-linen-trousers-detail-pocket-luxury.jpg",
        "description": "Effortless summer elegance",
        "long_description": "Woven from Belgian linen renowned for its exceptional quality, these trousers offer a relaxed silhouette without sacrificing sophistication. The pre-washed fabric ensures minimal shrinkage and a soft hand feel from the first wear. Thoughtful details include interior waistband finishing and French seams throughout.",
        "materials": ["100% Belgian Linen", "Cotton pocket lining", "Corozo nut buttons"],
        "care": ["Machine wash cold", "Tumble dry low", "Iron while damp for crisp finish"],
        "sizes": [
            {"size": "XS", "available": True},
            {"size": "S", "available": True},
            {"size": "M", "available": False},
            {"size": "L", "available": True},
            {"size": "XL", "available": True},
        ],
        "colors": [
            {"name": "Sand", "hex": "#C2B280", "available": True},
            {"name": "White", "hex": "#FFFFFF", "available": True},
            {"name": "Navy", "hex": "#000080", "available": True},
        ],
        "details": ["Relaxed fit", "Elasticated back waist", "French seam construction", "Slash pockets"],
        "made_in": "Florence, Italy",
    },
    {
        "id": "structured-handbag",
        "name": "Structured Leather Handbag",
        "price": 1890,
        "category": "Rida",
        "image": "/black-structured-leather-handbag-luxury-minimal-de.jpg",
        "hover_image": "/placeholder.svg?height=800&width=600",
        "description": "Architectural precision meets artisanal craft",
        "long_description": "This handbag represents the culmination of LUMARIYA's leather expertise. Each bag is constructed from a single hide, carefully selected for consistency of grain and texture. The architectural silhouette is achieved through meticulous internal construction, while the exterior remains elegantly minimal.",
        "materials": ["Full-grain calfskin leather", "Suede interior lining", "Brass hardware with palladium finish"],
        "care": ["Store in dust bag", "Condition bi-annually", "Avoid rain exposure"],
        "sizes": [
            {"size": "Small", "available": True},
            {"size": "Medium", "available": True},
            {"size": "Large", "available": False},
        ],
        "colors": [
            {"name": "Noir", "hex": "#0A0A0A", "available": True},
            {"name": "Burgundy", "hex": "#722F37", "available": True},
            {"name": "Tan", "hex": "#D2B48C", "available": True},
        ],
        "details": ["Single-hide construction", "Interior zip pocket", "Detachable shoulder strap", "Signature LUMARIYA clasp"],
        "made_in": "Florence, Italy",
    },
]


async def seed_database():
    """Seed the database with initial product data."""
    print("🌱 Starting database seeding...")
    
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=True)
    
    # Create tables
    async with engine.begin() as conn:
        print("📦 Creating database tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        # Check if products already exist
        from sqlalchemy import select
        result = await session.execute(select(Product))
        existing_products = result.scalars().all()
        
        if existing_products:
            print(f"⚠️  Database already contains {len(existing_products)} products. Skipping seed.")
            return
        
        # Add products
        print(f"✨ Adding {len(PRODUCTS)} products to database...")
        for product_data in PRODUCTS:
            product = Product(**product_data)
            session.add(product)
        
        await session.commit()
        print("✅ Database seeding completed successfully!")
        print(f"📊 Added {len(PRODUCTS)} products")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_database())
