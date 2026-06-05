'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ShippingInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<'review' | 'shipping' | 'payment'>('review')
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'Kenya'
  })
  const [loading, setLoading] = useState(false)

  const shippingCost = totalPrice >= 5000 ? 0 : 350
  const tax = Math.round(totalPrice * 0.016)
  const grandTotal = totalPrice + shippingCost + tax

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const orderData = {
        user_id: user?.id || null,
        total: grandTotal,
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        tax,
        discount: 0,
        shipping_address: shipping as any,
        phone: shipping.phone,
        email: shipping.email,
        payment_method: 'mpesa',
        order_status: 'pending',
        payment_status: 'pending',
      }
      const { data: order, error: orderError } = await supabase.from('orders').insert(orderData as any).select().single()

      if (orderError) throw orderError

      const orderItems = items.map((item: any) => ({
        order_id: (order as any).id,
        product_id: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems as any)
      if (itemsError) throw itemsError

      // M-Pesa STK Push
      const res = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: shipping.phone,
          amount: grandTotal,
          orderId: (order as any).id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')

      toast.success('M-Pesa STK Push sent! Check your phone to complete payment.')
      router.push(`/account/orders/${(order as any).id}`)

      clearCart()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        {/* Steps indicator */}
        <div className="flex gap-2 mb-8">
          {['review', 'shipping', 'payment'].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${step === s ? 'bg-accent' : 'bg-border'}`} />
          ))}
        </div>

        {/* Cart Review */}
        <div className="space-y-3 mb-8">
          <h2 className="font-semibold">Order Summary</h2>
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm p-3 bg-card rounded-lg">
              <div>
                <p className="font-medium">{item.name} x{item.quantity}</p>
                <p className="text-muted text-xs">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
              </div>
              <span className="font-semibold">KSh {(item.price * item.quantity).toLocaleString('en-KE')}</span>
            </div>
          ))}

          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span>KSh {totalPrice.toLocaleString('en-KE')}</span></div>
            <div className="flex justify-between text-muted"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `KSh ${shippingCost.toLocaleString('en-KE')}`}</span></div>
            <div className="flex justify-between text-muted"><span>Tax (1.6%)</span><span>KSh {tax.toLocaleString('en-KE')}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total</span><span className="text-accent">KSh {grandTotal.toLocaleString('en-KE')}</span></div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="space-y-4 mb-8">
          <h2 className="font-semibold">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Full Name</label>
              <input type="text" value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={shipping.email} onChange={e => setShipping(s => ({ ...s, email: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} className="input" placeholder="+254 7XX XXX XXX" required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Address</label>
              <input type="text" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">City</label>
              <input type="text" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">County / State</label>
              <input type="text" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Postal Code</label>
              <input type="text" value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Country</label>
              <input type="text" value={shipping.country} onChange={e => setShipping(s => ({ ...s, country: e.target.value }))} className="input" required />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4 mb-8">
          <h2 className="font-semibold">Payment Method</h2>
          <div className="p-4 rounded-xl border border-accent bg-accent/5 text-center">
            <span className="text-2xl">📱</span>
            <p className="text-sm font-semibold mt-1">M-Pesa</p>
            <p className="text-xs text-muted mt-1">STK Push will be sent to your phone</p>
            <p className="text-xs text-muted">Or send to Till No: <strong className="text-accent">{process.env.NEXT_PUBLIC_MPESA_TILL_NUMBER || '0712500093'}</strong></p>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full text-base py-4">
          {loading ? 'Processing...' : `Pay KSh ${grandTotal.toLocaleString('en-KE')}`}
        </button>

        <div className="mt-4 text-center">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=${encodeURIComponent('Hello, I want to place an order')}`}
            target="_blank"
            className="btn btn-whatsapp w-full"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order via WhatsApp Instead
          </a>
        </div>
      </form>
    </div>
  )
}
