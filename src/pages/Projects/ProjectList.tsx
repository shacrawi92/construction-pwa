import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { projectsApi } from '@/api/projects.api'
import { Plus, MapPin, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useState } from 'react'

const STATUS_COLORS: Record<string,string> = {
  draft: 'badge-muted', active: 'badge-green', on_hold: 'badge-amber',
  completed: 'badge-blue', cancelled: 'badge-red',
}

export default function ProjectList() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['projects', search, status],
    queryFn: () => projectsApi.list({ search, status }),
  })

  const projects = data?.data ?? []

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('project.title')}</h1>
        <span style={{ flex: 1 }} />
        {user?.role !== 'worker' && (
          <Link to="/projects/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> {t('project.new')}
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input
          className="input"
          placeholder={t('common.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <select className="select" value={status} onChange={e => setStatus(e.target.value)} style={{ width: 130 }}>
          <option value="">All</option>
          {['draft','active','on_hold','completed','cancelled'].map(s => (
            <option key={s} value={s}>{t(`project.${s}`)}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, marginBottom: '0.75rem' }} />
        ))
        : projects.length === 0
          ? <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.no_data')}</div>
          : projects.map((p: any) => (
            <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
              <div className="card card--hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{p.code}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[p.status] ?? 'badge-muted'}`}>{t(`project.${p.status}`)}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={13} /> {p.location}
                  </span>
                  {p.start_date && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> {p.start_date}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
                    {p.client_name}
                  </span>
                </div>
                {/* Budget progress */}
                {p.total_allocated > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span>Budget used</span>
                      <span>{Math.round((p.total_spent / p.total_allocated) * 100)}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress__fill${p.total_spent / p.total_allocated > 0.9 ? ' progress__fill--red' : ''}`}
                        style={{ width: `${Math.min(100, (p.total_spent / p.total_allocated) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))
      }
    </div>
  )
}
