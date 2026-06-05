'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Database } from '@/types/supabase'

type Order = Database['public']['Tables']['orders']['Row']

const statuses = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'] as const

export function OrderDetailActions({ order }: { order: Order }) {
  const router = useRouter()
  const supabase = createClient()

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', order.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Order status updated to ${newStatus}`)
      router.refresh()
    }
  }

  const updatePayment = async (newStatus: string) => {
    const { error } = await supabase.from('orders').update({ payment_status: newStatus }).eq('id', order.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Payment status updated to ${newStatus}`)
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2">
      <select
        value={order.order_status}
        onChange={e => updateStatus(e.target.value)}
        className="input max-w-[140px] text-xs py-2"
      >
        {statuses.map((s: any) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <button
        onClick={() => updatePayment(order.payment_status === 'paid' ? 'pending' : 'paid')}
        className={`btn btn-sm ${order.payment_status === 'paid' ? 'btn-outline' : 'btn-primary'}`}
      >
        {order.payment_status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
      </button>
    </div>
  )
}
