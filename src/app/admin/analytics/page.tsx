import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { TrendingUp, DollarSign, ShoppingBag, Users, Package } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const supabase = createServerComponentClient()

  const { data: orders } = await supabase.from('orders').select('*') as any
  const { data: products } = await supabase.from('products').select('*').eq('is_active', true) as any
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }) as any

  const totalRevenue = orders?.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + o.total, 0) || 0
  const totalOrders = orders?.length || 0
  const paidOrders = orders?.filter((o: any) => o.payment_status === 'paid').length || 0
  const conversionRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0
  const totalProducts = products?.length || 0
  const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0

  const topProducts = await supabase
    .from('order_items')
    .select('name, quantity')
    .order('quantity', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString('en-KE')}`, icon: DollarSign, color: 'text-accent' },
    { label: 'Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-green' },
    { label: 'Avg Order Value', value: `KSh ${Math.round(avgOrderValue).toLocaleString('en-KE')}`, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Active Products', value: totalProducts, icon: Package, color: 'text-amber-500' },
    { label: 'Total Customers', value: totalUsers || 0, icon: Users, color: 'text-cyan-500' },
  ]

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat: any) => (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted">{stat.label}</p>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className="text-lg font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders over time */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            {orders?.slice(0, 10).map((order: any) => (
              <div key={order.id} className="flex justify-between text-sm py-2 border-b border-border">
                <span className="text-muted font-mono text-xs">#{order.id.slice(0, 8)}</span>
                <span className={order.payment_status === 'paid' ? 'text-green' : 'text-muted'}>KSh {order.total.toLocaleString('en-KE')}</span>
                <span className="text-muted">{order.order_status}</span>
                <span className="text-muted text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
