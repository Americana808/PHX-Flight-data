import { useState, useEffect, useCallback } from 'react'

// Derive status from scheduled vs actual time
function deriveStatus(scheduled, actual) {
  if (!actual || actual === scheduled) return 'ontime'
  return 'delayed'
}

// Parse time string to minutes for comparison
function parseTime(t) {
  if (!t) return 0
  const [time, period] = t.split(' ')
  const [h, m] = time.split(':').map(Number)
  return (period === 'PM' && h !== 12 ? h + 12 : h === 12 && period === 'AM' ? 0 : h) * 60 + m
}

function timeAgo(timestamp) {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

// ─── Theme definitions (mirroring the design file) ───────────────────────────

const THEMES = {
  dark: {
    page:         'oklch(0.105 0.005 80)',
    pageText:     'oklch(0.9 0.03 80)',
    dashed:       'oklch(0.25 0.015 80)',
    accent:       'oklch(0.78 0.15 70)',
    accentInk:    'oklch(0.15 0.01 80)',
    chipMute:     'oklch(0.6 0.04 80)',
    headerLabel:  '#f3e6c4',
    headerSub:    'oklch(0.6 0.04 80)',
    clockNum:     '#f3e6c4',
    metaLabel:    'oklch(0.55 0.04 80)',
    tileBg:       'oklch(0.18 0.012 80)',
    tileBgAlt:    'oklch(0.16 0.012 80)',
    tileTopHi:    'oklch(0.25 0.015 80)',
    tileBotShade: 'oklch(0.08 0.005 80)',
    tileHair:     'oklch(0.08 0.005 80)',
    tileHairOp:   0.9,
    tileCode:     '#f5dca0',
    tileCity:     '#f0e8d5',
    tileMeta:     '#e8dcbb',
    tileTitle:    '#f3e6c4',
    headStrip:    'oklch(0.22 0.015 70)',
    headStripIn:  'oklch(0.7 0.06 70)',
    rowA:         'oklch(0.155 0.008 80)',
    rowB:         'oklch(0.135 0.008 80)',
    rowSep:       'oklch(0.1 0.005 80)',
    shadow:       '0 30px 60px -30px oklch(0 0 0 / 0.6)',
    on:           'oklch(0.78 0.18 145)',
    onGlow:       '0 0 8px oklch(0.78 0.18 145)',
    boarding:     'oklch(0.78 0.15 240)',
    delay:        'oklch(0.78 0.15 60)',
    foot:         'oklch(0.5 0.03 80)',
    toggleBg:     'oklch(0.22 0.015 80)',
    toggleColor:  'oklch(0.7 0.04 80)',
  },
  light: {
    page:         'oklch(0.965 0.012 80)',
    pageText:     'oklch(0.25 0.015 60)',
    dashed:       'oklch(0.82 0.018 70)',
    accent:       'oklch(0.6 0.16 50)',
    accentInk:    'oklch(0.98 0.01 80)',
    chipMute:     'oklch(0.5 0.02 60)',
    headerLabel:  'oklch(0.2 0.015 60)',
    headerSub:    'oklch(0.5 0.02 60)',
    clockNum:     'oklch(0.2 0.015 60)',
    metaLabel:    'oklch(0.5 0.02 60)',
    tileBg:       'oklch(0.92 0.018 75)',
    tileBgAlt:    'oklch(0.89 0.022 75)',
    tileTopHi:    'oklch(0.98 0.012 80)',
    tileBotShade: 'oklch(0.78 0.025 70)',
    tileHair:     'oklch(0.7 0.025 70)',
    tileHairOp:   0.55,
    tileCode:     'oklch(0.18 0.015 60)',
    tileCity:     'oklch(0.22 0.018 60)',
    tileMeta:     'oklch(0.32 0.018 60)',
    tileTitle:    'oklch(0.18 0.015 60)',
    headStrip:    'oklch(0.88 0.018 75)',
    headStripIn:  'oklch(0.4 0.02 60)',
    rowA:         'oklch(0.95 0.013 78)',
    rowB:         'oklch(0.925 0.015 78)',
    rowSep:       'oklch(0.85 0.018 70)',
    shadow:       '0 30px 60px -32px oklch(0.4 0.03 60 / 0.2), 0 2px 0 oklch(0.85 0.02 70)',
    on:           'oklch(0.55 0.15 155)',
    onGlow:       'none',
    boarding:     'oklch(0.5 0.17 245)',
    delay:        'oklch(0.55 0.18 40)',
    foot:         'oklch(0.5 0.02 60)',
    toggleBg:     'oklch(0.88 0.018 75)',
    toggleColor:  'oklch(0.45 0.02 60)',
  },
}

// ─── Flap tile component ──────────────────────────────────────────────────────

function Flaps({ text, size = 22, color, weight = 600, alt = false, t }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, fontFamily: '"JetBrains Mono", monospace' }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            position: 'relative',
            width: ch === ' ' ? size * 0.4 : size * 0.72,
            height: size * 1.15,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: ch === ' ' ? 'transparent' : (alt ? t.tileBgAlt : t.tileBg),
            color: color || t.tileCity,
            fontWeight: weight,
            fontSize: size,
            borderRadius: 3,
            boxShadow: ch === ' ' ? 'none'
              : `inset 0 1px 0 ${t.tileTopHi}, 0 1px 0 ${t.tileBotShade}`,
          }}
        >
          {ch}
          {ch !== ' ' && (
            <span style={{
              position: 'absolute', left: 2, right: 2, top: '50%',
              height: 1,
              background: t.tileHair,
              opacity: t.tileHairOp,
            }} />
          )}
        </span>
      ))}
    </span>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function Status({ status, actual, t }) {
  if (status === 'ontime') return (
    <span style={{ fontSize: 13, letterSpacing: '0.12em', color: t.on, textShadow: t.onGlow }}>
      ● ON TIME
    </span>
  )
  if (status === 'boarding') return (
    <span style={{ fontSize: 13, letterSpacing: '0.12em', color: t.boarding }}>
      ● BOARDING
    </span>
  )
  return (
    <span style={{ fontSize: 13, letterSpacing: '0.1em', color: t.delay }}>
      ● DELAYED&nbsp;&nbsp;{actual}
    </span>
  )
}

