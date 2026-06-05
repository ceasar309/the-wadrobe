import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-muted">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
