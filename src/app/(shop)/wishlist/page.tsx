import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'

export default async function WishlistPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser() as any

  if (!user) {
    return (
      <>
        <CartSidebar />
        <div className="container-app py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
          <p className="text-muted mb-4">Sign in to view your wishlist</p>
          <Link href="/login?redirect=/wishlist" className="btn btn-primary">Sign In</Link>
        </div>
      </>
    )
  }

  const { data: wishlistItems } = await supabase
    .from('wishlist_items')
    .select('*, products(*)')
    .eq('user_id', user.id)

  const products = wishlistItems?.map((w: any) => w.products).filter(Boolean) || []

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted mb-4">Your wishlist is empty</p>
            <Link href="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        )}
      </div>
    </>
  )
}
