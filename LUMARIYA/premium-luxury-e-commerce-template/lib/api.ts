const API_BASE = 'http://127.0.0.1:8000'

function getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    return headers
}

// ─── Products ────────────────────────────────────────────────────

export async function fetchProducts(category?: string): Promise<any[]> {
    const params = new URLSearchParams()
    if (category && category !== 'All') params.set('category', category)
    const res = await fetch(`${API_BASE}/api/products/?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
}

export async function fetchProduct(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/products/${id}`)
    if (!res.ok) return null
    return res.json()
}

export async function createProduct(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/products/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to create product')
    }
    return res.json()
}

export async function updateProduct(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to update product')
    }
    return res.json()
}

export async function deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete product')
}

// ─── Image Upload ────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}/api/admin/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
    })
    if (!res.ok) throw new Error('Failed to upload image')
    return res.json()
}

// ─── Admin ───────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
}

export async function fetchAllOrders(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
}

export async function fetchUserOrders(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/orders/`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch user orders')
    return res.json()
}

export async function updateOrderStatus(orderId: number, newStatus: string): Promise<any> {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}/status?new_status=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to update order status')
    return res.json()
}

export async function fetchAllUsers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
}

export async function updateUserRole(userId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to update user role')
    return res.json()
}

// ─── Addresses ───────────────────────────────────────────────────

export async function fetchUserAddresses(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/api/users/addresses`, {
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch addresses')
    return res.json()
}

export async function createAddress(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/users/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to create address')
    }
    return res.json()
}

export async function updateAddress(id: number, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/api/users/addresses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to update address')
    }
    return res.json()
}

export async function deleteAddress(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/users/addresses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete address')
}

