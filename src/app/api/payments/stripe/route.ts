import { NextRequest, NextResponse } from 'next/server'
import { createStripeCheckoutSession } from '@/lib/stripe/payment'

export async function POST(req: NextRequest) {
  try {
    const { orderId, items, customerEmail } = await req.json()

    const lineItems = items.map((item: any) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    const session = await createStripeCheckoutSession(lineItems, orderId, customerEmail)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
