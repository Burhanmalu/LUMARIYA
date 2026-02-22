"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ProductGallery } from "@/components/product-gallery"
import { ColorSelector } from "@/components/color-selector"
import { ProductDetailsAccordion } from "@/components/product-details-accordion"
import { RelatedProducts } from "@/components/related-products"
import { fetchProduct, fetchProducts } from "@/lib/api"
import { mapProduct, type ProductDisplay } from "@/lib/products"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "sonner"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [product, setProduct] = useState<ProductDisplay | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    fetchProduct(id)
      .then((data) => {
        if (!data) {
          router.push('/shop')
          return
        }
        setProduct(mapProduct(data))
      })
      .catch(() => router.push('/shop'))
      .finally(() => setLoading(false))

    // Fetch related products
    fetchProducts()
      .then((all) => {
        const related = all
          .filter((p: any) => p.id !== id)
          .slice(0, 4)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image || '/placeholder.svg',
            hoverImage: p.hover_image || p.image || '/placeholder.svg',
            category: p.category,
          }))
        setRelatedProducts(related)
      })
      .catch(() => { })
  }, [id, router])

  if (loading || !product) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="aspect-[3/4] bg-muted animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 bg-muted w-24 animate-pulse" />
              <div className="h-10 bg-muted w-72 animate-pulse" />
              <div className="h-6 bg-muted w-32 animate-pulse" />
              <div className="h-20 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  const accordionItems = [
    {
      title: "Details",
      content: product.details?.length ? product.details : ["Premium quality craftsmanship"],
    },
    {
      title: "Materials",
      content: product.materials?.length ? product.materials : ["Premium materials"],
    },
    {
      title: "Care",
      content: product.care?.length ? product.care : ["Handle with care"],
    },
    {
      title: "Shipping & Returns",
      content: [
        "Complimentary shipping on all orders",
        "Express delivery available",
        "Free returns within 30 days",
        "Items must be unworn with tags attached",
      ],
    },
  ]

  const galleryImages = [product.image, product.hoverImage].filter(
    (img) => img && img !== '/placeholder.svg'
  )
  if (galleryImages.length === 0) galleryImages.push('/placeholder.svg')

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductGallery images={galleryImages} productName={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:sticky lg:top-32 lg:self-start space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">{product.category}</p>
              <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
              <p className="text-xl">₹{product.price.toLocaleString()}</p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.longDescription || product.description}</p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && <ColorSelector colors={product.colors} />}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && <ColorSelector colors={product.colors} />}

            {/* Add to Bag */}
            <motion.button
              className="w-full py-4 bg-foreground text-background text-sm tracking-widest uppercase hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthModalOpen(true)
                  return
                }

                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.image
                })
                toast.success(`${product.name} added to bag`)
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </motion.button>

            {/* Made In */}
            {product.madeIn && (
              <p className="text-xs text-muted-foreground text-center tracking-widest">Made in {product.madeIn}</p>
            )}

            {/* Accordion */}
            <ProductDetailsAccordion items={accordionItems} />
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}

      <PremiumFooter />

      {/* Auth modal */}
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSuccess={() => {
          alert('Item added to cart!')
        }}
      />
    </main>
  )
}
