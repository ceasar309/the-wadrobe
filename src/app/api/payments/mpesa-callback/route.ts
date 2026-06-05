import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // M-Pesa callback validation
    if (body.Body?.stkCallback?.ResultCode === 0) {
      const { CheckoutRequestID, ResultDesc, Amount } = body.Body.stkCallback
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

      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_id', CheckoutRequestID)
        .single()

      if (order) {
        await supabase.from('orders').update({
          payment_status: 'paid',
          order_status: 'paid',
        }).eq('id', order.id)
      }

      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' })
    }

    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Failed' })
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
