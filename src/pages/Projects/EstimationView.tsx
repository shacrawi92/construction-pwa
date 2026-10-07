import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { estimationsApi, projectsApi } from '@/api/projects.api'
import { ArrowLeft, Download, CheckCircle, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function EstimationView() {
  const { projectId, id } = useParams<{ projectId: string; id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: estimation, isLoading } = useQuery({
    queryKey: ['estimation', id],
    queryFn: () => estimationsApi.get(Number(id)),
  })

  const approveMutation = useMutation({
    mutationFn: () => estimationsApi.approve(Number(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['estimation', id] }),
  })

  const downloadPdf = async () => {
    const blob = await estimationsApi.exportPdf(Number(id))
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `estimation-${id}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadExcel = async () => {
    const blob = await estimationsApi.exportExcel(Number(id))
    const url  = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `estimation-${id}.xlsx`; a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>
  if (!estimation) return <div className="page"><p>Not found.</p></div>

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/projects/${projectId}`)} style={{ marginBottom: '0.75rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{estimation.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{estimation.project?.name} · {estimation.project?.code}</p>
        </div>
        <span className={`badge ${estimation.status === 'approved' ? 'badge-green' : 'badge-amber'}`}>{estimation.status}</span>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {estimation.status === 'draft' && (
          <button className="btn btn-primary btn-sm" onClick={() => approveMutation.mutate()}>
            <CheckCircle size={15} /> {t('estimation.approve')}
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={downloadPdf}><Download size={15} /> PDF</button>
        <button className="btn btn-ghost btn-sm" onClick={downloadExcel}><Download size={15} /> Excel</button>
      </div>

      {/* Items table */}
      <div className="table-wrap" style={{ marginBottom: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price (ብር)</th>
              <th style={{ textAlign: 'right' }}>Total (ብር)</th>
            </tr>
          </thead>
          <tbody>
            {estimation.items?.map((item: any) => (
              <tr key={item.id}>
                <td>
                  <p style={{ fontWeight: 600 }}>{item.description}</p>
                  {item.work_type && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.work_type.name_en}</p>}
                </td>
                <td>{item.unit}</td>
                <td style={{ textAlign: 'right' }}>{Number(item.qty).toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{Number(item.unit_price_etb).toLocaleString()}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{Number(item.total_etb).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="card">
        {[
          ['Subtotal',     `ብር ${Number(estimation.subtotal_etb).toLocaleString()}`],
          [`Contingency (${estimation.contingency_pct}%)`, `ብር ${Number(estimation.contingency_etb).toLocaleString()}`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0', fontSize: '1.1rem', fontWeight: 800 }}>
          <span>TOTAL</span>
          <span style={{ color: 'var(--accent)' }}>ብር {Number(estimation.total_etb).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
