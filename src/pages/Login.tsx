import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth.store'
import { Eye, EyeOff, Loader2, ArrowLeft, HardHat, UserCheck, Briefcase, ExternalLink } from 'lucide-react'
import LocaleSwitcher from '@/components/LocaleSwitcher'

const ADMIN_PANEL_URL = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000/admin'
  : 'https://admin.shacrawi.com/admin'

export default function Login() {
  const { t } = useTranslation()
  const login = useAuthStore(s => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      const role = useAuthStore.getState().user?.role
      // Tenant admins manage their company from the Filament desktop panel
      if (role === 'admin' || role === 'tenant_admin') {
        window.location.href = ADMIN_PANEL_URL
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password')
  }

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>
        <LocaleSwitcher />
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: 'var(--sunset-grad)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem', fontSize: '2rem',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
        }}>
          🌅
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Sunset <span className="text-gradient">Construction</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Field Operations & Contractor Workspace
        </p>
      </div>

      <form className="card card-glass" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius)', padding: '0.75rem', color: 'var(--red)',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="label">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="foreman@abyssinia.et or admin@abyssinia.et"
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">{t('auth.password')}</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0,
              }}
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-sunset"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}
          id="login-btn"
        >
          {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('auth.signing_in')}</> : t('auth.login')}
        </button>

        {/* Two-Lane Demo Section */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Demo — Field Crew (stays here)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => fillDemo('foreman@abyssinia.et')}
              title="Bekele Megersa — Site Foreman (Abyssinia Builders)"
            >
              <HardHat size={13} color="var(--sunset-amber)" /> Foreman
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
              onClick={() => fillDemo('worker@abyssinia.et')}
              title="Alazar Getachew — Field Worker (Abyssinia Builders)"
            >
              <UserCheck size={13} color="var(--sunset-teal)" /> Worker
            </button>
          </div>

          <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(249,115,22,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--sunset-orange)', fontWeight: 600, marginBottom: '0.3rem' }}>
              <Briefcase size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Company Admin? Manage your company here:
            </p>
            <a
              href={ADMIN_PANEL_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sunset btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              Open Company Management Portal <ExternalLink size={12} />
            </a>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', textAlign: 'center' }}>
              Login with your company admin email (e.g. admin@abyssinia.et)
            </p>
          </div>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <span>© {new Date().getFullYear()} Sunset Construction SaaS</span>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
