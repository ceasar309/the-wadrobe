'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'

const categories = ['sweat-suits', 'sweatpants', 'hoodies', 't-shirts', 'accessories']
const collections = ['men', 'women', 'unisex']

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '', slug: '', description: '', category: 'hoodies', collection: 'unisex',
    price: '', sale_price: '', stock_quantity: '0', sizes: '', colors: '', features: '',
    badge: '', featured: false,
  })

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) uploaded.push(data.url)
      else toast.error(`Failed to upload ${file.name}`)
    }
    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sizes = form.sizes.split(',').map((s: any) => s.trim()).filter(Boolean)
    const colors = form.colors.split(',').map((s: any) => s.trim()).filter(Boolean)
    const features = form.features.split('\n').map((s: any) => s.trim()).filter(Boolean)

    const product = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: form.description,
      category: form.category,
      collection: form.collection,
      price: parseFloat(form.price) || 0,
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      sizes, colors, features,
      badge: form.badge || null,
      featured: form.featured,
      images,
      is_active: true,
    }

    const { error } = await supabase.from('products').insert(product)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Product created')
      router.push('/admin/products')
    }
    setLoading(false)
  }

  return (
    <div className="container-app py-8 max-w-2xl">
      <a href="/admin/products" className="text-sm text-muted hover:text-foreground mb-6 inline-block">← Back to Products</a>
      <h1 className="text-2xl font-bold mb-8">New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Images */}
        <div>
          <label className="label">Product Images</label>
          <div className="flex gap-3 flex-wrap mb-3">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"><X size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted hover:text-foreground hover:border-muted transition-colors">
              {uploading ? <span className="text-xs">Uploading...</span> : <><Upload size={20} /><span className="text-xs mt-1">Add Image</span></>}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Product Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))} className="input" required />
          </div>
          <div className="col-span-2">
            <label className="label">Slug</label>
            <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input" required />
          </div>
          <div className="col-span-2">
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input min-h-[100px]" required />
          </div>
          <div>
            <label className="label">Price (KSh)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">Sale Price (optional)</label>
            <input type="number" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label">Stock Quantity</label>
            <input type="number" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
              {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Collection</label>
            <select value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))} className="input">
              {collections.map((c: any) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Sizes (comma separated)</label>
            <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input" placeholder="S, M, L, XL" />
          </div>
          <div>
            <label className="label">Colors (comma separated)</label>
            <input type="text" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input" placeholder="Black, White, Navy" />
          </div>
          <div className="col-span-2">
            <label className="label">Features (one per line)</label>
            <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} className="input min-h-[80px]" />
          </div>
          <div>
            <label className="label">Badge (optional)</label>
            <input type="text" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} className="input" placeholder="Bestseller, New, Sale" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} id="featured" />
            <label htmlFor="featured" className="text-sm">Featured product</label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Creating...' : 'Create Product'}</button>
      </form>
    </div>
  )
}
