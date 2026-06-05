'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function AccountSettingsPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single() as any
      if (profile) {
        setName(profile.name || '')
        setPhone(profile.phone || '')
      }
    }
    loadProfile()
  }, [])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('users').update({ name, phone } as any).eq('id', user.id)
    if (error) toast.error(error.message)
    else {
      toast.success('Profile updated')
      router.refresh()
    }
    setProfileLoading(false)
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) toast.error(error.message)
    else {
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    toast.success('Signed out')
  }

  return (
    <div className="container-app py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <form onSubmit={updateProfile} className="space-y-4 mb-8">
        <h2 className="font-semibold">Profile</h2>
        <div>
          <label className="label">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="+254 7XX XXX XXX" />
        </div>
        <button type="submit" disabled={profileLoading} className="btn btn-primary">
          {profileLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <form onSubmit={changePassword} className="space-y-4 mb-8">
        <h2 className="font-semibold">Change Password</h2>
        <div>
          <label className="label">New Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input pr-10" placeholder="Min. 8 characters" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Changing...' : 'Update Password'}
        </button>
      </form>

      <button onClick={handleLogout} className="btn btn-danger">Sign Out</button>
    </div>
  )
}
