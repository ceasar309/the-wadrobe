'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
      toast.success('Reset link sent to your email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold mb-3">Check Your Email</h1>
          <p className="text-sm text-muted mb-6">We&apos;ve sent a password reset link to <strong className="text-foreground">{email}</strong></p>
          <Link href="/login" className="btn btn-primary">Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Remember your password? <Link href="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