// ─── Scrape button ────────────────────────────────────────────────────────────

function ScrapeButton({ onClick, scraping, t }) {
  return (
    <button
      onClick={onClick}
      disabled={scraping}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 6,
        background: t.accent,
        color: t.accentInk,
        border: 'none',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.1em',
        cursor: scraping ? 'not-allowed' : 'pointer',
        opacity: scraping ? 0.65 : 1,
        fontFamily: '"JetBrains Mono", monospace',
        transition: 'opacity 0.15s',
      }}
    >
      {scraping ? (
        <>
          <svg style={{ animation: 'spin 1s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          SCRAPING...
        </>
      ) : (
        <>⟳ REFRESH DATA</>
      )}
    </button>
  )
}

// ─── Main board ───────────────────────────────────────────────────────────────

export default function FlightBoard() {
  const [flights, setFlights]       = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [scraping, setScraping]     = useState(false)
  const [error, setError]           = useState(null)
  const [theme, setTheme]           = useState('dark')
  const [tick, setTick]             = useState(0)

  const t = THEMES[theme]

  const fetchFlights = useCallback(async () => {
    try {
      const res = await fetch('/api/flights')
      if (!res.ok) throw new Error('Failed to fetch flights')
      const data = await res.json()
      setFlights(data.flights)
      setLastUpdated(data.last_updated)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFlights()
    const interval = setInterval(fetchFlights, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchFlights])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(t)
  }, [])

  const handleScrape = async () => {
    setScraping(true)
    setError(null)
    try {
      const res = await fetch('/api/scrape', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scrape failed')
      setFlights(data.flights)
      setLastUpdated(data.last_updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setScraping(false)
    }
  }

  // Normalize API data to board format
  const boardFlights = flights.map(f => ({
    code:      f.city,
    scheduled: f.time,
    gate:      f.gate,
    status:    deriveStatus(f.time, f.actual),
    actual:    f.actual,
    flight:    f.flight || null,
  }))

  const now = new Date()
  const clock = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: t.page,
      color: t.pageText,
      fontFamily: '"JetBrains Mono", monospace',
      padding: '32px 48px',
      boxSizing: 'border-box',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Top bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
          borderBottom: `1px dashed ${t.dashed}`,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              display: 'grid', placeItems: 'center',
              background: t.accent, color: t.accentInk,
              fontSize: 18, fontWeight: 700,
            }}>◆</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', color: t.headerLabel }}>
                PHX · SKY HARBOR
              </div>
              <div style={{ marginTop: 3, fontSize: 11, color: t.headerSub, letterSpacing: '0.12em' }}>
                TERMINAL 4 · GATES A22–A30
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Clock */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: t.metaLabel }}>LOCAL · MST</div>
              <div style={{ marginTop: 4, fontSize: 22, color: t.clockNum, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {clock.replace(':', ' : ')}
              </div>
            </div>
            {/* Last updated */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: t.metaLabel }}>UPDATED</div>
              <div style={{ marginTop: 4, fontSize: 14, color: t.accent, letterSpacing: '0.1em' }}>
                {lastUpdated ? timeAgo(lastUpdated).toUpperCase() : '—'}
              </div>
            </div>
            {/* Scrape button */}
            <ScrapeButton onClick={handleScrape} scraping={scraping} t={t} />
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              style={{
                background: t.toggleBg,
                color: t.toggleColor,
                border: 'none',
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 16,
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              {theme === 'dark' ? '☀' : '◑'}
            </button>
          </div>
        </div>

        {/* ── Board title ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 28, marginBottom: 18 }}>
          <Flaps text="DEPARTURES" size={42} weight={700} color={t.tileTitle} t={t} />
          <span style={{ color: t.chipMute, fontSize: 14, letterSpacing: '0.15em' }}>
            · {boardFlights.length} FLIGHTS
          </span>
          <div style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11,
            letterSpacing: '0.2em',
            color: t.on,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: t.on, boxShadow: t.onGlow,
            }} />
            LIVE
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{
            marginBottom: 16,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'oklch(0.25 0.06 20)',
            border: '1px solid oklch(0.4 0.1 20)',
            color: 'oklch(0.78 0.12 30)',
            fontSize: 13,
            letterSpacing: '0.05em',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Column headers ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          background: t.headStrip,
          color: t.headStripIn,
          fontSize: 11,
          letterSpacing: '0.18em',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{ flex: 1 }}>GATE</div>
          <div style={{ flex: 1 }}>TIME</div>
          <div style={{ flex: 1 }}>DESTINATION</div>
          <div style={{ flex: 1 }}>STATUS</div>
          <div style={{ flex: 1, textAlign: 'right' }}>FLIGHT</div>
        </div>

        {/* ── Rows ── */}
        <div style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', boxShadow: t.shadow }}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '60px 20px',
              background: t.rowA,
              color: t.chipMute,
              fontSize: 14,
              letterSpacing: '0.12em',
            }}>
              <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              LOADING FLIGHTS...
            </div>
          ) : boardFlights.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: t.rowA,
              color: t.chipMute,
              fontSize: 13,
              letterSpacing: '0.12em',
            }}>
              NO FLIGHT DATA AVAILABLE
            </div>
          ) : (
            boardFlights.map((fl, i) => (
              <div
                key={`${fl.code}-${fl.scheduled}-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: i % 2 === 0 ? t.rowA : t.rowB,
                  borderTop: `1px solid ${t.rowSep}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <Flaps text={fl.gate} size={15} color={t.tileMeta} weight={500} alt={i % 2 === 1} t={t} />
                </div>
                <div style={{ flex: 1 }}>
                  <Flaps text={fl.scheduled.replace(' ', '')} size={15} color={t.tileMeta} weight={500} alt={i % 2 === 1} t={t} />
                </div>
                <div style={{ flex: 1 }}>
                  <Flaps text={fl.code} size={20} weight={700} color={t.tileCode} alt={i % 2 === 1} t={t} />
                </div>
                <div style={{ flex: 1 }}>
                  <Status status={fl.status} actual={fl.actual} t={t} />
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  {fl.flight ? (
                    <a
                      href={`https://www.google.com/search?q=AA+flight+${fl.flight}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Flaps text={`AA${fl.flight}`} size={15} color={t.accent} weight={600} alt={i % 2 === 1} t={t} />
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: t.foot, letterSpacing: '0.08em' }}>—</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          letterSpacing: '0.15em',
          color: t.foot,
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <span>◇ {boardFlights.length} flights · gates A22–A30</span>
          <span>Auto-refresh ⟳ 30 min</span>
        </div>

      </div>
    </div>
  )
}
