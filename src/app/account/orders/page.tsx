import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'

export default async function AccountOrdersPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser() as any
  if (!user) redirect('/login?redirect=/account/orders')

  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="card p-4 flex items-center justify-between hover:border-muted transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                    <span className={`badge ${
                      order.order_status === 'delivered' ? 'bg-green/20 text-green' :
                      order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                      order.order_status === 'shipped' ? 'bg-purple-500/20 text-purple-500' :
                      order.order_status === 'paid' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-amber-500/20 text-amber-500'
                    }`}>{order.order_status}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">{new Date(order.created_at).toLocaleDateString()} • {order.payment_method || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">KSh {order.total.toLocaleString('en-KE')}</p>
                  <p className={`text-xs ${order.payment_status === 'paid' ? 'text-green' : 'text-muted'}`}>{order.payment_status}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn btn-primary mt-4">Start Shopping</Link>
          </div>
        )}
      </div>
    </>
  )
}
