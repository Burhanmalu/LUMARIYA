export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  hover_image: string
  description: string
  long_description: string
  materials: string[]
  care: string[]
  colors: { name: string; hex: string; available: boolean }[]
  details: string[]
  made_in: string
  created_at?: string
}

// Frontend-friendly aliases
export interface ProductDisplay {
  id: string
  name: string
  price: number
  category: string
  image: string
  hoverImage: string
  description: string
  longDescription: string
  materials: string[]
  care: string[]
  colors: { name: string; hex: string; available: boolean }[]
  details: string[]
  madeIn: string
}

/** Convert backend snake_case product to frontend camelCase */
export function mapProduct(p: any): ProductDisplay {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    image: p.image || '/placeholder.svg',
    hoverImage: p.hover_image || p.image || '/placeholder.svg',
    description: p.description || '',
    longDescription: p.long_description || '',
    materials: p.materials || [],
    care: p.care || [],
    colors: p.colors || [],
    details: p.details || [],
    madeIn: p.made_in || '',
  }
}

export const categories = [
  "All",
  "Daily Wear Rida",
  "Party Wear Rida",
  "Festival Wear Rida",
  "Wedding Rida",
  "Majlis Rida",
]
