"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAllOrders, updateOrderStatus } from '@/lib/api'
import {
    Crown, ArrowLeft, ClipboardList,
    CheckCircle, Clock, AlertCircle, XCircle, Truck
} from 'lucide-react'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

function getStatusIcon(status: string) {
    switch (status) {
        case 'completed':
        case 'delivered': return <CheckCircle className="w-3 h-3" />
        case 'pending': return <Clock className="w-3 h-3" />
        case 'processing': return <AlertCircle className="w-3 h-3" />
        case 'shipped': return <Truck className="w-3 h-3" />
        default: return <XCircle className="w-3 h-3" />
    }
}

function getStatusColor(status: string) {
    switch (status) {
        case 'completed':
        case 'delivered': return 'text-green-600'
        case 'pending': return 'text-amber-600'
        case 'processing': return 'text-blue-600'
        case 'shipped': return 'text-purple-600'
        case 'cancelled': return 'text-red-500'
        default: return 'text-foreground/40'
    }
}

export default function AdminOrdersPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [updating, setUpdating] = useState<number | null>(null)

    useEffect(() => {
        if (!isLoading) {
            if (!user) router.push('/')
            else if (user.is_admin !== 1) router.push('/shop')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const data = await fetchAllOrders()
            setOrders(data)
        } catch (err) {
            console.error('Failed to load orders:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdating(orderId)
        try {
            await updateOrderStatus(orderId, newStatus)
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (err) {
            alert('Failed to update order status')
        } finally {
            setUpdating(null)
        }
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter)

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
                                Orders
                            </h1>
                        </div>
                        {/* Filter buttons */}
                        <div className="flex items-center gap-2">
                            {['all', ...STATUS_OPTIONS].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${filter === s
                                            ? 'border-foreground bg-foreground text-background'
                                            : 'border-border hover:border-foreground/30'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="border border-border p-6 animate-pulse">
                                <div className="h-4 bg-muted w-48 mb-2" />
                                <div className="h-3 bg-muted w-32" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-24 border border-border">
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                        <p className="text-xl font-serif text-foreground/60 mb-2">No orders found</p>
                        <p className="text-sm text-foreground/40">
                            {filter !== 'all' ? `No ${filter} orders at the moment` : 'Orders will appear here once customers start purchasing'}
                        </p>
                    </div>
                ) : (
                    <div className="border border-border">
                        <table className="w-full">
                            <thead className="border-b border-border bg-foreground/[0.02]">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Order ID</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Customer</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Items</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Total</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Date</th>
                                    <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-foreground/[0.02] transition-colors">
                                        <td className="py-4 px-6 text-sm font-light">#{order.id}</td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm font-light">{order.customer_name}</p>
                                                <p className="text-xs text-foreground/40">{order.customer_email}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">
                                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-light">₹{order.total?.toLocaleString()}</td>
                                        <td className="py-4 px-6">
                                            <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="text-xs uppercase tracking-wider">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                                className="px-3 py-1.5 border border-border text-xs bg-background focus:outline-none focus:border-foreground/40 disabled:opacity-50"
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
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
