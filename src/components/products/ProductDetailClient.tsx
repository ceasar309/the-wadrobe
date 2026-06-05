'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Heart, Share2, ChevronLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice, getStockStatus, cn } from '@/lib/utils/cn'
import type { Database } from '@/types/supabase'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']
type Review = Database['public']['Tables']['reviews']['Row'] & { users?: { name: string } | null }

interface ProductDetailClientProps {
  product: Product
  reviews: Review[]
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, reviews, relatedProducts }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null)
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const stock = getStockStatus(product.stock_quantity)

  const handleAddToCart = () => {
    if (product.colors?.length && !selectedColor) {
      toast.error('Please select a color')
      return
    }
    if (product.sizes?.length && !selectedSize && !product.sizes.includes('One Size')) {
      toast.error('Please select a size')
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images?.[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I want to order:\n\nProduct: ${product.name}\nSize: ${selectedSize || 'N/A'}\nColor: ${selectedColor || 'N/A'}\nQuantity: ${quantity}\nPrice: KSh ${((product.sale_price || product.price) * quantity).toLocaleString('en-KE')}\n\nCustomer Name: _[Your name]_\nPhone Number: _[Your number]_`
  )

  return (
    <div className="container-app py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-card rounded-xl flex items-center justify-center relative overflow-hidden">
            <span className="text-8xl opacity-10">👕</span>
            {product.badge && (
              <span className="absolute top-4 left-4 badge bg-green text-black">{product.badge}</span>
            )}
            {product.stock_quantity === 0 && (
              <span className="absolute top-4 right-4 badge bg-red-600 text-white">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-medium mb-2">{product.collection}</p>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star: any) => (
                <Star key={star} size={14} className={star <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-border'} />
              ))}
              <span className="text-xs text-muted ml-1">({product.review_count} reviews)</span>
            </div>
            <span className={`text-xs font-medium ${stock.color}`}>{stock.label}</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            {product.sale_price ? (
              <>
                <span className="text-3xl font-bold text-accent">{formatPrice(product.sale_price)}</span>
                <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-accent">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-sm text-muted mt-4 leading-relaxed">{product.description}</p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {product.features.map((f, i) => (
                <li key={i} className="text-sm text-muted flex items-center gap-2">
                  <span className="text-accent">—</span> {f}
                </li>
              ))}
            </ul>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="label">Color {selectedColor && <span className="text-foreground">— {selectedColor}</span>}</p>
              <div className="flex gap-2">
                {product.colors.map((color: any) => {
                  const colorMap: Record<string, string> = {
                    Charcoal: '#4a4a4a', Navy: '#1a2744', Burgundy: '#6e2c3d',
                    Black: '#1a1a1a', White: '#e8e8e8', Grey: '#6b6b6b',
                    Khaki: '#b59a72', Natural: '#d4c8a9',
                  }
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 transition-all',
                        selectedColor === color ? 'border-accent scale-110' : 'border-border hover:border-muted'
                      )}
                      title={color}
                    >
                      <div className="w-full h-full rounded-full" style={{ background: colorMap[color] || '#666' }} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && !product.sizes.includes('One Size') && (
            <div className="mt-4">
              <p className="label">Size {selectedSize && <span className="text-foreground">— {selectedSize}</span>}</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size: any) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'px-4 py-2 border rounded-lg text-sm font-medium transition-all',
                      selectedSize === size ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted hover:text-foreground'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="label">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-muted">−</button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-muted">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="btn btn-primary flex-1">
              <ShoppingBag size={16} />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=${whatsappMessage}`}
              target="_blank"
              className="btn btn-whatsapp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 p-4 bg-card rounded-xl border border-border">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'On orders over KSh 5,000' },
              { icon: Shield, label: 'Secure', desc: 'M-Pesa & SSL protected' },
              { icon: RotateCcw, label: 'Easy Returns', desc: '7-day return policy' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <Icon size={18} className="mx-auto text-accent" />
                <p className="text-xs font-semibold mt-1">{label}</p>
                <p className="text-[10px] text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {reviews.map((review: any) => (
              <div key={review.id} className="p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center text-xs font-semibold">
                      {review.users?.name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.users?.name || 'Anonymous'}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star: any) => (
                          <Star key={star} size={10} className={star <= review.rating ? 'fill-accent text-accent' : 'text-border'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                {review.title && <p className="text-sm font-medium mt-2">{review.title}</p>}
                {review.comment && <p className="text-sm text-muted mt-1">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card card-hover p-3">
                <div className="aspect-[4/5] bg-card rounded-lg flex items-center justify-center">
                  <span className="text-4xl opacity-10">👕</span>
                </div>
                <p className="text-sm font-semibold mt-2 truncate">{p.name}</p>
                <p className="text-sm font-bold text-accent">{formatPrice(p.sale_price || p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
