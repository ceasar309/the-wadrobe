import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'orders@thewadrobe.com'

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to The Wadrobe',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#d4a017;">Welcome to The Wadrobe</h1>
        <p>Hi ${name},</p>
        <p>Welcome to The Wadrobe — your destination for premium streetwear.</p>
        <p>You now have access to exclusive collections, early drops, and member-only pricing.</p>
        <p>Start exploring: <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop">Shop Now</a></p>
        <hr style="border-color:#2a2a2a;" />
        <p style="color:#888;font-size:12px;">The Wadrobe — Nairobi, Kenya</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset Your Password — The Wadrobe',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#d4a017;">Reset Your Password</h1>
        <p>Click the link below to reset your password. It expires in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#d4a017;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">Reset Password</a>
        <p style="color:#888;font-size:13px;">If you didn't request this, ignore this email.</p>
        <hr style="border-color:#2a2a2a;" />
        <p style="color:#888;font-size:12px;">The Wadrobe — Nairobi, Kenya</p>
      </div>
    `,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemsHtml = items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;">${i.name} x${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right;">KSh ${i.price.toLocaleString()}</td>
    </tr>
  `).join('')

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Order Confirmed — #${orderId}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#d4a017;">Order Confirmed</h1>
        <p>Thank you ${name}!</p>
        <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          <thead><tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #d4a017;">Item</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #d4a017;">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:700;">Total: KSh ${total.toLocaleString()}</p>
        <p>Track your order: <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}">View Order</a></p>
        <hr style="border-color:#2a2a2a;" />
        <p style="color:#888;font-size:12px;">The Wadrobe — Nairobi, Kenya</p>
      </div>
    `,
  })
}

export async function sendShippingConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  trackingLink?: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your Order Has Shipped — #${orderId}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#d4a017;">On Its Way!</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>#${orderId}</strong> is on the way!</p>
        ${trackingLink ? `<p>Track your delivery: <a href="${trackingLink}">${trackingLink}</a></p>` : ''}
        <hr style="border-color:#2a2a2a;" />
        <p style="color:#888;font-size:12px;">The Wadrobe — Nairobi, Kenya</p>
      </div>
    `,
  })
}

export async function sendNewOrderNotification(
  adminEmail: string,
  orderId: string,
  total: number,
  customerName: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `New Order #${orderId} — KSh ${total.toLocaleString()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#d4a017;">New Order Received</h1>
        <p><strong>Order:</strong> #${orderId}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Total:</strong> KSh ${total.toLocaleString()}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderId}" style="display:inline-block;padding:12px 24px;background:#d4a017;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">View Order</a>
      </div>
    `,
  })
}

export async function sendLowStockAlert(
  adminEmail: string,
  productName: string,
  stockQuantity: number
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `Low Stock Alert — ${productName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#ef4444;">Low Stock Alert</h1>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Remaining Stock:</strong> ${stockQuantity}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/products" style="display:inline-block;padding:12px 24px;background:#d4a017;color:#000;text-decoration:none;border-radius:8px;font-weight:600;margin:16px 0;">Manage Products</a>
      </div>
    `,
  })
}
