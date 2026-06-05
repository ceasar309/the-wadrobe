import { NextRequest, NextResponse } from 'next/server'
import { stkPush } from '@/lib/mpesa/stkpush'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, orderId } = await req.json()
    const result = await stkPush(phoneNumber, amount, orderId)

    if (result.ResponseCode === '0') {
      const cookieStore = cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value },
            set() {},
            remove() {},
          },
        }
      )

      await supabase.from('orders').update({
        payment_id: result.CheckoutRequestID,
        payment_status: 'pending',
      }).eq('id', orderId)

      return NextResponse.json({ success: true, checkoutRequestId: result.CheckoutRequestID })
    }

    return NextResponse.json({ error: result.ResponseDescription || 'M-Pesa request failed' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
