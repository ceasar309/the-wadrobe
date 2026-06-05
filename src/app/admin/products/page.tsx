import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default async function AdminProductsPage() {
  const supabase = createServerComponentClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false }) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted font-medium">Product</th>
                  <th className="text-left p-4 text-muted font-medium">Price</th>
                  <th className="text-left p-4 text-muted font-medium">Stock</th>
                  <th className="text-left p-4 text-muted font-medium">Category</th>
                  <th className="text-left p-4 text-muted font-medium">Status</th>
                  <th className="text-right p-4 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: any) => (
                  <tr key={product.id} className="border-b border-border hover:bg-card/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-card" />}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-accent font-semibold">KSh {product.price.toLocaleString('en-KE')}</span>
                      {product.sale_price && <span className="text-xs text-muted line-through ml-1">KSh {product.sale_price.toLocaleString('en-KE')}</span>}
                    </td>
                    <td className="p-4">
                      <span className={product.stock_quantity <= 5 ? 'text-amber-500 font-medium' : ''}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4 text-muted">{product.collection}</td>
                    <td className="p-4">
                      <span className={`badge ${product.is_active ? 'bg-green/20 text-green' : 'bg-red-500/20 text-red-500'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/products/${product.id}`} className="btn btn-outline btn-sm p-2"><Edit size={14} /></Link>
                        <form action={`/api/products/${product.id}/delete`} method="POST">
                          <button type="submit" className="btn btn-outline btn-sm p-2 text-red-500"><Trash2 size={14} /></button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}


