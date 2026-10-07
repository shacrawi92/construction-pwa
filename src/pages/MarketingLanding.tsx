import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Building2, Calculator, ShieldCheck, WifiOff, Globe, 
  TrendingUp, Layers, CheckCircle2, ArrowRight, Sparkles, 
  Download, Users, HardHat, FileSpreadsheet, Server, 
  ChevronDown, ChevronUp, Clock, Check, BarChart3, Package,
  Menu, X, Briefcase
} from 'lucide-react'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { useAuthStore } from '@/store/auth.store'

export default function MarketingLanding() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated } = useAuthStore()

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Interactive Estimation Calculator State
  const [calcType, setCalcType] = useState<'villa' | 'commercial' | 'renovation'>('villa')
  const [calcArea, setCalcArea] = useState<number>(250)
  const [calcQuality, setCalcQuality] = useState<'standard' | 'premium' | 'luxury'>('premium')
  const [contingency, setContingency] = useState<number>(7.5)

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Pricing Toggle (Monthly vs Annual)
  const [annualBilling, setAnnualBilling] = useState(true)

  // Calculate live estimate in ETB
  const baseRatePerM2 = {
    villa: { standard: 18500, premium: 26000, luxury: 38000 },
    commercial: { standard: 22000, premium: 31000, luxury: 46000 },
    renovation: { standard: 9500, premium: 14500, luxury: 22000 },
  }[calcType][calcQuality]

  const subtotal = calcArea * baseRatePerM2
  const contingencyAmt = Math.round(subtotal * (contingency / 100))
  const totalEstimated = subtotal + contingencyAmt

  const civilWork = Math.round(subtotal * 0.45)
  const finishingWork = Math.round(subtotal * 0.30)
  const electricalPlumbing = Math.round(subtotal * 0.18)
  const siteLabor = Math.round(subtotal * 0.07)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* ── Top Navbar ────────────────────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.6rem' }}>🌅</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Sunset <span className="text-gradient">Construction</span>
            </span>
            <span className="badge badge-sunset" style={{ fontSize: '0.65rem' }}>Field PWA</span>
          </Link>

          <nav className="landing-nav__links">
            <a href="#features" className="landing-nav__link">{t('nav.features')}</a>
            <a href="#calculator" className="landing-nav__link">{t('nav.calculator')}</a>
            <a href="#architecture" className="landing-nav__link">Workflow</a>
            <a href="#pricing" className="landing-nav__link">{t('nav.pricing')}</a>
            <a href="#faq" className="landing-nav__link">FAQ</a>
          </nav>

          <div className="landing-nav__desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LocaleSwitcher />
            <Link
              to={isAuthenticated ? "/projects" : "/login"}
              className="btn btn-sunset btn-sm"
            >
              {isAuthenticated ? t('nav.dashboard') : t('auth.login')} <ArrowRight size={14} />
            </Link>
          </div>

          <button
            className="landing-nav__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="landing-nav__mobile-menu">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>{t('nav.features')}</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>{t('nav.calculator')}</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)}>Workflow</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to={isAuthenticated ? "/projects" : "/login"} className="btn btn-sunset btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                {isAuthenticated ? t('nav.dashboard') : t('auth.login')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            <Sparkles size={14} /> Field Operations Platform for Construction Companies
          </div>

          <h1 className="hero-title">
            Estimate, Budget & Manage <br />
            <span className="text-gradient">Every Site in Real-Time</span>
          </h1>

          <p className="hero-desc">
            Sunset gives each construction company their own management portal, while field foremen and workers get a fast offline-first mobile PWA in <strong>English, አማርኛ, and Soomaali</strong>.
          </p>

          {/* Two clear portals */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(21,30,52,0.85)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', maxWidth: 260, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏗️</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Company Admin Portal</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Manage projects, BOQs, budgets, materials, workers &amp; reports for your company.
              </p>
              <a
                href="https://admin.shacrawi.com/admin"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sunset btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Briefcase size={14} /> Company Admin →
              </a>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Login: admin@yourcompany.com</p>
            </div>

            <div style={{ background: 'rgba(21,30,52,0.85)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem', maxWidth: 260, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👷</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Field Operations PWA</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Daily labor logs, material requests, offline sync — for foremen &amp; workers on site.
              </p>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)' }}
              >
                <HardHat size={14} color="var(--sunset-amber)" /> Foreman / Worker →
              </Link>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Login: foreman@yourcompany.com</p>
            </div>
          </div>

          <a href="#calculator" className="btn btn-outline-sunset btn-sm" style={{ marginBottom: '2rem' }}>
            <Calculator size={16} /> Try Live Cost Estimator
          </a>

          {/* Quick Pillars */}
          <div className="grid-4" style={{ textAlign: 'left', marginTop: '1rem' }}>
            {[
              { icon: <Calculator size={20} />, title: 'BOQ Estimating Engine', desc: 'Pre-built work type unit rates with automated contingency calculations.' },
              { icon: <WifiOff size={20} />, title: 'Offline-First Field PWA', desc: 'Foremen log labor and request materials with zero internet connectivity.' },
              { icon: <Globe size={20} />, title: 'Trilingual Localized', desc: 'Native support for English, Amharic (አማርኛ), and Somali (Soomaali).' },
              { icon: <Server size={20} />, title: 'Multi-Tenant Subdomains', desc: 'Secure database isolation per customer company with role-based access.' },
            ].map((p, i) => (
              <div key={i} className="card card--hover" style={{ padding: '1.25rem', background: 'rgba(21, 30, 52, 0.6)' }}>
                <div style={{ color: 'var(--sunset-orange)', marginBottom: '0.6rem' }}>{p.icon}</div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{p.title}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Live Estimation Calculator ────────────── */}
      <section id="calculator" style={{ padding: '4rem 1.25rem', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-sunset" style={{ marginBottom: '0.5rem' }}>Interactive Demo</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Live Construction <span className="text-gradient">Cost Estimator</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0.5rem auto 0' }}>
              Adjust parameters below to see how Sunset calculates multi-level BOQs with contingency allocations in Ethiopian Birr (ETB).
            </p>
          </div>

          <div className="calculator-grid" style={{ alignItems: 'stretch' }}>
            {/* Input Controls */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sunset-amber)' }}>
                1. Project Parameters
              </h3>

              <div className="form-group">
                <label className="label">Structure Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'villa', label: '🏡 Residential Villa' },
                    { id: 'commercial', label: '🏢 Commercial Plaza' },
                    { id: 'renovation', label: '🔨 Renovation / Fitout' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`btn btn-sm ${calcType === t.id ? 'btn-sunset' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.5rem 0.25rem', fontSize: '0.75rem' }}
                      onClick={() => setCalcType(t.id as any)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label">Total Built Area (m²)</label>
                  <span style={{ fontWeight: 800, color: 'var(--sunset-orange)' }}>{calcArea} m²</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={25}
                  value={calcArea}
                  onChange={e => setCalcArea(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--sunset-orange)' }}
                />
              </div>

              <div className="form-group">
                <label className="label">Finishing Grade</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'standard', label: '🧱 Standard' },
                    { id: 'premium', label: '✨ Premium' },
                    { id: 'luxury', label: '👑 Luxury' },
                  ].map(q => (
                    <button
                      key={q.id}
                      type="button"
                      className={`btn btn-sm ${calcQuality === q.id ? 'btn-sunset' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '0.5rem 0.25rem', fontSize: '0.75rem' }}
                      onClick={() => setCalcQuality(q.id as any)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="label">Contingency Buffer</label>
                  <span style={{ fontWeight: 800, color: 'var(--sunset-orange)' }}>{contingency}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={2.5}
                  value={contingency}
                  onChange={e => setContingency(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--sunset-orange)' }}
                />
              </div>
            </div>

            {/* Live Calculation Output */}
            <div className="card card-glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', background: 'linear-gradient(145deg, var(--bg-card) 0%, #1a2542 100%)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--sunset-orange)' }}>
                    2. Instant Cost Breakdown
                  </h3>
                  <span className="badge badge-sunset">ETB / ብር</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { label: 'Civil & Structural Works (45%)', value: civilWork, color: 'var(--sunset-orange)' },
                    { label: 'Architectural & Finishing (30%)', value: finishingWork, color: 'var(--sunset-amber)' },
                    { label: 'MEP (Electrical & Plumbing) (18%)', value: electricalPlumbing, color: 'var(--sunset-rose)' },
                    { label: 'Site Labor & Supervision (7%)', value: siteLabor, color: 'var(--sunset-violet)' },
                    { label: `Contingency Reserve (${contingency}%)`, value: contingencyAmt, color: 'var(--text-secondary)' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                      <strong style={{ fontSize: '0.9rem', color: item.color }}>
                        ብር {item.value.toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    Total Estimated Cost
                  </span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sunset-orange)' }}>
                    ብር {totalEstimated.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to="/login"
                    className="btn btn-sunset btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Open in Field BOQ Engine <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Deep Dive ─────────────────────────────────── */}
      <section id="features" style={{ padding: '5rem 1.25rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-sunset" style={{ marginBottom: '0.5rem' }}>Core Modules</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Engineered for Every Stage of <span className="text-gradient">Construction</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 650, margin: '0.5rem auto 0' }}>
              From initial bidding to on-site execution, Sunset SaaS connects your office headquarters directly to field crews.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Calculator size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Precision BOQ & Estimation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Create multi-level Bills of Quantities using pre-configured unit rates for Civil, Electrical, Plumbing, and Finishing. Clone reusable templates with 1-click and export branded PDF/Excel reports.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Dynamic contingency buffering</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Multi-stage revision and approval tracking</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Export ready-to-print quotation PDFs</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box" style={{ color: 'var(--sunset-amber)' }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Budget & Burn-Rate Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Allocate budgets across Labour, Materials, Equipment, and Overhead. Track daily financial burn rates and compare estimated budgets vs. actual spending in real-time.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Debit/credit transaction audit ledger</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Visual budget variance progress bars</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Rolling 30-day spend velocity metrics</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box" style={{ color: 'var(--blue)' }}>
                <Package size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Material Supply Chain & Approvals</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Maintain a live inventory catalog with automated low-stock warnings. Foremen request materials directly from the field, and managers approve with instant stock deduction.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> 1-Click approval with unit cost lock-in</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Real-time WebSocket notifications to foremen</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Low-stock reorder thresholds alerts</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box" style={{ color: 'var(--green)' }}>
                <WifiOff size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Offline-First Field Worker PWA</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Job sites rarely have stable internet. Our installable Progressive Web App (PWA) operates 100% offline with IndexedDB mutation queues, automatically syncing when connected.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Installable on Android, iOS, and Tablets</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Offline labor logging & daily rate computations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Seamless background replay on reconnect</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box" style={{ color: 'var(--sunset-rose)' }}>
                <Globe size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Trilingual Localization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Every screen, material name, and report is natively localized for <strong>English</strong>, <strong>Amharic (አማርኛ)</strong>, and <strong>Somali (Soomaali)</strong> with instant language switching.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Noto Sans Ethiopic typography</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Ethiopian Birr currency natively formatted</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Timezone: Africa/Addis_Ababa</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box" style={{ color: 'var(--purple)' }}>
                <Server size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Subdomain Multi-Tenant SaaS</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Each construction company receives its own isolated subdomain (e.g. <code>acme.sunset.app</code>) with a dedicated database schema, preventing cross-tenant data leakage.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Stancl Tenancy v3 integration</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Granular Spatie RBAC (Admin/Foreman/Worker)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={14} color="var(--green)" /> Ready for cPanel & Cloud deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflow Architecture Section ─────────────────────── */}
      <section id="architecture" style={{ padding: '4rem 1.25rem', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-sunset" style={{ marginBottom: '0.5rem' }}>Full Lifecycle</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              How Sunset Connects <span className="text-gradient">Office to Field</span>
            </h2>
          </div>

          <div className="grid-4" style={{ position: 'relative' }}>
            {[
              { step: '01', title: 'Plan & Estimate', desc: 'Create project scope, apply templates, and compute total cost with contingency in ETB.' },
              { step: '02', title: 'Allocate Budgets', desc: 'Distribute funds into category envelopes (Labour, Materials, Equipment) and set reorder levels.' },
              { step: '03', title: 'Execute on Site', desc: 'Site foremen log daily labor hours and request materials in real-time via the PWA (online or offline).' },
              { step: '04', title: 'Approve & Audit', desc: 'HQ approves requests, tracks burn rates, and generates audit reports for executive stakeholders.' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', borderTop: '3px solid var(--sunset-orange)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--sunset-orange)', opacity: 0.6 }}>{s.step}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0' }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SaaS Multi-Tenant Pricing ──────────────────────────── */}
      <section id="pricing" style={{ padding: '5rem 1.25rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-sunset" style={{ marginBottom: '0.5rem' }}>SaaS Plans</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Transparent Pricing for <span className="text-gradient">Every Contractor</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0.5rem auto 1.5rem' }}>
              Scale from single local projects to enterprise construction portfolios with isolated company subdomains.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.4rem 0.85rem', borderRadius: '99px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: !annualBilling ? 'var(--sunset-orange)' : 'var(--text-muted)' }}>Monthly</span>
              <button
                type="button"
                onClick={() => setAnnualBilling(v => !v)}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: annualBilling ? 'var(--sunset-orange)' : 'var(--border)',
                  border: 'none', position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, left: annualBilling ? 23 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: annualBilling ? 'var(--sunset-orange)' : 'var(--text-muted)' }}>
                Annual <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Save 20%</span>
              </span>
            </div>
          </div>

          <div className="pricing-grid">
            {/* Starter */}
            <div className="pricing-card">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Starter Builder</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>For independent contractors & estimators</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900 }}>ብር {annualBilling ? '3,200' : '4,000'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Up to 3 Active Projects</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Full BOQ Estimation Engine</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> 2 Foreman Field Accounts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Offline PWA Access</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Standard PDF Export</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <Link to="/login" className="btn btn-ghost" style={{ width: '100%' }}>Get Started</Link>
              </div>
            </div>

            {/* Pro */}
            <div className="pricing-card pricing-card--popular">
              <span className="pricing-popular-tag">Most Popular</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sunset-amber)' }}>Pro Construction SaaS</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>For established general contractors</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--sunset-orange)' }}>
                  ብር {annualBilling ? '7,800' : '9,750'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/ month</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Unlimited Active Projects</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Custom Subdomain (<code>company.sunset.app</code>)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Up to 15 Foreman & Worker Logins</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Material Request Workflow with WebSocket Alerts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Budget Burn Rate & Analytics Charts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Excel & PDF Export with Company Logo</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <Link to="/login" className="btn btn-sunset" style={{ width: '100%' }}>Start 14-Day Free Trial</Link>
              </div>
            </div>

            {/* Enterprise */}
            <div className="pricing-card">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Enterprise Builder</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>For large construction firms & developers</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900 }}>Custom</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Custom Dedicated Domain & Branding</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Unlimited Users, Foremen & Subcontractors</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Dedicated Database & High-Availability Hosting</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Custom ERP & Accounting Integrations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={15} color="var(--green)" /> Dedicated Account Manager & SLA Support</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <a href="mailto:sales@sunsetconstruction.local" className="btn btn-ghost" style={{ width: '100%' }}>Contact Sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '4rem 1.25rem', background: 'var(--bg-surface)' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-sunset" style={{ marginBottom: '0.5rem' }}>Got Questions?</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                q: 'How does offline labor logging work when on site?',
                a: 'The Sunset Field PWA uses a local IndexedDB cache and Workbox service worker. When foremen log daily hours or request materials without internet, entries are stored securely on the device and automatically synchronized with the server as soon as connectivity is restored.'
              },
              {
                q: 'Can each company get their own subdomain?',
                a: 'Yes! Sunset is built on a multi-tenant SaaS architecture. Each customer can have their own isolated company subdomain (e.g. acme.constructapp.local) with their own database schema, users, and branding.'
              },
              {
                q: 'What languages are supported?',
                a: 'Sunset natively supports English, Amharic (አማርኛ), and Somali (Soomaali). Users can switch languages instantly with one click from the top navigation bar.'
              },
              {
                q: 'Can we deploy Sunset on cPanel or local servers?',
                a: 'Yes! Sunset is built with standard Laravel 11 and React + Vite. It runs smoothly on local XAMPP/MariaDB environments and can be deployed directly to standard cPanel hosting with MySQL/MariaDB and Apache.'
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{faq.q}</h4>
                  {openFaq === i ? <ChevronUp size={18} color="var(--sunset-orange)" /> : <ChevronDown size={18} />}
                </div>
                {openFaq === i && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1.25rem', textAlign: 'center', background: 'var(--sunset-grad-subtle)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container-sm">
          <span style={{ fontSize: '2.5rem' }}>🌅</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.75rem 0' }}>
            Ready to Transform Your Construction Workflow?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
            Empower job-site foremen and field crews with real-time daily logs, material requests, and multi-lingual offline sync.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-sunset btn-lg">
              Sign In to Field PWA
            </Link>
            <a href="#calculator" className="btn btn-ghost btn-lg">
              Try Live Estimator
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ padding: '3rem 1.25rem 2rem', background: 'var(--bg-base)', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🌅</span>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Sunset Construction SaaS</strong>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Next-Gen Construction Estimating, Budgeting & Field Management Platform
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#features" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#calculator" style={{ color: 'var(--text-muted)' }}>Estimator</a>
            <a href="#pricing" style={{ color: 'var(--text-muted)' }}>Pricing</a>
            <Link to="/login" style={{ color: 'var(--sunset-orange)' }}>Field PWA Login</Link>
          </div>
        </div>

        <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.775rem' }}>
          <span>© {new Date().getFullYear()} Sunset Construction SaaS. All rights reserved.</span>
          <span>Currency: Ethiopian Birr (ETB) · Timezone: Africa/Addis_Ababa</span>
        </div>
      </footer>
    </div>
  )
}
