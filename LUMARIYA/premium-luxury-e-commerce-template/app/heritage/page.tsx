"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const timeline = [
  {
    year: "1924",
    title: "Seeds of Tradition",
    description:
      "Our great-grandfather established a small textile workshop in the heart of Surat, dedicated to sourcing the finest silks for the Dawoodi Bohra community.",
  },
  {
    year: "1958",
    title: "Artisanal Mastery",
    description:
      "The second generation introduced hand-guided embroidery techniques, blending traditional Zardosi with contemporary aesthetic sensibilities.",
  },
  {
    year: "1985",
    title: "Lumariya is Born",
    description:
      "Formally launching under the Lumariya name, we became synonymous with premium Ridas, serving families across Mumbai, East Africa, and the Gulf.",
  },
  {
    year: "2010",
    title: "Global Craft",
    description:
      "Expanding our reach digitally, we connected artisans directly with the global Bohra diaspora, preserving heritage while embracing modern luxury.",
  },
  {
    year: "2026",
    title: "Ramdan Legacy",
    description:
      "Today, we continue to redefine the Rida — not just as a garment, but as a masterpiece of devotion, precision, and timeless elegance.",
  },
]

const values = [
  {
    title: "Devotional Craft",
    description:
      "Every stitch is placed with intention, honoring the spiritual and cultural significance of the Rida in our community.",
    image: "/artisan-hands-crafting-rida-luxury.jpg",
  },
  {
    title: "Heritage Silks",
    description:
      "We source only the most exquisite silks and fabrics, continuing a century-old tradition of textile excellence.",
    image: "/premium-silk-fabric-heritage-lumariya.jpg",
  },
  {
    title: "Ancestral Techniques",
    description:
      "Our designs preserve the dying arts of hand-embroidery and intricate lace-work, passed down through generations.",
    image: "/traditional-embroidery-rida-craftsmanship.jpg",
  },
]

const craftsmen = [
  {
    name: "Mustafa Bhai",
    role: "Master Zardosi Artisan",
    years: "45 years",
    image: "/elderly-artisan-portrait-surat.jpg",
  },
  {
    name: "Fatema Ben",
    role: "Lead Lace Designer",
    years: "22 years",
    image: "/woman-artisan-designer-portrait.jpg",
  },
  {
    name: "Zainab Malu",
    role: "Creative Director",
    years: "Fifth Generation",
    image: "/creative-director-portrait-lumariya.jpg",
  },
]

export default function HeritagePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1549439602-43ebca23d7af?auto=format&fit=crop&q=80"
            alt="Heritage Textile Craft"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.4em] uppercase text-background/70 mb-6 block"
          >
            A Century of Devotion
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl text-background mb-6 leading-[1.1] text-balance"
          >
            Our Heritage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-background/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Preserving the soul of Bohra craftsmanship through five generations of textile mastery.
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-lg lg:text-xl text-muted-foreground leading-relaxed"
          >
            From the bustling textile markets of 1920s Surat to the global stage of contemporary luxury,
            Lumariya has remained steadfast in its mission. We don't just create Ridas; we weave the stories
            of our mothers, grandmothers, and daughters into every piece. Our heritage is a testament to the
            enduring beauty of tradition in a rapidly changing world.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">The Lumariya Story</span>
            <h2 className="font-serif text-3xl lg:text-5xl">A Century in Motion</h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />

            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12 mb-12 lg:mb-16 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <span className="font-serif text-3xl lg:text-4xl text-muted-foreground/50 block mb-2">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-xl lg:text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{item.description}</p>
                </div>

                <div className="hidden lg:block relative z-10">
                  <div className="w-4 h-4 bg-foreground" />
                </div>

                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">Our Philosophy</span>
            <h2 className="font-serif text-3xl lg:text-5xl">The Pillars of Lumariya</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[5/6] overflow-hidden mb-6 relative">
                  <Image
                    src={value.image || "https://images.unsplash.com/photo-1457131778466-7049459d4c79?auto=format&fit=crop&q=80"}
                    alt={value.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="py-20 lg:py-32 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-background/60 mb-4 block">The Hands of Lumariya</span>
            <h2 className="font-serif text-3xl lg:text-5xl">Gaurdians of the Craft</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {craftsmen.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="aspect-[4/5] overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-700 relative">
                  <Image
                    src={person.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80"}
                    alt={person.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl lg:text-2xl mb-1">{person.name}</h3>
                <p className="text-background/60 text-sm mb-1">{person.role}</p>
                <p className="text-xs tracking-[0.2em] uppercase text-background/40">{person.years}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 lg:py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-serif text-2xl lg:text-4xl leading-relaxed mb-8 text-balance italic">
              "A Rida is not just an attire; it is a canvas of our identity.
              Our duty is to ensure that this canvas is painted with the
              finest threads of our heritage."
            </p>
            <cite className="not-italic">
              <span className="block text-sm tracking-[0.2em] uppercase text-muted-foreground">
                — Zainab Malu, Creative Director
              </span>
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">Legacy</span>
            <h2 className="font-serif text-3xl lg:text-5xl mb-6">Explore the Collection</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience a century of tradition in every stitch.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-[0.2em] uppercase hover:gap-5 transition-all duration-300"
            >
              Shop Ridas
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
