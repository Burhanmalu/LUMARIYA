"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    id: number
    email: string
    full_name: string
    is_admin: number
    oauth_provider?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
            fetchUser(storedToken)
        } else {
            setIsLoading(false)
        }
    }, [])

    // Fetch user data with token
    const fetchUser = async (authToken: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
                setToken(authToken)
                localStorage.setItem('auth_token', authToken)
            } else {
                // Token invalid, clear it
                localStorage.removeItem('auth_token')
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            localStorage.removeItem('auth_token')
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (newToken: string) => {
        await fetchUser(newToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth_token')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
