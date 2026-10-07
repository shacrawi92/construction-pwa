import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { materialsApi } from '@/api/projects.api'
import { ArrowLeft, Plus, Trash2, Send } from 'lucide-react'
import { useState } from 'react'
import { useSyncStore } from '@/store/sync.store'

interface RequestItem { materialId: number; name: string; unit: string; qty: string }

export default function RequestForm() {
  const { projectId } = useParams<{ projectId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const isOnline = useSyncStore(s => s.isOnline)
  const enqueue  = useSyncStore(s => s.enqueue)

  const [items, setItems]   = useState<RequestItem[]>([{ materialId: 0, name: '', unit: '', qty: '' }])
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: materials } = useQuery({
    queryKey: ['materials', 'all'],
    queryFn: () => materialsApi.list({ per_page: 200 }),
  })

  const matList = materials?.data ?? []

  const addItem    = () => setItems(i => [...i, { materialId: 0, name: '', unit: '', qty: '' }])
  const removeItem = (idx: number) => setItems(i => i.filter((_, j) => j !== idx))

  const updateItem = (idx: number, field: keyof RequestItem, val: string | number) => {
    setItems(items.map((item, j) => {
      if (j !== idx) return item
      if (field === 'materialId') {
        const mat = matList.find((m: any) => m.id === Number(val))
        return { ...item, materialId: Number(val), name: mat?.name_en ?? '', unit: mat?.unit ?? '' }
      }
      return { ...item, [field]: val }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      reason,
      items: items.filter(i => i.materialId).map(i => ({
        material_id: i.materialId,
        qty_requested: parseFloat(i.qty),
      })),
    }

    if (!isOnline) {
      await enqueue({ url: `/api/projects/${projectId}/material-requests`, method: 'POST', body })
      alert('Saved offline — will sync when connected.')
      navigate(`/projects/${projectId}`)
      return
    }

    try {
      await materialsApi.createRequest(Number(projectId), body)
      qc.invalidateQueries({ queryKey: ['materials'] })
      navigate(`/projects/${projectId}`)
    } catch { alert('Failed to submit request.') }
    finally { setLoading(false) }
  }

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '0.75rem' }}>
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="page-title">{t('material.request')}</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="label">Reason (optional)</label>
          <textarea className="textarea input" rows={2} value={reason} onChange={e => setReason(e.target.value)} />
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Item {idx + 1}</span>
              {items.length > 1 && (
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeItem(idx)}>
                  <Trash2 size={15} color="var(--red)" />
                </button>
              )}
            </div>
            <div className="form-group">
              <label className="label">Material</label>
              <select className="select" value={item.materialId} onChange={e => updateItem(idx, 'materialId', e.target.value)} required>
                <option value={0}>Select material…</option>
                {matList.map((m: any) => <option key={m.id} value={m.id}>{m.name_en} ({m.unit})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Quantity ({item.unit || '—'})</label>
              <input className="input" type="number" step="0.001" min="0.001" value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} required />
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-ghost" onClick={addItem}><Plus size={16} /> Add Item</button>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
          <Send size={16} /> {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}
