import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props { params: { id: string } }

export default async function AccountOrderDetailPage({ params }: Props) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: order } = await supabase.from('orders').select('*').eq('id', params.id).eq('user_id', user.id).single()
  if (!order) notFound()
  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', params.id)

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-500', processing: 'bg-blue-500/20 text-blue-500',
    paid: 'bg-blue-500/20 text-blue-500', shipped: 'bg-purple-500/20 text-purple-500',
    delivered: 'bg-green/20 text-green', cancelled: 'bg-red-500/20 text-red-500',
  }

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8 max-w-3xl">
        <Link href="/account/orders" className="text-sm text-muted hover:text-foreground mb-6 inline-block">← Back to Orders</Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <span className={`badge ${statusColor[order.order_status] || 'bg-border text-muted'}`}>{order.order_status}</span>
        </div>
        <div className="flex gap-2 mb-8">
          {['pending', 'processing', 'paid', 'shipped', 'delivered'].map((s, i) => {
            const idx = ['pending', 'processing', 'paid', 'shipped', 'delivered'].indexOf(order.order_status)
            const active = i <= idx && order.order_status !== 'cancelled'
            return <div key={s} className={`flex-1 h-1.5 rounded-full ${active ? 'bg-accent' : 'bg-border'}`} />
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {order.shipping_address && (
            <div className="card p-4">
              <h3 className="text-xs font-semibold text-muted uppercase mb-3">Shipping</h3>
              <div className="text-sm space-y-1">
                <p>{(order.shipping_address as any).name}</p>
                <p className="text-muted">{(order.shipping_address as any).address}, {(order.shipping_address as any).city}</p>
              </div>
              {order.phone && <p className="text-sm text-muted mt-2">📞 {order.phone}</p>}
            </div>
          )}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-muted uppercase mb-3">Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>KSh {order.subtotal.toLocaleString('en-KE')}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping_cost === 0 ? 'Free' : 'KSh ' + order.shipping_cost.toLocaleString('en-KE')}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-border"><span>Total</span><span className="text-accent">KSh {order.total.toLocaleString('en-KE')}</span></div>
            </div>
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
