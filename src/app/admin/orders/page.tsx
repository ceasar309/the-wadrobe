import { createAdminClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

export default async function AdminOrdersPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Orders</h1>

        {orders && orders.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted font-medium">Order ID</th>
                    <th className="text-left p-4 text-muted font-medium">Customer</th>
                    <th className="text-left p-4 text-muted font-medium">Total</th>
                    <th className="text-left p-4 text-muted font-medium">Status</th>
                    <th className="text-left p-4 text-muted font-medium">Payment</th>
                    <th className="text-left p-4 text-muted font-medium">Date</th>
                    <th className="text-right p-4 text-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border hover:bg-card/50">
                      <td className="p-4 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                      <td className="p-4">
                        <p className="font-medium">{order.shipping_address?.name || 'Guest'}</p>
                        <p className="text-xs text-muted">{order.email || order.phone || '—'}</p>
                      </td>
                      <td className="p-4 font-semibold text-accent">KSh {order.total.toLocaleString('en-KE')}</td>
                      <td className="p-4"><OrderStatusBadge status={order.order_status} /></td>
                      <td className="p-4">
                        <span className={`badge ${order.payment_status === 'paid' ? 'bg-green/20 text-green' : order.payment_status === 'failed' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-muted text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <a href={`/admin/orders/${order.id}`} className="btn btn-outline btn-sm">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted">No orders yet</p>
        )}
      </div>
    </>
  )
}

