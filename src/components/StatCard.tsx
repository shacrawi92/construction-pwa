import React from 'react'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  color?: 'amber' | 'green' | 'red' | 'blue' | 'purple'
}

const COLOR_MAP: Record<string, string> = {
  amber:  'var(--accent)',
  green:  'var(--green)',
  red:    'var(--red)',
  blue:   'var(--blue)',
  purple: 'var(--purple)',
}

export default function StatCard({ label, value, sub, icon, color = 'amber' }: Props) {
  const c = COLOR_MAP[color]
  return (
    <div className="stat-card">
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value" style={{ color: c }}>{value}</span>
      {sub  && <span className="stat-card__sub">{sub}</span>}
      {icon && <span className="stat-card__icon" style={{ color: c }}>{icon}</span>}
    </div>
  )
}
