"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fetchProducts, deleteProduct } from '@/lib/api'
import {
    Crown, ArrowLeft, Plus, Pencil, Trash2, Package
} from 'lucide-react'

export default function AdminProductsPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoading) {
            if (!user) router.push('/')
            else if (user.is_admin !== 1) router.push('/shop')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const data = await fetchProducts()
            setProducts(data)
        } catch (err) {
            console.error('Failed to load products:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        setDeleting(id)
        try {
            await deleteProduct(id)
            setProducts(products.filter(p => p.id !== id))
        } catch (err) {
            alert('Failed to delete product')
        } finally {
            setDeleting(null)
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
                            <Link href="/admin" className="p-2 hover:bg-foreground/5 transition-colors rounded-sm">
                                <ArrowLeft className="w-5 h-5 text-foreground/60" />
                            </Link>
                            <Crown className="w-6 h-6 text-foreground" />
                            <h1 className="font-serif text-2xl tracking-[0.3em] uppercase text-foreground">
                                Products
                            </h1>
                        </div>
                        <Button
                            onClick={() => router.push('/admin/products/new')}
                            className="h-10 px-6 text-sm tracking-[0.2em] uppercase"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="border border-border p-6 animate-pulse">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted w-48" />
                                        <div className="h-3 bg-muted w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 border border-border">
                        <Package className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                        <p className="text-xl font-serif text-foreground/60 mb-4">No products yet</p>
                        <p className="text-sm text-foreground/40 mb-8">Add your first product to get started</p>
                        <Button onClick={() => router.push('/admin/products/new')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                        </Button>
                    </div>
                ) : (
                    <div className="border border-border">
                        <table className="w-full">
                            <thead className="border-b border-border bg-foreground/[0.02]">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Product</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Category</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Price</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">ID</th>
                                    <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-foreground/[0.02] transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover bg-muted"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-muted flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-foreground/30" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-light">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">{product.category}</td>
                                        <td className="py-4 px-6 text-sm font-light">₹{product.price?.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-xs text-foreground/40 font-mono">{product.id}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                    className="p-2 hover:bg-foreground/5 transition-colors rounded-sm"
                                                    title="Edit product"
                                                >
                                                    <Pencil className="w-4 h-4 text-foreground/60" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deleting === product.id}
                                                    className="p-2 hover:bg-red-50 transition-colors rounded-sm disabled:opacity-50"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
