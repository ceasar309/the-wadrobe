'use client'

import { useCart } from '@/components/cart/CartProvider'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-muted mb-4 opacity-30" />
            <p className="text-muted mb-4">Your cart is empty</p>
            <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item: any) => (
                <div key={item.id} className="card p-4 flex gap-4">
                  <div className="w-20 h-20 bg-card rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl opacity-20">👕</span>
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`} className="text-sm font-semibold hover:text-accent">{item.name}</Link>
                    <p className="text-xs text-muted">{[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}</p>
                    <p className="text-sm font-bold text-accent mt-1">KSh {item.price.toLocaleString('en-KE')}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-muted"><Minus size={14} /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-border rounded flex items-center justify-center hover:border-muted"><Plus size={14} /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto p-2 text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">KSh {(item.price * item.quantity).toLocaleString('en-KE')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-6 h-fit">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span>KSh {totalPrice.toLocaleString('en-KE')}</span></div>
                <div className="flex justify-between text-muted"><span>Shipping</span><span>{totalPrice >= 5000 ? 'Free' : 'Calculated at checkout'}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total</span><span className="text-accent">KSh {totalPrice.toLocaleString('en-KE')}</span></div>
              </div>
              <Link href="/checkout" className="btn btn-primary w-full mt-6">Proceed to Checkout</Link>
              <Link href="/shop" className="btn btn-ghost w-full mt-2 text-sm">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
