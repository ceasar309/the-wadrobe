'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size: string | null
  color: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCart: () => void
  closeCart: () => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.productId === action.payload.productId && i.size === action.payload.size && i.color === action.payload.color
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i: any) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i: any) => i.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i: any) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem('thewadrobe_cart')
    if (stored) {
      try {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(stored) })
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('thewadrobe_cart', JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((sum: any, i: any) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum: any, i: any) => sum + i.price * i.quantity, 0)

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.size || 'default'}-${item.color || 'default'}-${Date.now()}`
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id } })
    toast.success('Added to cart')
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Removed from cart')
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
