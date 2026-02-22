"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden border-b border-border">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">Connect with Us</p>
                        <h1 className="font-serif text-5xl md:text-7xl mb-8">Contact Lumariya</h1>
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Whether you have a question about our collections, need styling advice, or require assistance with an order, our team is here to help.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                        {/* Get in Touch */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-serif text-3xl mb-8">Get in Touch</h2>
                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs tracking-[0.2em] uppercase mb-2">Email Us</h3>
                                        <p className="text-muted-foreground">concierge@lumariya.com</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Response time: Within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs tracking-[0.2em] uppercase mb-2">Call Us</h3>
                                        <p className="text-muted-foreground">+91 98765 43210</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Available: Mon–Sat, 10am–7pm IST</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs tracking-[0.2em] uppercase mb-2">Our Atelier</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Lumariya Heritage Studio<br />
                                            Bohra Street, Surat<br />
                                            Gujarat, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-muted/30 p-8 md:p-12 border border-border"
                        >
                            <h2 className="font-serif text-3xl mb-8">Send an Inquiry</h2>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">Subject</label>
                                    <select className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors appearance-none cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Order Assistance</option>
                                        <option>Bespoke Request</option>
                                        <option>Wholesale Inquiry</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors resize-none"
                                        placeholder="How can we assist you today?"
                                    ></textarea>
                                </div>
                                <button className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-all duration-300">
                                    Send Message
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Brand Essence Section */}
            <section className="bg-foreground py-24 text-center text-background overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    {/* Subtle noise or texture background would go here */}
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-serif text-4xl md:text-5xl mb-8 italic">"Tradition in every thread, precision in every stitch."</h2>
                        <p className="text-background/60 text-sm tracking-[0.2em] uppercase tracking-widest leading-loose">
                            Experience the legacy of Bohra craftsmanship.
                        </p>
                    </motion.div>
                </div>
            </section>

            <PremiumFooter />
        </main>
    )
}
