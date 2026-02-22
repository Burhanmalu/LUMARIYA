"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Users,
    ShoppingBag,
    Package,
    TrendingUp,
    LogOut,
    Tag,
    ClipboardList,
    UserCog,
    Crown,
    Plus,
    Settings,
    Bell,
    ArrowUpRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye
} from 'lucide-react'

export default function AdminPage() {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        revenue: 0,
        pendingOrders: 0,
        lowStockItems: 0
    })

    // Mock recent orders data
    const recentOrders = [
        { id: '#ORD-001', customer: 'John Doe', total: 1299, status: 'completed', date: '2024-02-16' },
        { id: '#ORD-002', customer: 'Jane Smith', total: 849, status: 'pending', date: '2024-02-16' },
        { id: '#ORD-003', customer: 'Robert Johnson', total: 2150, status: 'processing', date: '2024-02-15' },
        { id: '#ORD-004', customer: 'Emily Davis', total: 675, status: 'completed', date: '2024-02-15' },
    ]

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/')
            } else if (user.is_admin !== 1) {
                router.push('/shop')
            }
        }
    }, [user, isLoading, router])

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-xl text-foreground/60">Loading...</div>
            </div>
        )
    }

    if (!user || user.is_admin !== 1) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <Crown className="w-6 h-6 text-foreground" />
                            <h1 className="font-serif text-2xl tracking-[0.3em] uppercase text-foreground">
                                LUMARIYA
                            </h1>
                            <span className="text-xs text-foreground/40 uppercase tracking-wider ml-2">Admin</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 hover:bg-foreground/5 transition-colors rounded-sm">
                                <Bell className="w-5 h-5 text-foreground/60" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-foreground rounded-full"></span>
                            </button>
                            <button className="p-2 hover:bg-foreground/5 transition-colors rounded-sm">
                                <Settings className="w-5 h-5 text-foreground/60" />
                            </button>
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-foreground/50 uppercase tracking-wider">Administrator</p>
                                <p className="text-sm text-foreground font-light">
                                    {user.full_name}
                                </p>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="h-10 px-6 text-sm tracking-[0.2em] uppercase"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.revenue.toLocaleString()}`}
                        icon={<TrendingUp className="w-5 h-5" />}
                        trend="+12.5%"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingBag className="w-5 h-5" />}
                        trend="+8.2%"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<Package className="w-5 h-5" />}
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<Users className="w-5 h-5" />}
                        trend="+15.3%"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={stats.pendingOrders}
                        icon={<Clock className="w-5 h-5" />}
                        alert
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={stats.lowStockItems}
                        icon={<AlertCircle className="w-5 h-5" />}
                        alert
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Quick Actions - 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs text-foreground/50 uppercase tracking-[0.2em]">
                                Quick Actions
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ActionButton
                                title="Add New Product"
                                description="Create and list a new product"
                                icon={<Plus className="w-5 h-5" />}
                                onClick={() => router.push('/admin/products/new')}
                            />
                            <ActionButton
                                title="View All Orders"
                                description="Manage and process orders"
                                icon={<ClipboardList className="w-5 h-5" />}
                                onClick={() => router.push('/admin/orders')}
                            />
                            <ActionButton
                                title="Manage Products"
                                description="Edit inventory and pricing"
                                icon={<Tag className="w-5 h-5" />}
                                onClick={() => router.push('/admin/products')}
                            />
                            <ActionButton
                                title="User Management"
                                description="View and manage customers"
                                icon={<UserCog className="w-5 h-5" />}
                                onClick={() => router.push('/admin/users')}
                            />
                        </div>
                    </div>

                    {/* Activity Feed - 1 column */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs text-foreground/50 uppercase tracking-[0.2em]">
                                Recent Activity
                            </h2>
                        </div>
                        <div className="border border-border divide-y divide-border">
                            <ActivityItem
                                type="order"
                                message="New order received"
                                time="5 minutes ago"
                            />
                            <ActivityItem
                                type="product"
                                message="Product updated"
                                time="1 hour ago"
                            />
                            <ActivityItem
                                type="user"
                                message="New user registered"
                                time="2 hours ago"
                            />
                            <ActivityItem
                                type="order"
                                message="Order shipped"
                                time="3 hours ago"
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs text-foreground/50 uppercase tracking-[0.2em]">
                            Recent Orders
                        </h2>
                        <Link
                            href="/admin/orders"
                            className="text-xs uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            View All
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="border border-border">
                        <table className="w-full">
                            <thead className="border-b border-border bg-foreground/[0.02]">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Order ID</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Customer</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Total</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Date</th>
                                    <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-foreground/[0.02] transition-colors">
                                        <td className="py-4 px-6 text-sm font-light">{order.id}</td>
                                        <td className="py-4 px-6 text-sm font-light">{order.customer}</td>
                                        <td className="py-4 px-6 text-sm font-light">${order.total.toLocaleString()}</td>
                                        <td className="py-4 px-6">
                                            <OrderStatus status={order.status} />
                                        </td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">{order.date}</td>
                                        <td className="py-4 px-6 text-right">
                                            <button className="p-2 hover:bg-foreground/5 transition-colors rounded-sm">
                                                <Eye className="w-4 h-4 text-foreground/60" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Info */}
                <div className="border-t border-border pt-12">
                    <h2 className="text-xs text-foreground/50 uppercase tracking-[0.2em] mb-8">
                        System Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoRow label="Admin Email" value={user.email} />
                        <InfoRow label="Role" value="Administrator" />
                        <InfoRow label="Account ID" value={`#${user.id}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({
    title,
    value,
    icon,
    trend,
    alert
}: {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: string
    alert?: boolean
}) {
    return (
        <div className={`border ${alert ? 'border-foreground/30' : 'border-border'} bg-background hover:border-foreground/20 transition-all duration-300 p-6`}>
            <div className="flex items-center justify-between mb-4">
                <div className="text-foreground/60">
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs text-foreground/40">{trend}</span>
                )}
            </div>
            <h3 className="text-xs text-foreground/50 uppercase tracking-wider mb-2">
                {title}
            </h3>
            <p className="text-2xl font-light text-foreground">
                {value}
            </p>
        </div>
    )
}

