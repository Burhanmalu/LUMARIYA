"use client"

import { Suspense, useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { fetchProducts } from "@/lib/api"
import { mapProduct, categories, type ProductDisplay } from "@/lib/products"
import { ArrowRight, ChevronDown, Check } from "lucide-react"

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
  { label: "Over ₹5000", min: 5000, max: Infinity },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "All"

  const [allProducts, setAllProducts] = useState<ProductDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activePriceRange, setActivePriceRange] = useState(priceRanges[0])
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)

  // Sync activeCategory when searchParams change (for footer links while already on shop page)
  useEffect(() => {
    const cat = searchParams.get("category") || "All"
    setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const mapped = data.map(mapProduct)
        setAllProducts(mapped)
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch = activeCategory === "All" || product.category === activeCategory
      const priceMatch = product.price >= activePriceRange.min && product.price <= activePriceRange.max
      return categoryMatch && priceMatch
    })
  }, [allProducts, activeCategory, activePriceRange])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[360px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-foreground/80" />
        <motion.div
          className="relative z-10 text-center text-background px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-background/60 mb-4">RAMDAN 2026</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">The Collection</h1>
          <p className="text-base md:text-lg text-background/70 max-w-xl mx-auto">
            Authentic Bohra Ridas designed with care, devotion, and cultural elegance.
          </p>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-200 border ${activeCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground/60 border-transparent hover:text-foreground hover:border-foreground/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                className="flex items-center justify-between gap-4 px-4 py-2 border border-border bg-background text-[10px] md:text-xs tracking-[0.15em] uppercase hover:border-foreground/40 transition-colors w-full md:w-auto"
              >
                <span>{activePriceRange.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isPriceDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isPriceDropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-30 md:hidden"
                      onClick={() => setIsPriceDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-full md:w-56 bg-background border border-border shadow-xl z-50 overflow-hidden"
                    >
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => {
                            setActivePriceRange(range)
                            setIsPriceDropdownOpen(false)
                          }}
                          className="flex items-center justify-between w-full px-4 py-3 text-left text-[10px] md:text-xs tracking-[0.1em] uppercase hover:bg-foreground/5 transition-colors group"
                        >
                          <span className={activePriceRange.label === range.label ? "text-foreground font-medium" : "text-foreground/60 group-hover:text-foreground"}>
                            {range.label}
                          </span>
                          {activePriceRange.label === range.label && <Check className="w-3 h-3 text-foreground" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-4" />
                  <div className="h-3 bg-muted w-20 mb-2" />
                  <div className="h-5 bg-muted w-40 mb-2" />
                  <div className="h-4 bg-muted w-24" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-xs text-foreground/40 uppercase tracking-wider">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
                  {activeCategory !== "All" && ` in ${activeCategory}`}
                  {activePriceRange.label !== "All Prices" && ` within ${activePriceRange.label}`}
                </p>

                {(activeCategory !== "All" || activePriceRange.label !== "All Prices") && (
                  <button
                    onClick={() => {
                      setActiveCategory("All")
                      setActivePriceRange(priceRanges[0])
                    }}
                    className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground border-b border-transparent hover:border-foreground transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24 border border-border bg-foreground/[0.01]"
                  >
                    <p className="text-2xl font-serif text-foreground/60 mb-3">
                      No results found
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Unfortunately, no Ridas match your current selection.
                      Try adjusting your category or price range.
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory("All")
                        setActivePriceRange(priceRanges[0])
                      }}
                      className="mt-8 text-xs uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-foreground/60 transition-colors"
                    >
                      View All Ridas
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${activeCategory}-${activePriceRange.label}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: Math.min(index * 0.05, 0.3),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link href={`/product/${product.id}`} className="group block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              loading="lazy"
                              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
                            />
                            <Image
                              src={product.hoverImage || "/placeholder.svg"}
                              alt={`${product.name} alternate view`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              loading="lazy"
                              className="object-cover absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs tracking-widest text-muted-foreground uppercase">{product.category}</p>
                            <h3 className="font-serif text-lg group-hover:underline underline-offset-4 transition-all">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      {/* Heritage CTA */}
      <section className="border-t border-muted py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Crafted with Purpose</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Every Rida is rooted in Bohra heritage — a perfect blend of tradition, precision, and contemporary elegance.
          </p>
          <Link
            href="/heritage"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase border-b border-foreground pb-1 hover:gap-4 transition-all duration-300"
          >
            Discover Our Heritage
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
