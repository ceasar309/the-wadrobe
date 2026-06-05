import { createAdminClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true }) as any
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }) as any
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }) as any

  const { data: recentOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5) as any
  const { data: lowStock } = await supabase.from('products').select('*').lte('stock_quantity', 5).eq('is_active', true).limit(5) as any

  const { data: revenueData } = await supabase.from('orders').select('total').eq('payment_status', 'paid') as any
  const totalRevenue = revenueData?.reduce((sum: any, o: any) => sum + o.total, 0) || 0

  const stats = [
    { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString('en-KE')}`, icon: DollarSign, color: 'text-green' },
    { label: 'Orders', value: totalOrders || 0, icon: ShoppingBag, color: 'text-accent' },
    { label: 'Products', value: totalProducts || 0, icon: Package, color: 'text-blue-500' },
    { label: 'Customers', value: totalUsers || 0, icon: Users, color: 'text-purple-500' },
  ]

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat: any) => (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">{stat.label}</p>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-xl font-bold mt-2">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { href: '/admin/products', label: 'Manage Products', icon: Package },
            { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
            { href: '/admin/users', label: 'Users', icon: Users },
            { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
            { href: '/admin/coupons', label: 'Coupons', icon: DollarSign },
          ].map((link: any) => (
            <Link key={link.href} href={link.href} className="card card-hover p-4 flex items-center gap-3">
              <link.icon size={20} className="text-accent" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Low Stock Alerts */}
        {lowStock && lowStock.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="font-semibold">Low Stock Alerts</h2>
            </div>
            <div className="space-y-2">
              {lowStock.map((p: any) => (
                <div key={p.id} className="card p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted">{p.stock_quantity} remaining</p>
                  </div>
                  <Link href={`/admin/products/${p.id}`} className="btn btn-outline btn-sm">Manage</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div>
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-2">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="card p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted">KSh {order.total.toLocaleString('en-KE')} — {order.order_status}</p>
                  </div>
                  <Link href={`/admin/orders/${order.id}`} className="btn btn-outline btn-sm">View</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No orders yet</p>
          )}
        </div>
      </div>
    </>
  )
}

