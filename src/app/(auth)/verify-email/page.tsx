'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setVerified(true)
        setTimeout(() => router.push('/account'), 2000)
      }
    }
    checkSession()
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-3">Email Verification</h1>
        {verified ? (
          <>
            <p className="text-green mb-4">✓ Email verified! Redirecting...</p>
            <Link href="/account" className="btn btn-primary">Go to Account</Link>
          </>
        ) : error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/login" className="btn btn-primary">Back to Sign In</Link>
          </>
        ) : (
          <>
            <p className="text-muted mb-4">Checking your verification status...</p>
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
          </>
        )}
      </div>
    </div>
  )
}
