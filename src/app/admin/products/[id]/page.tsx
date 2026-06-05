'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'

interface Props { params: { id: string } }

export default function EditProductPage({ params }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', params.id).single().then(({ data }: any) => {
      setForm(data)
      if (data?.images) setImages(data.images)
    })
  }, [params.id])

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setImages(prev => [...prev, data.url])
      else toast.error(`Failed to upload ${file.name}`)
    }
    setUploading(false)
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  if (!form) return <div className="container-app py-8"><p className="text-muted">Loading...</p></div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.from('products').update({
      name: form.name, slug: form.slug, description: form.description,
      category: form.category, collection: form.collection,
      price: parseFloat(form.price), stock_quantity: parseInt(form.stock_quantity),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      sizes: form.sizes, colors: form.colors, features: form.features,
      badge: form.badge || null, featured: form.featured, images,
    }).eq('id', params.id)
    if (error) toast.error(error.message)
    else { toast.success('Saved'); router.push('/admin/products') }
    setLoading(false)
  }

  return (
    <div className="container-app py-8 max-w-2xl">
      <a href="/admin/products" className="text-sm text-muted hover:text-foreground mb-6 inline-block">← Back</a>
      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>

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

        <div><label className="label">Name</label><input type="text" value={form.name} onChange={e => setForm((f: any) => ({...f, name: e.target.value}))} className="input" required /></div>
        <div><label className="label">Description</label><textarea value={form.description} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} className="input min-h-[100px]" required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Price</label><input type="number" value={form.price} onChange={e => setForm((f: any) => ({...f, price: e.target.value}))} className="input" required /></div>
          <div><label className="label">Sale Price</label><input type="number" value={form.sale_price || ''} onChange={e => setForm((f: any) => ({...f, sale_price: e.target.value}))} className="input" /></div>
          <div><label className="label">Stock</label><input type="number" value={form.stock_quantity} onChange={e => setForm((f: any) => ({...f, stock_quantity: e.target.value}))} className="input" required /></div>
          <div><label className="label">Collection</label><select value={form.collection} onChange={e => setForm((f: any) => ({...f, collection: e.target.value}))} className="input"><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option></select></div>
        </div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({...f, featured: e.target.checked}))} /><span className="text-sm">Featured</span></label><label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm((f: any) => ({...f, is_active: e.target.checked}))} /><span className="text-sm">Active</span></label></div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  )
}
