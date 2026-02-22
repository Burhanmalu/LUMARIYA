"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import Image from "next/image"
import { Scissors, Fingerprint, Sparkles, Heart } from "lucide-react"

export default function CraftsmanshipPage() {
    const crafts = [
        {
            title: "Hand-Guided Embroidery",
            description: "Our artisans use age-old Resham and Zardosi techniques to create intricate patterns that can take up to 40 hours of manual labor for a single piece.",
            icon: Scissors
        },
        {
            title: "Signature Lace-work",
            description: "Each Lumariya Rida features hand-selected or custom-designed laces that are meticulously appliquéd to ensure a seamless and luxurious finish.",
            icon: Sparkles
        },
        {
            title: "Premium Fabric Selection",
            description: "We source only the highest grade of mulberry silks and organic cottons, ensuring that every Rida feels as exquisite as it looks.",
            icon: Heart
        },
        {
            title: "Bespoke Detailing",
            description: "From hand-sewn buttons to reinforced seams, every detail is considered to ensure that your Rida remains a cherished heirloom.",
            icon: Fingerprint
        }
    ]

    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-border bg-foreground text-background overflow-hidden">
                <div className="absolute inset-0 opacity-20 transition-opacity duration-1000">
                    <Image
                        src="https://images.unsplash.com/photo-1549439602-43ebca23d7af?auto=format&fit=crop&q=80"
                        alt="Craftsmanship Texture"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[10px] tracking-[0.4em] uppercase text-background/60 mb-4">The Art of lumariya</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Craftsmanship</h1>
                        <p className="text-base text-background/70 max-w-2xl mx-auto leading-relaxed">
                            In an age of mass production, we remain committed to the slow, intentional art of the hand.
                            Each Lumariya Rida is a testament to the skill of artisans who keep our heritage alive.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Craft Details Section */}
            <section className="py-20 lg:py-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-serif text-4xl mb-8">The Meticulous Process</h2>
                            <div className="space-y-12">
                                {crafts.map((craft, idx) => (
                                    <div key={idx} className="flex gap-6 items-start group">
                                        <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                                            <craft.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm tracking-[0.2em] uppercase mb-3 text-foreground">{craft.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed text-sm italic font-light">
                                                {craft.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80"
                                alt="Artisan at work"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 border-[20px] border-background/10 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Width Image Section */}
            <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1457131778466-7049459d4c79?auto=format&fit=crop&q=80"
                    alt="Fabric Detail"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                    <div className="text-center px-6 max-w-3xl">
                        <motion.h2
                            className="font-serif text-3xl md:text-5xl text-background italic"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            "True luxury is found in the patience of the hand and the precision of the heart."
                        </motion.h2>
                    </div>
                </div>
            </section>

            {/* Sustainable Craft Section */}
            <section className="py-24 md:py-32 bg-muted/30">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-3xl md:text-4xl mb-8">Honoring the Maker</h2>
                        <p className="text-muted-foreground leading-relaxed mb-12">
                            Beyond the aesthetics, our craftsmanship is rooted in ethical partnerships.
                            We work with artisanal clusters across Gujarat, providing fair wages and
                            safe working environments, ensuring that the legacy of these crafts persists
                            for future generations.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:gap-4 transition-all duration-300"
                        >
                            Explore the Results
                            < scissors className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
