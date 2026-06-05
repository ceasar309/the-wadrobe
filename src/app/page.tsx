import Link from 'next/link'
import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ProductCard } from '@/components/products/ProductCard'

export default async function HomePage() {
  const supabase = createServerComponentClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8) as any

  const { data: newProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4) as any

  return (
    <>
      <CartSidebar />

      <section className="min-h-[85vh] flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-green/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-accent text-black text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            Est. 2024 — Nairobi
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-4">
            Premium<br />Streetwear.<br />
            <span className="text-accent">Define Your Fit.</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-lg mx-auto mb-8">
            Heavy-blend apparel, snow wash finishes, and bold graphics. Built for comfort, designed for impact.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/shop" className="btn btn-primary">Explore Collection</Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`} target="_blank" className="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border py-10">
        <div className="container-app grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '📦', title: 'Premium Quality', desc: 'Heavy-blend 400GSM cotton for lasting wear' },
            { icon: '❤️', title: 'Nairobi Made', desc: 'Designed and produced locally in Kenya' },
            { icon: '💬', title: 'Easy Checkout', desc: 'Order via WhatsApp for quick, personal service' },
          ].map((f: any) => (
            <div key={f.title} className="space-y-2">
              <div className="text-3xl">{f.icon}</div>
              <h4 className="font-semibold text-sm">{f.title}</h4>
              <p className="text-xs text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="container-app py-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle mt-2">Our most sought-after pieces</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </section>
      )}

      {newProducts && newProducts.length > 0 && (
        <section className="container-app pb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle mt-2">Fresh drops you haven&apos;t seen</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-card border-y border-border py-16">
        <div className="container-app text-center">
          <h2 className="section-title mb-3">Prefer Ordering via Chat?</h2>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            Message us directly on WhatsApp. Tell us what you want, and we&apos;ll handle the rest.
          </p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`} target="_blank" className="btn btn-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Order on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
