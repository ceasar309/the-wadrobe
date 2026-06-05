import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { OrderDetailActions } from '@/components/admin/OrderDetailActions'
import { notFound } from 'next/navigation'

interface Props { params: { id: string } }

export default async function AdminOrderDetailPage({ params }: Props) {
  const supabase = createServerComponentClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', params.id).single()
  if (!order) notFound()
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', params.id)
  const addr = order.shipping_address as any || {}

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8 max-w-3xl">
        <a href="/admin/orders" className="text-sm text-muted hover:text-foreground mb-6 inline-block">← Back to Orders</a>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <OrderDetailActions order={order} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Shipping Info</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{addr.name}</p>
              <p className="text-muted">{addr.address}</p>
              <p className="text-muted">{addr.city}, {addr.state} {addr.zip}</p>
            </div>
            {order.phone && <p className="text-sm text-muted mt-2">📞 {order.phone}</p>}
            {order.email && <p className="text-sm text-muted">✉️ {order.email}</p>}
          </div>
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>KSh {order.subtotal.toLocaleString('en-KE')}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping_cost === 0 ? 'Free' : 'KSh ' + order.shipping_cost.toLocaleString('en-KE')}</span></div>
              <div className="flex justify-between"><span className="text-muted">Tax</span><span>KSh {order.tax.toLocaleString('en-KE')}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="text-green">-KSh {order.discount.toLocaleString('en-KE')}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total</span><span className="text-accent">KSh {order.total.toLocaleString('en-KE')}</span></div>
            </div>
            {order.payment_id && <p className="text-xs text-muted mt-2">Payment ID: {order.payment_id}</p>}
          </div>
        </div>
        <div className="card divide-y divide-border">
          <div className="p-4 border-b border-border"><h3 className="text-xs font-semibold text-muted uppercase">Items ({items?.length || 0})</h3></div>
          {items?.map(item => (
            <div key={item.id} className="p-4 flex justify-between">
              <div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted">{[item.color, item.size].filter(Boolean).join(' / ') || 'Standard'} × {item.quantity}</p></div>
              <span className="text-sm font-semibold">KSh {(item.price * item.quantity).toLocaleString('en-KE')}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
