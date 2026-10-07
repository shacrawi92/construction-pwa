import { useAuthStore } from '@/store/auth.store'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { Globe } from 'lucide-react'

const LOCALES = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'am', label: 'አማ', native: 'አማርኛ' },
  { code: 'so', label: 'SO', native: 'Soomaali' },
] as const

export default function LocaleSwitcher() {
  const setLocale = useAuthStore(s => s.setLocale)
  const { i18n: i } = useTranslation()

  const change = async (code: 'en' | 'am' | 'so') => {
    await i18n.changeLanguage(code)
    setLocale(code).catch(() => {})
    localStorage.setItem('locale', code)
  }

  return (
    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
      <Globe size={14} color="var(--text-muted)" />
      {LOCALES.map(l => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          title={l.native}
          style={{
            background: i.language === l.code ? 'var(--accent-dim)' : 'transparent',
            border: i.language === l.code ? '1px solid var(--accent)' : '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            color: i.language === l.code ? 'var(--accent)' : 'var(--text-muted)',
            padding: '0.2rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
