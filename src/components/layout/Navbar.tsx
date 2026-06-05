'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=men', label: 'Men' },
  { href: '/shop?category=women', label: 'Women' },
  { href: '/shop?category=unisex', label: 'Unisex' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems, toggleCart } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container-app flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] uppercase">
            THE WADR<span className="text-accent">O</span>BE
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium tracking-wider uppercase transition-colors',
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]))
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-muted hover:text-foreground transition-colors">
              <Search size={20} />
            </button>
            <Link href="/account" className="hidden sm:block p-2 text-muted hover:text-foreground transition-colors">
              <User size={20} />
            </Link>
            <button onClick={toggleCart} className="relative p-2 text-muted hover:text-foreground transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border py-3 animate-fade-in">
            <div className="container-app">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-sm">Search</button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 mt-16 bg-background border-t border-border animate-fade-in md:hidden">
          <nav className="container-app py-6 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-muted hover:text-foreground text-sm font-medium tracking-wider uppercase border-b border-border"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="py-3 text-muted hover:text-foreground text-sm font-medium tracking-wider uppercase border-b border-border">
              My Account
            </Link>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="py-3 text-muted hover:text-foreground text-sm font-medium tracking-wider uppercase">
              Wishlist
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
