import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString('en-KE')}`
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateOrderNumber(): string {
  const prefix = 'TWR'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export function getStockStatus(quantity: number): { label: string; color: string } {
  if (quantity === 0) return { label: 'Out of Stock', color: 'text-red-500' }
  if (quantity <= 5) return { label: `Only ${quantity} left`, color: 'text-amber-500' }
  if (quantity <= 20) return { label: 'Low Stock', color: 'text-yellow-500' }
  return { label: 'In Stock', color: 'text-green-500' }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}
