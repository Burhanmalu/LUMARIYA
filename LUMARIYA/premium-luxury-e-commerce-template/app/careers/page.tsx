"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import Image from "next/image"
import { Sparkles, Users, Coffee, Globe } from "lucide-react"

export default function CareersPage() {
    const values = [
        {
            title: "Artistic Freedom",
            description: "We encourage our designers and artisans to push boundaries while honoring traditional roots, providing a canvas for true creativity.",
            icon: Sparkles
        },
        {
            title: "Collaborative Spirit",
            description: "At Lumariya, we are a family. Our studio is a space of mutual respect, where the wisdom of master artisans meets the vision of young designers.",
            icon: Users
        },
        {
            title: "Cultural Purpose",
            description: "Join a mission that goes beyond fashion. Work toward preserving the identity and heritage of the Dawoodi Bohra community.",
            icon: Globe
        },
        {
            title: "Inclusive Environment",
            description: "We believe that diverse perspectives fuel excellence. Our atelier is an inclusive space that celebrates talent from all walks of life.",
            icon: Coffee
        }
    ]

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navigation />

            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden border-b border-border bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Join the Legacy</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Careers at Lumariya</h1>
                        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light italic">
                            "We are always looking for visionary souls, meticulous hands, and passionate hearts to help us write the next chapter of our story."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-serif text-4xl mb-8">Why Lumariya?</h2>
                            <p className="text-muted-foreground leading-relaxed mb-12 text-lg font-light">
                                Joining Lumariya means becoming a guardian of craft. We provide more than just a job;
                                we offer a journey into the soul of textile artistry. Whether you are a master
                                embroiderer or a digital strategist, your work will contribute to a century-old
                                legacy of excellence.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                                {values.map((value, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <value.icon className="w-5 h-5 text-foreground/50" />
                                        <h3 className="text-xs tracking-[0.2em] uppercase text-foreground">{value.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed text-xs">
                                            {value.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <div className="relative aspect-[4/5] overflow-hidden shadow-2xl rounded-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80"
                                alt="Our Team"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-foreground/10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Inquiry Section */}
            <section className="py-24 md:py-40 bg-foreground text-background text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-5xl mb-8">Shape the Future with Us</h2>
                        <p className="text-background/60 leading-relaxed mb-12 italic">
                            While we may not always have active listings, we are perpetually open to exceptional talent.
                            If you feel your craft aligns with Lumariya, we would be honored to hear from you.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <div className="text-center">
                                <p className="text-[10px] tracking-[0.2em] uppercase text-background/40 mb-2">Artisans & Designers</p>
                                <a href="mailto:careers@lumariya.com" className="text-xs tracking-[0.2em] uppercase border-b border-background/40 pb-1 hover:text-background/70 transition-colors">
                                    careers@lumariya.com
                                </a>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] tracking-[0.2em] uppercase text-background/40 mb-2">Global Operations</p>
                                <a href="mailto:talent@lumariya.com" className="text-xs tracking-[0.2em] uppercase border-b border-background/40 pb-1 hover:text-background/70 transition-colors">
                                    talent@lumariya.com
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
