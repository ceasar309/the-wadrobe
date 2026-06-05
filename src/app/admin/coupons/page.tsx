'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function AdminCouponsPage() {
  const supabase = createClient()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '', discount_type: 'percentage', discount_value: '',
    min_order_amount: '0', max_uses: '', expires_at: '',
  })

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
  }

  useEffect(() => { loadCoupons() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_amount: parseFloat(form.min_order_amount) || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
    })

    if (error) toast.error(error.message)
    else {
      toast.success('Coupon created')
      setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '0', max_uses: '', expires_at: '' })
      loadCoupons()
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Coupon deleted'); loadCoupons() }
  }

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Coupons</h1>

        <form onSubmit={handleCreate} className="card p-4 mb-8 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div>
            <label className="label">Code</label>
            <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="input" placeholder="SAVE20" required />
          </div>
          <div>
            <label className="label">Type</label>
            <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))} className="input">
              <option value="percentage">%</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="label">Value</label>
            <input type="number" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">Min Order</label>
            <input type="number" value={form.min_order_amount} onChange={e => setForm(f => ({ ...f, min_order_amount: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="label">Max Uses</label>
            <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary h-[42px]"><Plus size={16} /> Add</button>
        </form>

        <div className="space-y-2">
          {coupons.map((coupon: any) => (
            <div key={coupon.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-accent">{coupon.code}</p>
                <p className="text-xs text-muted">
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `KSh ${coupon.discount_value} off`}
                  {coupon.min_order_amount > 0 && ` • Min: KSh ${coupon.min_order_amount.toLocaleString('en-KE')}`}
                  {coupon.max_uses && ` • Max uses: ${coupon.max_uses}`}
                  {coupon.expires_at && ` • Expires: ${new Date(coupon.expires_at).toLocaleDateString()}`}
                </p>
                <p className="text-xs text-muted">Used: {coupon.used_count}{coupon.max_uses ? `/${coupon.max_uses}` : ''}</p>
              </div>
              <button onClick={() => handleDelete(coupon.id)} className="btn btn-outline btn-sm p-2 text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-sm text-muted text-center py-8">No coupons yet</p>}
        </div>
      </div>
    </>
  )
}
