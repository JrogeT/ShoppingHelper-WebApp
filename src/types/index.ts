export interface Supermarket {
  id: string
  name: string
  aliases: string[]
  created_at: string
}

export interface Product {
  id: string
  name: string
  brand: string
  size: string
  supermarket: string
  price: number
  currency: string
  notes: string
  image_url: string | null
  product_id: string | null
  created_at: string
}

export interface ProductFormData {
  name: string
  brand: string
  size: string
  supermarket: string
  price: number | string
  currency: string
  notes: string
  image_url: string
}

export interface MarketFormData {
  name: string
}
