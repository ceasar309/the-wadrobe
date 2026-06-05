import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
  typescript: true,
})

export async function createStripePaymentIntent(
  amount: number,
  orderId: string,
  customerEmail?: string
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'kes',
    metadata: { orderId },
    receipt_email: customerEmail,
  })
}

export async function confirmStripePayment(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId)
}

export async function createStripeCheckoutSession(
  items: Array<{ name: string; price: number; quantity: number }>,
  orderId: string,
  customerEmail?: string
) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'kes',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    metadata: { orderId },
    customer_email: customerEmail,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
  })
}
