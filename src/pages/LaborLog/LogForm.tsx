import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { laborLogsApi, projectsApi, workTypesApi } from '@/api/projects.api'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useSyncStore } from '@/store/sync.store'
import { format } from 'date-fns'

export default function LogForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user } = useAuthStore()
  const isOnline = useSyncStore(s => s.isOnline)
  const enqueue  = useSyncStore(s => s.enqueue)
  const qc = useQueryClient()

  const [form, setForm] = useState({
    project_id:     params.get('project') ?? '',
    worker_name:    '',
    work_type_id:   '',
    log_date:       format(new Date(), 'yyyy-MM-dd'),
    hours_worked:   '8',
    daily_rate_etb: '',
    notes:          '',
  })
  const [loading, setLoading] = useState(false)

  const { data: projects }  = useQuery({ queryKey: ['projects', 'list'], queryFn: () => projectsApi.list({ per_page: 100 }) })
  const { data: workTypes } = useQuery({ queryKey: ['work-types'], queryFn: workTypesApi.list })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const totalPreview = form.hours_worked && form.daily_rate_etb
    ? ((parseFloat(form.hours_worked) / 8) * parseFloat(form.daily_rate_etb)).toFixed(2)
    : '0.00'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, work_type_id: form.work_type_id || undefined }

    if (!isOnline) {
      await enqueue({ url: `/api/projects/${form.project_id}/labor-logs`, method: 'POST', body })
      alert('Saved offline — will sync when connected.')
      navigate('/logs')
      return
    }

    try {
      await laborLogsApi.create(Number(form.project_id), body)
      qc.invalidateQueries({ queryKey: ['labor-logs'] })
      navigate('/logs')
    } catch { alert('Failed to save log.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '0.75rem' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="page-title">{t('labor.new')}</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="label">Project</label>
            <select className="select" value={form.project_id} onChange={e => set('project_id', e.target.value)} required>
              <option value="">Select project…</option>
              {(projects?.data ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="label">{t('labor.worker')}</label>
            <input className="input" value={form.worker_name} onChange={e => set('worker_name', e.target.value)} placeholder="Full name" required />
          </div>

          <div className="form-group">
            <label className="label">{t('labor.work_type')}</label>
            <select className="select" value={form.work_type_id} onChange={e => set('work_type_id', e.target.value)}>
              <option value="">None</option>
              {(workTypes ?? []).map((w: any) => <option key={w.id} value={w.id}>{w.name_en}</option>)}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="label">{t('labor.date')}</label>
              <input className="input" type="date" value={form.log_date} onChange={e => set('log_date', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">{t('labor.hours')}</label>
              <input className="input" type="number" step="0.5" min="0.5" max="24" value={form.hours_worked} onChange={e => set('hours_worked', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('labor.rate')}</label>
            <input className="input" type="number" step="1" min="0" value={form.daily_rate_etb} onChange={e => set('daily_rate_etb', e.target.value)} placeholder="e.g. 500" required />
          </div>

          {/* Cost preview */}
          <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estimated Cost</span>
            <strong style={{ color: 'var(--accent)' }}>ብር {Number(totalPreview).toLocaleString()}</strong>
          </div>

          <div className="form-group">
            <label className="label">Notes</label>
            <textarea className="input textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
          <Save size={16} /> {loading ? 'Saving…' : t('common.save')}
        </button>
      </form>
    </div>
  )
}
