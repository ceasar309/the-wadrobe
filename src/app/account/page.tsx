import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'
import { Package, Heart, Settings, LogOut } from 'lucide-react'

export default async function AccountPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser() as any

  if (!user) redirect('/login?redirect=/account')

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single() as any
  const { data: recentOrders } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5) as any
  const { count: wishlistCount } = await supabase.from('wishlist_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-2">My Account</h1>
        <p className="text-sm text-muted mb-8">Welcome back, {profile?.name || user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <Package size={24} className="text-accent mb-3" />
            <h3 className="font-semibold">{recentOrders?.length || 0} Orders</h3>
            <p className="text-xs text-muted mt-1">Track and manage your orders</p>
            <Link href="/account/orders" className="btn btn-outline btn-sm mt-4 inline-flex">View Orders</Link>
          </div>
          <div className="card p-6">
            <Heart size={24} className="text-accent mb-3" />
            <h3 className="font-semibold">{wishlistCount || 0} Saved Items</h3>
            <p className="text-xs text-muted mt-1">Your wishlist collection</p>
            <Link href="/wishlist" className="btn btn-outline btn-sm mt-4 inline-flex">View Wishlist</Link>
          </div>
          <div className="card p-6">
            <Settings size={24} className="text-accent mb-3" />
            <h3 className="font-semibold">Settings</h3>
            <p className="text-xs text-muted mt-1">Profile, password, preferences</p>
            <Link href="/account/settings" className="btn btn-outline btn-sm mt-4 inline-flex">Manage</Link>
          </div>
        </div>

        {recentOrders && recentOrders.length > 0 && (
          <div>
            <h2 className="font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-2">
              {recentOrders.map((order: any) => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="card p-4 flex items-center justify-between hover:border-muted transition-colors">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted">{new Date(order.created_at).toLocaleDateString()} — KSh {order.total.toLocaleString('en-KE')}</p>
                  </div>
                  <span className={`badge ${
                    order.order_status === 'delivered' ? 'bg-green/20 text-green' :
                    order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                    'bg-amber-500/20 text-amber-500'
                  }`}>{order.order_status}</span>
                </Link>
              ))}
            </div>
            <Link href="/account/orders" className="btn btn-outline btn-sm mt-4">View All Orders</Link>
          </div>
        )}
      </div>
    </>
  )
}
