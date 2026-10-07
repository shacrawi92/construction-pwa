import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth.store'
import { projectsApi } from '@/api/projects.api'
import { materialsApi } from '@/api/projects.api'
import { laborLogsApi } from '@/api/projects.api'
import StatCard from '@/components/StatCard'
import { FolderOpen, Package, ClipboardList, TrendingUp, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'dashboard'],
    queryFn: () => projectsApi.list({ per_page: 5 }),
  })

  const { data: materialsData } = useQuery({
    queryKey: ['materials', 'low_stock'],
    queryFn: () => materialsApi.list({ low_stock: 1, per_page: 5 }),
    enabled: user?.role !== 'worker',
  })

  const projects = projectsData?.data ?? []
  const activeCount = projects.filter((p: any) => p.status === 'active').length
  const lowStockCount = materialsData?.data?.length ?? 0

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
          <h1 className="page-title">
            {t('nav.dashboard')} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Welcome back, <strong>{user?.name}</strong>
            <span className="badge badge-amber" style={{ marginLeft: '0.5rem' }}>{user?.role}</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          label={t('project.title')}
          value={projectsData?.total ?? '—'}
          sub={`${activeCount} active`}
          icon={<FolderOpen size={22} />}
          color="blue"
        />
        {user?.role !== 'worker' && (
          <StatCard
            label="Low Stock Alerts"
            value={lowStockCount}
            sub="items below reorder"
            icon={<AlertTriangle size={22} />}
            color={lowStockCount > 0 ? 'red' : 'green'}
          />
        )}
        <StatCard
          label="Your Role"
          value={user?.role?.toUpperCase() ?? '—'}
          sub={user?.foreman?.specialty ?? user?.email ?? ''}
          icon={<TrendingUp size={22} />}
          color="amber"
        />
      </div>

      {/* Recent Projects */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Projects</h2>
          <Link to="/projects" className="btn btn-ghost btn-sm">{t('common.view_all')}</Link>
        </div>
        {projects.length === 0
          ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('common.no_data')}</p>
          : projects.slice(0, 4).map((p: any) => (
            <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.code} · {p.location}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </Link>
          ))
        }
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && user?.role !== 'worker' && (
        <div className="card" style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} color="var(--red)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--red)' }}>Low Stock Alert</h2>
          </div>
          {(materialsData?.data ?? []).map((m: any) => (
            <div key={m.id} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
              fontSize: '0.875rem',
            }}>
              <span>{m.name_en}</span>
              <span style={{ color: 'var(--red)', fontWeight: 700 }}>{m.stock_qty} {m.unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'badge-muted', active: 'badge-green', on_hold: 'badge-amber',
    completed: 'badge-blue', cancelled: 'badge-red',
  }
  return <span className={`badge ${map[status] ?? 'badge-muted'}`}>{status.replace('_', ' ')}</span>
}
