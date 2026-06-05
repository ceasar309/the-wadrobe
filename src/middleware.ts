import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url))
    }
    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() { return '' },
          set() {},
          remove() {},
        },
      }
    )
    const { data: user } = await adminClient
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/account') && !session) {
    return NextResponse.redirect(new URL('/login?redirect=/account', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