function ActionButton({
    title,
    description,
    icon,
    onClick
}: {
    title: string
    description: string
    icon: React.ReactNode
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="group text-left p-6 border border-border hover:border-foreground/20 transition-all duration-300 bg-background"
        >
            <div className="flex items-start gap-4">
                <div className="p-2 border border-border group-hover:border-foreground/20 transition-colors">
                    <div className="text-foreground/60 group-hover:text-foreground transition-colors">
                        {icon}
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm tracking-wider uppercase mb-1 text-foreground">{title}</h3>
                    <p className="text-xs text-foreground/60 font-light">{description}</p>
                </div>
            </div>
        </button>
    )
}

function ActivityItem({ type, message, time }: { type: string; message: string; time: string }) {
    const getIcon = () => {
        switch (type) {
            case 'order': return <ShoppingBag className="w-4 h-4" />
            case 'product': return <Package className="w-4 h-4" />
            case 'user': return <Users className="w-4 h-4" />
            default: return <Bell className="w-4 h-4" />
        }
    }

    return (
        <div className="p-4 hover:bg-foreground/[0.02] transition-colors">
            <div className="flex items-start gap-3">
                <div className="p-2 border border-border text-foreground/60">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-foreground mb-1">{message}</p>
                    <p className="text-xs text-foreground/40">{time}</p>
                </div>
            </div>
        </div>
    )
}

function OrderStatus({ status }: { status: string }) {
    const getStatusConfig = () => {
        switch (status) {
            case 'completed':
                return { icon: <CheckCircle className="w-3 h-3" />, label: 'Completed', color: 'text-foreground' }
            case 'pending':
                return { icon: <Clock className="w-3 h-3" />, label: 'Pending', color: 'text-foreground/60' }
            case 'processing':
                return { icon: <AlertCircle className="w-3 h-3" />, label: 'Processing', color: 'text-foreground/80' }
            default:
                return { icon: <XCircle className="w-3 h-3" />, label: 'Cancelled', color: 'text-foreground/40' }
        }
    }

    const config = getStatusConfig()

    return (
        <div className={`flex items-center gap-2 ${config.color}`}>
            {config.icon}
            <span className="text-xs uppercase tracking-wider">{config.label}</span>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <span className="text-xs text-foreground/50 uppercase tracking-wider block">{label}</span>
            <span className="text-sm text-foreground font-light block">{value}</span>
        </div>
    )
}
