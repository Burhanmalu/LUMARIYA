"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchAllUsers, updateUserRole } from '@/lib/api'
import {
    Crown, ArrowLeft, Users, Shield, ShieldOff, Loader2
} from 'lucide-react'

export default function AdminUsersPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState<number | null>(null)

    useEffect(() => {
        if (!isLoading) {
            if (!user) router.push('/')
            else if (user.is_admin !== 1) router.push('/shop')
        }
    }, [user, isLoading, router])

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const data = await fetchAllUsers()
            setUsers(data)
        } catch (err) {
            console.error('Failed to load users:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleRole = async (userId: number) => {
        if (!confirm('Are you sure you want to change this user\'s role?')) return
        setToggling(userId)
        try {
            const result = await updateUserRole(userId)
            setUsers(users.map(u =>
                u.id === userId ? { ...u, is_admin: result.is_admin } : u
            ))
        } catch (err) {
            alert('Failed to update user role')
        } finally {
            setToggling(null)
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
                                Users
                            </h1>
                        </div>
                        <div className="text-sm text-foreground/40">
                            {users.length} user{users.length !== 1 ? 's' : ''} total
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
                ) : users.length === 0 ? (
                    <div className="text-center py-24 border border-border">
                        <Users className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
                        <p className="text-xl font-serif text-foreground/60">No users found</p>
                    </div>
                ) : (
                    <div className="border border-border">
                        <table className="w-full">
                            <thead className="border-b border-border bg-foreground/[0.02]">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">ID</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Name</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Email</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Provider</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Role</th>
                                    <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Joined</th>
                                    <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-foreground/50 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-foreground/[0.02] transition-colors">
                                        <td className="py-4 px-6 text-sm font-light text-foreground/60">#{u.id}</td>
                                        <td className="py-4 px-6 text-sm font-light">{u.full_name}</td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">{u.email}</td>
                                        <td className="py-4 px-6 text-xs uppercase tracking-wider text-foreground/40">
                                            {u.oauth_provider || 'Email'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider ${u.is_admin === 1 ? 'text-foreground' : 'text-foreground/50'
                                                }`}>
                                                {u.is_admin === 1 ? (
                                                    <>
                                                        <Shield className="w-3 h-3" />
                                                        Admin
                                                    </>
                                                ) : (
                                                    'Customer'
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-foreground/60 font-light">
                                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {u.id !== user?.id ? (
                                                <button
                                                    onClick={() => handleToggleRole(u.id)}
                                                    disabled={toggling === u.id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs uppercase tracking-wider hover:border-foreground/30 transition-colors disabled:opacity-50"
                                                >
                                                    {toggling === u.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : u.is_admin === 1 ? (
                                                        <>
                                                            <ShieldOff className="w-3 h-3" />
                                                            Remove Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield className="w-3 h-3" />
                                                            Make Admin
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-foreground/30 uppercase tracking-wider">You</span>
                                            )}
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
