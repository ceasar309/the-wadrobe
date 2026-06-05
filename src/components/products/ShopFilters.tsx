'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface ShopFiltersProps {
  collections: string[]
  currentParams: Record<string, string>
}

export function ShopFilters({ collections, currentParams }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: currentParams.minPrice || '', max: currentParams.maxPrice || '' })

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/shop')
    setPriceRange({ min: '', max: '' })
  }

  const hasFilters = searchParams.toString().length > 0

  const collectionOptions = [
    { value: 'all', label: 'All' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'unisex', label: 'Unisex' },
    ...collections.filter((c: any) => !['men', 'women', 'unisex'].includes(c)).map((c: any) => ({ value: c, label: c })),
  ]

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline btn-sm">
          <SlidersHorizontal size={14} /> Filters
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-muted hover:text-foreground flex items-center gap-1">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className={cn('space-y-4', showFilters ? 'block' : 'hidden md:block')}>
        {/* Collection Pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {collectionOptions.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => updateParam('collection', opt.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium border transition-colors',
                (currentParams.collection === opt.value || (!currentParams.collection && opt.value === 'all'))
                  ? 'bg-accent text-black border-accent'
                  : 'border-border text-muted hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort & Price */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <select
            value={currentParams.sort || 'newest'}
            onChange={e => updateParam('sort', e.target.value)}
            className="input max-w-[160px] text-xs py-2"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Most Popular</option>
            <option value="name">Name A-Z</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
              className="input max-w-[80px] text-xs py-2"
            />
            <span className="text-muted text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
              className="input max-w-[80px] text-xs py-2"
            />
            <button
              onClick={() => {
                updateParam('minPrice', priceRange.min)
                updateParam('maxPrice', priceRange.max)
              }}
              className="btn btn-primary btn-sm"
            >
              Go
            </button>
          </div>

          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-muted hover:text-foreground hidden md:flex items-center gap-1">
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>
      </div>
    </>
  )
}
