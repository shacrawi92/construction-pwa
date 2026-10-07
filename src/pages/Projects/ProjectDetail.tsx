import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { projectsApi } from '@/api/projects.api'
import { ArrowLeft, FileText, Wallet, Clock, Package, ClipboardList } from 'lucide-react'
import { useState } from 'react'

type Tab = 'overview' | 'estimations' | 'budget' | 'timeline' | 'materials' | 'logs'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(Number(id)),
  })

  const { data: estimations } = useQuery({
    queryKey: ['estimations', id],
    queryFn: () => projectsApi.getEstimations(Number(id)),
    enabled: tab === 'estimations',
  })

  const { data: budgets } = useQuery({
    queryKey: ['budgets', id],
    queryFn: () => projectsApi.getBudgets(Number(id)),
    enabled: tab === 'budget',
  })

  const { data: timelines } = useQuery({
    queryKey: ['timelines', id],
    queryFn: () => projectsApi.getTimelines(Number(id)),
    enabled: tab === 'timeline',
  })

  if (isLoading) return (
    <div className="page">
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: '0.75rem' }} />)}
    </div>
  )
  if (!project) return <div className="page"><p>Project not found.</p></div>

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',    label: 'Overview',     icon: <FileText size={15} /> },
    { key: 'estimations', label: t('estimation.title'), icon: <FileText size={15} /> },
    { key: 'budget',      label: t('budget.title'),     icon: <Wallet size={15} /> },
    { key: 'timeline',    label: 'Timeline',     icon: <Clock size={15} /> },
    { key: 'materials',   label: t('material.title'),   icon: <Package size={15} /> },
    { key: 'logs',        label: t('labor.title'),      icon: <ClipboardList size={15} /> },
  ]

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ marginBottom: '0.75rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{project.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{project.code} · {project.location}</p>
          </div>
          <span className={`badge ${project.status === 'active' ? 'badge-green' : 'badge-muted'}`}>{project.status}</span>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.25rem' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab(t.key)}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Project Details</h3>
            {[
              ['Client', project.client_name],
              ['Contract Value', `ብር ${Number(project.contract_value ?? 0).toLocaleString()}`],
              ['Start Date', project.start_date ?? '—'],
              ['End Date',   project.end_date   ?? '—'],
              ['Foreman',    project.foreman?.name ?? '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Overall progress */}
          <div className="card">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Overall Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <span>Completion</span>
              <strong>{project.overall_progress ?? 0}%</strong>
            </div>
            <div className="progress">
              <div className="progress__fill" style={{ width: `${project.overall_progress ?? 0}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Spent: ብር {Number(project.total_spent ?? 0).toLocaleString()}</span>
              <span>Allocated: ብር {Number(project.total_allocated ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'estimations' && (
        <div>
          <Link to={`/projects/${id}/estimations/new`} className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}>
            + {t('estimation.new')}
          </Link>
          {(estimations ?? []).map((e: any) => (
            <Link key={e.id} to={`/projects/${id}/estimations/${e.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
              <div className="card card--hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{e.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.status}</p>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>ብር {Number(e.total_etb).toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'budget' && (
        <div>
          {(budgets ?? []).map((b: any) => (
            <div key={b.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>{b.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ብር {Number(b.spent_etb).toLocaleString()} / {Number(b.allocated_etb).toLocaleString()}
                </span>
              </div>
              <div className="progress">
                <div
                  className={`progress__fill${b.allocated_etb > 0 && b.spent_etb / b.allocated_etb > 0.9 ? ' progress__fill--red' : ''}`}
                  style={{ width: b.allocated_etb > 0 ? `${Math.min(100, (b.spent_etb / b.allocated_etb) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'timeline' && (
        <div>
          {(timelines ?? []).map((tl: any) => (
            <div key={tl.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{tl.phase_name}</span>
                <span className={`badge ${tl.status === 'completed' ? 'badge-green' : tl.status === 'delayed' ? 'badge-red' : 'badge-amber'}`}>{tl.status}</span>
              </div>
              <div className="progress">
                <div className="progress__fill" style={{ width: `${tl.progress_pct}%` }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                {tl.planned_start} → {tl.planned_end} · {tl.progress_pct}%
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'materials' && (
        <div>
          <Link to={`/materials/request/${id}`} className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}>
            + {t('material.request')}
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View material requests for this project.</p>
        </div>
      )}

      {tab === 'logs' && (
        <div>
          <Link to={`/logs/new?project=${id}`} className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}>
            + {t('labor.new')}
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Labor logs for this project.</p>
        </div>
      )}
    </div>
  )
}
