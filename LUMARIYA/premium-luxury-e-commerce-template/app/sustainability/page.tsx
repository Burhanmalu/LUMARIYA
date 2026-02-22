"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import Image from "next/image"
import { Leaf, Recycle, HeartHandshake, ShieldCheck } from "lucide-react"

export default function SustainabilityPage() {
    const pillars = [
        {
            title: "Slow Fashion Commitment",
            description: "We don't follow seasons; we follow the rhythm of the hand. By producing in small batches and avoiding mass production, we minimize waste and ensure every piece is intentional.",
            icon: Leaf
        },
        {
            title: "Ethical Sourcing",
            description: "Our silks and cottons are sourced from fair-trade textile mills that prioritize environmental responsibility and provide transparent supply chains.",
            icon: ShieldCheck
        },
        {
            title: "Artisan Welfare",
            description: "We provide fair livable wages and safe, respectful working conditions for our artisans, ensuring that their craft remains a viable and prestigious livelihood.",
            icon: HeartHandshake
        },
        {
            title: "Minimal Waste Atelier",
            description: "Excess fabric scraps are repurposed into matching accessories or donated to local craft schools, aiming for a near-zero waste production cycle.",
            icon: Recycle
        }
    ]

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-border bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Values of lumariya</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Sustainability</h1>
                        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed italic font-light">
                            "True luxury is not just defined by beauty, but by the legacy it leaves on the world and its people."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 lg:py-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80"
                                alt="Natural fabric dyeing"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-serif text-4xl mb-8">Conscious Creation</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8 text-lg font-light">
                                At Lumariya, sustainability is not a trend — it's our heritage. For generations,
                                the Bohra community has valued durability and care. We continue this philosophy
                                by creating Ridas that are built to last a lifetime, discouraging the cycle of
                                disposable fashion.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                {pillars.map((pillar, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <pillar.icon className="w-6 h-6 text-foreground/40" />
                                        <h3 className="text-xs tracking-[0.2em] uppercase text-foreground">{pillar.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed text-xs">
                                            {pillar.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quote Banner */}
            <section className="bg-foreground py-24 text-center text-background">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-serif text-3xl md:text-5xl mb-8 italic">"We believe in preserving the past to protect the future."</h2>
                        <div className="h-px w-20 bg-background/20 mx-auto" />
                    </motion.div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
