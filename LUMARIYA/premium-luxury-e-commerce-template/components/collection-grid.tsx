"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { fetchProducts } from "@/lib/api"

interface DisplayProduct {
  id: string
  name: string
  price: number
  image: string
  hoverImage: string
  category: string
}

export function CollectionGrid() {
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const mapped = data.slice(0, 6).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image || '/placeholder.svg',
          hoverImage: p.hover_image || p.image || '/placeholder.svg',
          category: p.category,
        }))
        setProducts(mapped)
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 lg:mb-24">
            <div className="h-10 bg-muted w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-muted w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted mb-4" />
                <div className="h-3 bg-muted w-20 mb-2" />
                <div className="h-5 bg-muted w-40 mb-2" />
                <div className="h-4 bg-muted w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">Carefully Curated Ridas</h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto mb-8">
            Our collection is being curated. Check back soon for exquisite pieces.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:border-transparent transition-colors duration-300"
          >
            Visit Shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">Carefully Curated Ridas</h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto">
            Designed with precision, comfort, and cultural elegance
          </p>
        </motion.div>

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => {
            const offsets = ['lg:pt-12', '', 'lg:pt-24', '', 'lg:pt-16', 'lg:-mt-8']
            return (
              <div key={product.id} className={offsets[index] || ''}>
                <ProductCard {...product} index={index} />
              </div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 lg:mt-24"
        >
          <Link
            href="/shop"
            className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:border-transparent transition-colors duration-300"
          >
            View Full Collection
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
