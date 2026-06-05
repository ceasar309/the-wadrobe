import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ProductCard } from '@/components/products/ProductCard'

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createServerComponentClient()
  const query = searchParams.q || ''

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false }) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Results for "${query}"` : 'Search Products'}
        </h1>
        <p className="text-sm text-muted mb-8">{products?.length || 0} products found</p>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No products found for &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </>
  )
}
