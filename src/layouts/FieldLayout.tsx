import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, FolderOpen, Package, ClipboardList, LogOut, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSyncStore } from '@/store/sync.store'
import OfflineBanner from '@/components/OfflineBanner'
import NotificationBell from '@/components/NotificationBell'
import LocaleSwitcher from '@/components/LocaleSwitcher'

export default function FieldLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isOnline = useSyncStore(s => s.isOnline)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isWorker = user?.role === 'worker'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Top bar */}
      <header className="topbar">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.25rem' }}>🌅</span>
          <span className="topbar__logo">Sunset Field</span>
        </NavLink>
        <span className="topbar__spacer" />
        <LocaleSwitcher />
        <NotificationBell />
        <div style={{ width: 4 }} />

        {/* User Avatar + Logout Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--sunset-grad)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 800, color: '#070a12', fontSize: '0.8rem',
              border: 'none', cursor: 'pointer',
            }}
            title={user?.name}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>

          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowUserMenu(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 49 }}
              />
              {/* Dropdown */}
              <div style={{
                position: 'absolute', top: 40, right: 0, zIndex: 50,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '0.75rem', minWidth: 180,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{ marginBottom: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                  <span style={{
                    display: 'inline-block', marginTop: '0.25rem',
                    fontSize: '0.65rem', padding: '0.1rem 0.5rem',
                    background: 'var(--sunset-grad)', borderRadius: 99,
                    color: '#070a12', fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.4rem', background: 'rgba(244,63,94,0.1)',
                    border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius)',
                    color: 'var(--red)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {!isOnline && <OfflineBanner />}

      {/* Page content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={22} />
          {t('nav.dashboard')}
        </NavLink>

        <NavLink to="/projects" className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}>
          <FolderOpen size={22} />
          {t('nav.projects')}
        </NavLink>

        {!isWorker && (
          <NavLink to="/materials" className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}>
            <Package size={22} />
            {t('nav.materials')}
          </NavLink>
        )}

        <NavLink to="/logs" className={({ isActive }) => `bottom-nav__item${isActive ? ' active' : ''}`}>
          <ClipboardList size={22} />
          {t('nav.logs')}
        </NavLink>
      </nav>
    </div>
  )
}
