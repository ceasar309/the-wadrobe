import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ProductCard } from '@/components/products/ProductCard'
import { ShopFilters } from '@/components/products/ShopFilters'

interface ShopPageProps {
  searchParams: {
    category?: string
    collection?: string
    minPrice?: string
    maxPrice?: string
    size?: string
    color?: string
    sort?: string
    q?: string
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createServerComponentClient()
  let query = supabase.from('products').select('*').eq('is_active', true)

  if (searchParams.collection && searchParams.collection !== 'all') {
    query = query.eq('collection', searchParams.collection)
  }
  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.minPrice) {
    query = query.gte('price', parseFloat(searchParams.minPrice))
  }
  if (searchParams.maxPrice) {
    query = query.lte('price', parseFloat(searchParams.maxPrice))
  }
  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const sortMapping: Record<string, { column: string; ascending: boolean }> = {
    'price-asc': { column: 'price', ascending: true },
    'price-desc': { column: 'price', ascending: false },
    'newest': { column: 'created_at', ascending: false },
    'rating': { column: 'rating', ascending: false },
    'name': { column: 'name', ascending: true },
  }

  const sort = sortMapping[searchParams.sort || 'newest'] || sortMapping['newest']
  query = query.order(sort.column, { ascending: sort.ascending })

  const { data: products } = await query as any

  const { data: collections } = await supabase
    .from('products')
    .select('collection')
    .eq('is_active', true)
    .not('collection', 'is', 'null' as any)

  const uniqueCollections = [...new Set((collections as any[])?.map((c: any) => c.collection) || [])]

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <div className="text-center mb-8">
          <h1 className="section-title">Collection</h1>
          <p className="section-subtitle mt-1">Heavy-blend streetwear. Bold statements. Built for the culture.</p>
        </div>

        <ShopFilters collections={uniqueCollections} currentParams={searchParams} />

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {(products as any[])?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  )
}
