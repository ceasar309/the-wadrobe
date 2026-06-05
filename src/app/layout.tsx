import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/CartProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'The Wadrobe — Premium Streetwear',
    template: '%s | The Wadrobe',
  },
  description: 'Premium streetwear and lifestyle brand based in Nairobi, Kenya. Heavy-blend apparel, snow wash finishes, and bold graphic designs.',
  keywords: ['streetwear', 'kenya', 'nairobi', 'clothing', 'apparel', 'snow wash', 'mkurugenzi'],
  openGraph: {
    title: 'The Wadrobe — Premium Streetwear',
    description: 'Premium streetwear and lifestyle brand from Nairobi, Kenya.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'The Wadrobe',
    locale: 'en_KE',
    type: 'website',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Wadrobe — Premium Streetwear',
    description: 'Premium streetwear and lifestyle brand from Nairobi, Kenya.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#f5f5f5',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                fontSize: '14px',
              },
              duration: 3000,
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
