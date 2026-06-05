'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } },
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          name,
          email,
          phone,
          password_hash: '',
          role: 'customer',
        } as any)

        if (profileError) {
          toast.error('Account created but profile setup failed. Contact support.')
          return
        }
      }

      toast.success('Account created! Check your email to verify.')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted mt-1">Join The Wadrobe community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+254 7XX XXX XXX" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input pr-10" placeholder="Min. 8 characters" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" placeholder="Repeat password" required />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
