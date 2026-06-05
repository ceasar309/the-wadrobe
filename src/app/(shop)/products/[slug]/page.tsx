import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import type { Metadata } from 'next'

interface ProductPageProps { params: { slug: string } }

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient()
  const { data: product } = await supabase.from('products').select('*').eq('slug', params.slug).single() as any
  if (!product) return { title: 'Product Not Found' }
  return { title: product.name, description: product.description, openGraph: { title: product.name, description: product.description, images: product.images?.[0] ? [{ url: product.images[0] }] : [] } }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createServerComponentClient()
  const { data: product } = await supabase.from('products').select('*').eq('slug', params.slug).single() as any
  if (!product) notFound()
  const { data: reviews } = await supabase.from('reviews').select('*, users(name)').eq('product_id', product.id).eq('is_approved', true).order('created_at', { ascending: false }) as any
  const { data: related } = await supabase.from('products').select('*').eq('collection', product.collection).eq('is_active', true).neq('id', product.id).limit(4) as any
  return (<><CartSidebar /><ProductDetailClient product={product} reviews={reviews || []} relatedProducts={related || []} /></>)
}
