"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"

const products = [
  {
    id: "silk-evening-coat",
    name: "The Atelier Coat",
    price: 2450,
    image: "https://images.pexels.com/photos/17561664/pexels-photo-17561664.jpeg",
    hoverImage: "https://images.pexels.com/photos/17561664/pexels-photo-17561664.jpeg",
    category: "Outerwear",
  },
  {
    id: "cashmere-wrap-dress",
    name: "Silk Evening Dress",
    price: 1890,
    image: "https://images.pexels.com/photos/28593662/pexels-photo-28593662.jpeg",
    hoverImage: "https://images.pexels.com/photos/28593662/pexels-photo-28593662.jpeg",
    category: "Dresses",
  },
  {
    id: "merino-turtleneck",
    name: "Cashmere Knit",
    price: 890,
    image: "https://images.pexels.com/photos/28593645/pexels-photo-28593645.jpeg",
    hoverImage: "https://images.pexels.com/photos/28593645/pexels-photo-28593645.jpeg",
    category: "Knitwear",
  },
  {
    id: "linen-trousers",
    name: "Tailored Trousers",
    price: 680,
    image: "https://images.pexels.com/photos/33376518/pexels-photo-33376518.jpeg",
    hoverImage: "https://images.pexels.com/photos/33376518/pexels-photo-33376518.jpeg",
    category: "Bottoms",
  },
  {
    id: "structured-handbag",
    name: "Leather Tote",
    price: 1650,
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    hoverImage: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg",
    category: "Accessories",
  },
  {
    id: "leather-belt",
    name: "Heritage Watch",
    price: 4200,
    image: "https://images.pexels.com/photos/34414846/pexels-photo-34414846.jpeg",
    hoverImage: "https://images.pexels.com/photos/34414846/pexels-photo-34414846.jpeg",
    category: "Timepieces",
  },
]

export function CollectionGrid() {
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
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">Curated Selection</h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto">
            Each piece tells a story of meticulous craftsmanship
          </p>
        </motion.div>

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* First row - offset layout */}
          <div className="lg:pt-12">
            <ProductCard {...products[0]} index={0} />
          </div>
          <div>
            <ProductCard {...products[1]} index={1} />
          </div>
          <div className="lg:pt-24">
            <ProductCard {...products[2]} index={2} />
          </div>

          {/* Second row - different offset */}
          <div>
            <ProductCard {...products[3]} index={3} />
          </div>
          <div className="lg:pt-16">
            <ProductCard {...products[4]} index={4} />
          </div>
          <div className="lg:-mt-8">
            <ProductCard {...products[5]} index={5} />
          </div>
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
