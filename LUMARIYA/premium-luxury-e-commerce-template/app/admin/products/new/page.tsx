"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createProduct, uploadImage } from '@/lib/api'
import { categories } from '@/lib/products'
import {
    Crown, ArrowLeft, Upload, ImageIcon, X, Loader2
} from 'lucide-react'
import { useEffect } from 'react'

export default function NewProductPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        id: '',
        name: '',
        price: '',
        category: 'Daily Wear Rida',
        description: '',
        image: '',
        hover_image: '',
        materials: '',
        colors: '',
        made_in: '',
    })

    useEffect(() => {
        if (!isLoading) {
            if (!user) router.push('/')
            else if (user.is_admin !== 1) router.push('/shop')
        }
    }, [user, isLoading, router])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'hover_image') => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const result = await uploadImage(file)
            setForm(prev => ({ ...prev, [field]: result.url }))
        } catch (err) {
            setError('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const generateId = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const productId = form.id || generateId(form.name)
            const productData = {
                id: productId,
                name: form.name,
                price: parseFloat(form.price),
                category: form.category,
                description: form.description,
                image: form.image,
                hover_image: form.hover_image || form.image,
                materials: form.materials ? form.materials.split(',').map(s => s.trim()) : [],
                colors: form.colors ? form.colors.split(',').map(c => {
                    const trimmed = c.trim()
                    return { name: trimmed, hex: '#000000', available: true }
                }) : [],
                made_in: form.made_in,
            }

            await createProduct(productData)
            router.push('/admin/products')
        } catch (err: any) {
            setError(err.message || 'Failed to create product')
        } finally {
            setSaving(false)
        }
    }

    if (isLoading || !user || user.is_admin !== 1) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-xl text-foreground/60">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/products" className="p-2 hover:bg-foreground/5 transition-colors rounded-sm">
                                <ArrowLeft className="w-5 h-5 text-foreground/60" />
                            </Link>
                            <Crown className="w-6 h-6 text-foreground" />
                            <h1 className="font-serif text-2xl tracking-[0.3em] uppercase text-foreground">
                                New Product
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
                {error && (
                    <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value, id: generateId(e.target.value) })}
                            className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                            placeholder="e.g. Silk Evening Coat"
                        />
                    </div>

                    {/* ID (auto-generated) */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Product ID</label>
                        <input
                            type="text"
                            value={form.id}
                            onChange={(e) => setForm({ ...form, id: e.target.value })}
                            className="w-full px-4 py-3 border border-border bg-foreground/[0.02] text-sm text-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors"
                            placeholder="Auto-generated from name"
                        />
                    </div>

                    {/* Price & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-foreground/50 block">Price (₹) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                                placeholder="e.g. 2450"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-foreground/50 block">Category *</label>
                            <select
                                required
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                            >
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors resize-none"
                            placeholder="Describe the product..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-foreground/50 block">Main Image</label>
                            {form.image ? (
                                <div className="relative aspect-[3/4] border border-border overflow-hidden group">
                                    <img src={form.image} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, image: '' })}
                                        className="absolute top-2 right-2 p-1 bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-[3/4] border border-dashed border-border cursor-pointer hover:border-foreground/40 transition-colors">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-foreground/30 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-foreground/30 mb-2" />
                                            <span className="text-xs text-foreground/40 uppercase tracking-wider">Upload Image</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} />
                                </label>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-foreground/50 block">Hover Image</label>
                            {form.hover_image ? (
                                <div className="relative aspect-[3/4] border border-border overflow-hidden group">
                                    <img src={form.hover_image} alt="Product hover" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, hover_image: '' })}
                                        className="absolute top-2 right-2 p-1 bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-[3/4] border border-dashed border-border cursor-pointer hover:border-foreground/40 transition-colors">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-foreground/30 animate-spin" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 text-foreground/30 mb-2" />
                                            <span className="text-xs text-foreground/40 uppercase tracking-wider">Upload Hover Image</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'hover_image')} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Materials */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Materials (comma-separated)</label>
                        <input
                            type="text"
                            value={form.materials}
                            onChange={(e) => setForm({ ...form, materials: e.target.value })}
                            className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                            placeholder="e.g. 100% Silk, Pearl buttons"
                        />
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Colors (comma-separated)</label>
                        <input
                            type="text"
                            value={form.colors}
                            onChange={(e) => setForm({ ...form, colors: e.target.value })}
                            className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                            placeholder="e.g. Noir, Ivory, Midnight"
                        />
                    </div>

                    {/* Made In */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-foreground/50 block">Made In</label>
                        <input
                            type="text"
                            value={form.made_in}
                            onChange={(e) => setForm({ ...form, made_in: e.target.value })}
                            className="w-full px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground/40 transition-colors"
                            placeholder="e.g. Florence, Italy"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || !form.name || !form.price}
                            className="h-12 px-12 text-sm tracking-[0.2em] uppercase"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </Button>
                        <Link
                            href="/admin/products"
                            className="text-sm text-foreground/60 hover:text-foreground tracking-wider uppercase transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
