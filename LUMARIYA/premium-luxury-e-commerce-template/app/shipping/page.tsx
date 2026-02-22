"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { Truck, RotateCcw, ShieldCheck, Globe } from "lucide-react"

export default function ShippingPage() {
    const sections = [
        {
            title: "Shipping Policy",
            icon: Truck,
            content: [
                "We offer complimentary shipping on all orders within India above ₹5,000.",
                "For international orders, shipping rates are calculated at checkout based on your delivery address and order weight.",
                "Standard delivery within India takes 5–7 business days, while international shipping typically arrives within 10–14 business days.",
                "Express shipping options are available at checkout for an additional fee.",
                "All Lumariya shipments are fully insured until handed over to the recipient."
            ]
        },
        {
            title: "Returns & Exchanges",
            icon: RotateCcw,
            content: [
                "Due to the artisanal and custom nature of our Ridas, we accept returns only for defective items or size exchanges.",
                "Return requests must be initiated within 7 days of receiving your order.",
                "Items must be in their original condition, unworn, unwashed, and with all tags attached in original packaging.",
                "Custom-made or personalized pieces are final sale and cannot be returned or exchanged unless there is a manufacturing defect.",
                "Lumariya reserves the right to refuse returns that do not meet these criteria."
            ]
        },
        {
            title: "Domestic Delivery",
            icon: ShieldCheck,
            content: [
                "Domestic orders are handled by our trusted logistics partners (BlueDart/Delhivery/DHL India).",
                "A tracking number will be shared via email and SMS once your order is dispatched.",
                "Deliveries are made between 10 AM and 7 PM from Monday to Saturday.",
                "A signature is required upon delivery for security purposes."
            ]
        },
        {
            title: "International Shipping",
            icon: Globe,
            content: [
                "We ship to 50+ countries worldwide via DHL Express or FedEx.",
                "Import duties, taxes, and customs fees are the responsibility of the recipient and are not included in the shipping cost.",
                "Customs clearances may occasionally delay deliveries beyond our estimated timelines.",
                "For international returns, shipping costs and duties are non-refundable."
            ]
        }
    ]

    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Header */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 border-b border-border bg-muted/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">Concierge Services</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8">Shipping & Returns</h1>
                        <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            Our commitment is to ensure your Lumariya purchase reaches you with the same elegance and care with which it was created.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Policies Grid */}
            <section className="py-16 md:py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="space-y-24">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-16 items-start"
                            >
                                <div className="flex md:justify-center">
                                    <div className="h-20 w-20 rounded-full border border-border flex items-center justify-center bg-background">
                                        <section.icon className="w-8 h-8 text-foreground/70" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="font-serif text-3xl mb-8">{section.title}</h2>
                                    <div className="space-y-5">
                                        {section.content.map((item, i) => (
                                            <div key={i} className="flex gap-4 group">
                                                <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 mt-2 transition-colors group-hover:bg-foreground" />
                                                <p className="text-muted-foreground leading-relaxed flex-1 italic font-light">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Banner */}
            <section className="py-24 border-t border-border">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-sm italic text-muted-foreground mb-6">Need further assistance?</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <a href="mailto:concierge@lumariya.com" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:text-foreground/60 transition-colors">
                            concierge@lumariya.com
                        </a>
                        <div className="hidden md:block w-px h-8 bg-border" />
                        <a href="tel:+919876543210" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:text-foreground/60 transition-colors">
                            +91 98765 43210
                        </a>
                    </div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
