'use client'

import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from './CartProvider'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart()

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return ''
    let message = '👋 *New Order - The Wadrobe*\n\n*Items:*\n'
    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name}`
      if (item.color || item.size) message += ` (${[item.color, item.size].filter(Boolean).join(', ')})`
      message += ` x${item.quantity} — KSh ${(item.price * item.quantity).toLocaleString('en-KE')}\n`
    })
    message += `\n*Total: KSh ${totalPrice.toLocaleString('en-KE')}*\n\n---\n📍 Location: _[Share location]_\n📞 Phone: _[Your number]_`
    return encodeURIComponent(message)
  }

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=${generateWhatsAppMessage()}`

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-50" onClick={closeCart} />}
      <div className={cn(
        'fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 flex flex-col',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Your Cart ({items.length})</h3>
          <button onClick={closeCart} className="p-1 text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-20">🛒</div>
              <p className="text-sm text-muted">Your cart is empty</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-primary btn-sm mt-4 inline-flex">Shop Now</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3 p-3 bg-background rounded-lg">
                  <div className="w-16 h-16 bg-card rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl opacity-20">👕</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted">{[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'}</p>
                    <p className="text-sm font-semibold text-accent mt-1">KSh {item.price.toLocaleString('en-KE')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-border rounded hover:border-muted text-xs"><Minus size={12} /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center border border-border rounded hover:border-muted text-xs"><Plus size={12} /></button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-accent">KSh {totalPrice.toLocaleString('en-KE')}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full">Proceed to Checkout</Link>
            <a href={whatsappUrl} target="_blank" className="btn btn-whatsapp w-full flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  )
}
