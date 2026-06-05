import { createServerComponentClient } from '@/lib/supabase/server'
import { CartSidebar } from '@/components/cart/CartSidebar'

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient()
  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false }) as any

  return (
    <>
      <CartSidebar />
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-8">Users</h1>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted font-medium">Name</th>
                  <th className="text-left p-4 text-muted font-medium">Email</th>
                  <th className="text-left p-4 text-muted font-medium">Phone</th>
                  <th className="text-left p-4 text-muted font-medium">Role</th>
                  <th className="text-left p-4 text-muted font-medium">Verified</th>
                  <th className="text-left p-4 text-muted font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any) => (
                  <tr key={user.id} className="border-b border-border hover:bg-card/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4 text-muted">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span className={`badge ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-border text-muted'}`}>{user.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${user.email_verified ? 'bg-green/20 text-green' : 'bg-amber-500/20 text-amber-500'}`}>{user.email_verified ? 'Yes' : 'No'}</span>
                    </td>
                    <td className="p-4 text-muted text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
