"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    useEffect(() => {
        const token = searchParams.get('token')

        if (token) {
            // Login with the token from OAuth
            login(token).then(() => {
                // Redirect to home or intended page
                const returnTo = sessionStorage.getItem('returnTo') || '/'
                sessionStorage.removeItem('returnTo')
                router.push(returnTo)
            })
        } else {
            // No token, redirect to home
            router.push('/')
        }
    }, [searchParams, login, router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-neutral-600">Completing sign in...</p>
            </div>
        </div>
    )
}
