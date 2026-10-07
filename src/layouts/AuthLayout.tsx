import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1rem',
      background: 'radial-gradient(ellipse at 60% 0%, rgba(245,158,11,0.08) 0%, var(--bg-base) 60%)',
    }}>
      <Outlet />
    </div>
  )
}
