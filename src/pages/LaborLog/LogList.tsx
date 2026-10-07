import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { laborLogsApi, projectsApi } from '@/api/projects.api'
import { Plus, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

export default function LogList() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [params] = useSearchParams()
  const [projectId, setProjectId] = useState(params.get('project') ?? '')

  const { data: projects } = useQuery({
    queryKey: ['projects', 'list'],
    queryFn: () => projectsApi.list({ per_page: 100 }),
  })

  const { data: logs, isLoading } = useQuery({
    queryKey: ['labor-logs', projectId],
    queryFn: () => laborLogsApi.list(Number(projectId)),
    enabled: !!projectId,
  })

  const projectList = projects?.data ?? []
  const logList     = logs?.data ?? []

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('labor.title')}</h1>
        <span style={{ flex: 1 }} />
        {user?.role !== 'worker' && (
          <Link to="/logs/new" className="btn btn-primary btn-sm">
            <Plus size={16} /> {t('labor.new')}
          </Link>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <select className="select" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select project…</option>
          {projectList.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
        </select>
      </div>

      {!projectId && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <ClipboardList size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p>Select a project to view labor logs</p>
        </div>
      )}

      {isLoading && <div className="skeleton" style={{ height: 300 }} />}

      {projectId && !isLoading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('labor.worker')}</th>
                <th>{t('labor.work_type')}</th>
                <th>{t('labor.date')}</th>
                <th style={{ textAlign: 'right' }}>{t('labor.hours')}</th>
                <th style={{ textAlign: 'right' }}>{t('labor.cost')}</th>
              </tr>
            </thead>
            <tbody>
              {logList.length === 0
                ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.no_data')}</td></tr>
                : logList.map((log: any) => (
                  <tr key={log.id}>
                    <td>
                      <p style={{ fontWeight: 600 }}>{log.worker_name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>by {log.foreman?.name}</p>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{log.work_type?.name_en ?? '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{log.log_date}</td>
                    <td style={{ textAlign: 'right' }}>{log.hours_worked}h</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>
                      ብር {Number(log.total_cost_etb).toLocaleString()}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
