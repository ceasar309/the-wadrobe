'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Database } from '@/types/supabase'
import { formatPrice, getStockStatus } from '@/lib/utils/cn'
import { useCart } from '@/components/cart/CartProvider'

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const stock = getStockStatus(product.stock_quantity)

  return (
    <div className="card card-hover group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5] bg-card flex items-center justify-center overflow-hidden">
          <span className="text-5xl opacity-10">👕</span>
          {product.badge && (
            <span className="absolute top-2 left-2 badge badge-accent">{product.badge}</span>
          )}
          {product.stock_quantity === 0 && (
            <span className="absolute top-2 right-2 badge bg-red-600 text-white">Out of Stock</span>
          )}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <span className="absolute top-2 right-2 badge bg-amber-500 text-black">Low Stock</span>
          )}
          {product.sale_price && (
            <span className="absolute bottom-2 left-2 badge bg-red-600 text-white">Sale</span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <p className="text-[10px] text-muted uppercase tracking-wider font-medium">{product.collection}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold mt-0.5 truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {product.sale_price ? (
            <>
              <span className="text-sm font-bold text-accent">{formatPrice(product.sale_price)}</span>
              <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-accent">{formatPrice(product.price)}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-[10px] ${stock.color}`}>{stock.label}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star: any) => (
              <span key={star} className={`text-[10px] ${star <= Math.round(product.rating) ? 'text-accent' : 'text-border'}`}>★</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => addItem({
            productId: product.id,
            name: product.name,
            price: product.sale_price || product.price,
            image: product.images?.[0] || '',
            size: product.sizes?.[0] || null,
            color: product.colors?.[0] || null,
            quantity: 1,
          })}
          disabled={product.stock_quantity === 0}
          className="btn btn-primary btn-sm w-full mt-3"
        >
          <ShoppingBag size={14} />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
