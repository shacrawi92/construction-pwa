import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { materialsApi } from '@/api/projects.api'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function MaterialList() {
  const { t } = useTranslation()
  const [lowStock, setLowStock] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['materials', search, lowStock],
    queryFn: () => materialsApi.list({ search, low_stock: lowStock ? 1 : undefined }),
  })

  const materials = data?.data ?? []

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('material.title')}</h1>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input className="input" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <button
          className={`btn btn-sm ${lowStock ? 'btn-danger' : 'btn-ghost'}`}
          onClick={() => setLowStock(v => !v)}
        >
          <AlertTriangle size={15} /> Low Stock
        </button>
      </div>

      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: '0.5rem' }} />)
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('material.title')}</th>
                  <th>SKU</th>
                  <th style={{ textAlign: 'right' }}>{t('material.stock')}</th>
                  <th style={{ textAlign: 'right' }}>Unit Cost (ብር)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {materials.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.no_data')}</td></tr>
                  : materials.map((m: any) => (
                    <tr key={m.id}>
                      <td>
                        <p style={{ fontWeight: 600 }}>{m.name_en}</p>
                        {m.name_am && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.name_am}</p>}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.sku ?? '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: m.is_low_stock ? 'var(--red)' : 'var(--text-primary)' }}>
                        {m.stock_qty} {m.unit}
                      </td>
                      <td style={{ textAlign: 'right' }}>{Number(m.unit_cost_etb).toLocaleString()}</td>
                      <td>
                        {m.is_low_stock
                          ? <span className="badge badge-red"><AlertTriangle size={10} /> {t('material.low_stock')}</span>
                          : <span className="badge badge-green">In Stock</span>
                        }
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
