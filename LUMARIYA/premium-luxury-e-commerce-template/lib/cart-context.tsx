"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("lumariya-cart")
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart from localStorage", e)
            }
        }
    }, [])

    // Save cart to localStorage on changes
    useEffect(() => {
        localStorage.setItem("lumariya-cart", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (newItem: CartItem) => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === newItem.id
            )

            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems]
                updatedItems[existingItemIndex].quantity += newItem.quantity
                return updatedItems
            }

            return [...prevItems, newItem]
        })
    }

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
        )
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
