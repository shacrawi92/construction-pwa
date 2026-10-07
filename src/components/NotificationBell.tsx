import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { notificationApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useEffect, useRef } from 'react'

// Setup Laravel Echo globally
if (typeof window !== 'undefined' && !(window as any).Echo) {
  (window as any).Pusher = Pusher
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ;(window as any).Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'construction-key',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? (isLocal ? 'localhost' : 'admin.shacrawi.com'),
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? (isLocal ? 8080 : 443)),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: !isLocal || (import.meta.env.VITE_REVERB_SCHEME === 'https'),
    enabledTransports: ['ws', 'wss'],
    authEndpoint: isLocal ? '/broadcasting/auth' : 'https://admin.shacrawi.com/api/broadcasting/auth',
    auth: { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } },
  })
}

export default function NotificationBell() {
  const { user } = useAuthStore()
  const [open, setOpen]   = useState(false)
  const [unread, setUnread] = useState(0)
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list(),
    enabled: !!user,
  })

  const markAllRead = useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => { setUnread(0); qc.invalidateQueries({ queryKey: ['notifications'] }) },
  })

  useEffect(() => {
    if (data?.data) setUnread(data.data.filter((n: any) => !n.read_at).length)
  }, [data])

  // Subscribe to real-time foreman notifications
  useEffect(() => {
    if (!user?.foreman?.id) return
    const echo = (window as any).Echo
    if (!echo) return
    const channel = echo.private(`foreman.${user.foreman.id}`)
    channel.listen('.material-request.reviewed', () => {
      setUnread(u => u + 1)
      qc.invalidateQueries({ queryKey: ['notifications'] })
    })
    return () => echo.leave(`foreman.${user.foreman?.id}`)
  }, [user?.foreman?.id])

  const notifications = data?.data ?? []

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn btn-ghost btn-icon"
        onClick={() => setOpen(v => !v)}
        id="notification-bell"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            background: 'var(--red)', color: '#fff',
            borderRadius: '50%', width: 16, height: 16,
            fontSize: '0.6rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', width: 300, boxShadow: 'var(--shadow-lg)',
            maxHeight: 360, overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
              <button className="btn btn-ghost btn-sm" onClick={() => markAllRead.mutate()}><CheckCheck size={14} /> All read</button>
            </div>
            {notifications.length === 0
              ? <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications</p>
              : notifications.map((n: any) => (
                <div key={n.id} style={{
                  padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
                  background: n.read_at ? 'transparent' : 'var(--accent-dim)',
                  fontSize: '0.8rem',
                }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>
                    {n.data?.status === 'approved' ? '✅' : n.data?.status === 'rejected' ? '❌' : '🔔'}{' '}
                    Material Request {n.data?.status}
                  </p>
                  <p style={{ color: 'var(--text-muted)' }}>{n.data?.project_name}</p>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  )
}
