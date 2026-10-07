import React from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Navigate } from 'react-router-dom'

interface Props { roles: string[]; children: React.ReactNode }

export default function RoleGuard({ roles, children }: Props) {
  const { user } = useAuthStore()
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
