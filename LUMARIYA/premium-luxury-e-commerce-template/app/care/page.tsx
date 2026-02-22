"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { Droplets, Wind, Waves, Sparkles } from "lucide-react"

export default function CarePage() {
    const careSteps = [
        {
            title: "Washing & Cleaning",
            icon: Waves,
            description: "Our Ridas are crafted from the finest silks and cottons. To maintain their vibrance and texture, we recommend professional dry cleaning only.",
            tips: [
                "Avoid machine washing at all costs.",
                "If a minor spill occurs, blot immediately with a clean, dry cloth.",
                "Do not rub or scrub localized stains.",
                "Inform your dry cleaner about the delicate embroidery and embellishments."
            ]
        },
        {
            title: "Drying & Steaming",
            icon: Wind,
            description: "Never expose your luxury garments to direct sunlight or high-heat tumble dryers, as this can cause fiber brittleness and color fading.",
            tips: [
                "Store in a cool, dry place away from direct sunlight.",
                "If the garment is damp, air-dry it in a shaded area.",
                "Use a handheld steamer on low heat for removing wrinkles.",
                "Avoid direct iron contact with delicate lace or silk surfaces."
            ]
        },
        {
            title: "Storage & Protection",
            icon: Droplets,
            description: "Proper storage is essential for preserving the shape and integrity of hand-embroidered Ridas.",
            tips: [
                "Store Ridas in the provided Lumariya cotton dust bags.",
                "Avoid hanging heavy embellished Ridas for long periods; fold them neatly instead.",
                "Use cedar blocks or lavender sachets to protect from moisture and pests.",
                "Ensure the storage area is well-ventilated."
            ]
        },
        {
            title: "Embroidery Care",
            icon: Sparkles,
            description: "Hand-worked Zardosi and delicate threadwork require special attention to prevent snagging or tarnishing.",
            tips: [
                "Be careful with jewelry and watches that might snag delicate threads.",
                "If a thread comes loose, do not pull it; seek professional repair.",
                "Avoid spraying perfumes directly onto the embroidered areas.",
                "Periodically check for any loose beads or sequins."
            ]
        }
    ]

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-muted/10 -z-10" />
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Garment Longevity</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Care Instructions</h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed italic">
                            A Lumariya piece is an heirloom in the making. With proper care, its beauty will endure for generations.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Care Guide Content */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 md:gap-y-32">
                        {careSteps.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: idx * 0.1 }}
                                className="group"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="h-16 w-16 border border-border flex items-center justify-center transition-all duration-500 group-hover:border-foreground/40 group-hover:bg-foreground group-hover:text-background">
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-serif text-3xl md:text-4xl">{step.title}</h2>
                                </div>

                                <p className="text-muted-foreground/80 leading-relaxed mb-10 text-lg font-light">
                                    {step.description}
                                </p>

                                <div className="space-y-4">
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">Essential Tips</p>
                                    {step.tips.map((tip, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <span className="text-xs text-foreground/30 mt-0.5">•</span>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Note */}
            <section className="py-24 border-t border-border bg-foreground text-background">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-serif text-3xl md:text-4xl mb-6 italic italic">"Crafted with love, preserved with care."</h2>
                        <p className="text-background/50 text-xs tracking-[0.2em] uppercase max-w-xl mx-auto leading-loose">
                            If you have any specific questions regarding your garment's care, please reach out to our concierge team.
                        </p>
                    </motion.div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
