'use client'

import { cn } from '@/lib/utils/cn'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-500' },
  processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-500' },
  paid: { label: 'Paid', color: 'bg-green/20 text-green' },
  shipped: { label: 'Shipped', color: 'bg-purple-500/20 text-purple-500' },
  delivered: { label: 'Delivered', color: 'bg-green/30 text-green' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-500' },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: 'bg-border text-muted' }
  return <span className={cn('badge', config.color)}>{config.label}</span>
}
