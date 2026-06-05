import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-bold tracking-[0.2em] uppercase">
              THE WADR<span className="text-accent">O</span>BE
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs">
              Premium streetwear and lifestyle brand based in Nairobi, Kenya. Heavy-blend apparel, bold graphics, and cultural statements.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Shop</h5>
            <div className="flex flex-col gap-2">
              <Link href="/shop?category=men" className="text-sm text-muted hover:text-foreground transition-colors">Men</Link>
              <Link href="/shop?category=women" className="text-sm text-muted hover:text-foreground transition-colors">Women</Link>
              <Link href="/shop?category=unisex" className="text-sm text-muted hover:text-foreground transition-colors">Unisex</Link>
              <Link href="/shop" className="text-sm text-muted hover:text-foreground transition-colors">All Products</Link>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Support</h5>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" className="text-sm text-muted hover:text-foreground transition-colors">WhatsApp</a>
              <a href="mailto:info@thewadrobe.com" className="text-sm text-muted hover:text-foreground transition-colors">Email Us</a>
              <Link href="/shipping" className="text-sm text-muted hover:text-foreground transition-colors">Shipping Info</Link>
              <Link href="/size-guide" className="text-sm text-muted hover:text-foreground transition-colors">Size Guide</Link>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">Connect</h5>
            <div className="flex flex-col gap-2">
              <a href="https://instagram.com/thewadrobe" target="_blank" className="text-sm text-muted hover:text-foreground transition-colors">Instagram</a>
              <a href="https://twitter.com/thewadrobe" target="_blank" className="text-sm text-muted hover:text-foreground transition-colors">Twitter / X</a>
              <a href="https://tiktok.com/@thewadrobe" target="_blank" className="text-sm text-muted hover:text-foreground transition-colors">TikTok</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} The Wadrobe. All rights reserved. Made in Nairobi, Kenya.</p>
        </div>
      </div>
    </footer>
  )
}
