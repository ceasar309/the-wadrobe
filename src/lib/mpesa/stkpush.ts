const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox'
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '174379'
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!

const MPESA_BASE_URL = MPESA_ENVIRONMENT === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64')
  const res = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  const data = await res.json()
  return data.access_token
}

function getTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function getPassword(timestamp: string): string {
  return Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64')
}

export async function stkPush(
  phoneNumber: string,
  amount: number,
  orderId: string,
  accountReference: string = 'The Wadrobe'
) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)

  const formattedPhone = phoneNumber.startsWith('0')
    ? `254${phoneNumber.slice(1)}`
    : phoneNumber.startsWith('+')
    ? phoneNumber.slice(1)
    : phoneNumber

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa-callback`,
      AccountReference: accountReference,
      TransactionDesc: `Order ${orderId}`,
    }),
  })

  return res.json()
}

export async function queryStatus(checkoutRequestId: string) {
  const token = await getAccessToken()
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  })

  return res.json()
}
