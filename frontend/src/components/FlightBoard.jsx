import { useState, useEffect, useCallback } from 'react'

function deriveStatus(scheduled, actual) {
  if (!actual || actual === scheduled) return 'ontime'
  return 'delayed'
}

function timeAgo(timestamp) {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

// ─── Themes ──────────────────────────────────────────────────────────────────

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
    cardBorder:   'oklch(0.22 0.012 80)',
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
    cardBorder:   'oklch(0.85 0.018 70)',
  },
}

// ─── Flap tiles ───────────────────────────────────────────────────────────────

function Flaps({ text, size = 22, color, weight = 600, alt = false, t }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, fontFamily: '"JetBrains Mono", monospace' }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{
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
          boxShadow: ch === ' ' ? 'none' : `inset 0 1px 0 ${t.tileTopHi}, 0 1px 0 ${t.tileBotShade}`,
        }}>
          {ch}
          {ch !== ' ' && (
            <span style={{
              position: 'absolute', left: 2, right: 2, top: '50%',
              height: 1, background: t.tileHair, opacity: t.tileHairOp,
            }} />
          )}
        </span>
      ))}
    </span>
  )
}

// ─── Status ───────────────────────────────────────────────────────────────────

function Status({ status, actual, t, small = false }) {
  const fs = small ? 11 : 13
  if (status === 'ontime') return (
    <span style={{ fontSize: fs, letterSpacing: '0.1em', color: t.on, textShadow: t.onGlow }}>● ON TIME</span>
  )
  if (status === 'boarding') return (
    <span style={{ fontSize: fs, letterSpacing: '0.1em', color: t.boarding }}>● BOARDING</span>
  )
  return (
    <span style={{ fontSize: fs, letterSpacing: '0.08em', color: t.delay }}>● DELAYED {actual}</span>
  )
}

// ─── Flight number link ───────────────────────────────────────────────────────

function FlightLink({ flight, t, size = 15, alt = false }) {
  if (!flight) return <span style={{ fontSize: 13, color: t.foot }}>—</span>
  return (
    <a
      href={`https://www.google.com/search?q=AA+flight+${flight}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <Flaps text={`AA${flight}`} size={size} color={t.accent} weight={600} alt={alt} t={t} />
    </a>
  )
}

// ─── Scrape button ────────────────────────────────────────────────────────────

function ScrapeButton({ onClick, scraping, t }) {
  return (
    <button onClick={onClick} disabled={scraping} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px', borderRadius: 6,
      background: t.accent, color: t.accentInk,
      border: 'none', fontSize: 12, fontWeight: 600,
      letterSpacing: '0.1em', cursor: scraping ? 'not-allowed' : 'pointer',
      opacity: scraping ? 0.65 : 1,
      fontFamily: '"JetBrains Mono", monospace',
      transition: 'opacity 0.15s', whiteSpace: 'nowrap',
    }}>
      {scraping ? (
        <>
          <svg style={{ animation: 'spin 1s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          SCRAPING...
        </>
      ) : <>⟳ REFRESH</>}
    </button>
  )
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function FlightCard({ fl, i, t }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: i % 2 === 0 ? t.rowA : t.rowB,
      borderTop: `1px solid ${t.rowSep}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* Left: gate · time · status stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flaps text={fl.gate} size={13} color={t.tileMeta} weight={500} alt={i % 2 === 1} t={t} />
            <span style={{ color: t.rowSep, fontSize: 12 }}>·</span>
            <Flaps text={fl.scheduled.replace(' ', '')} size={13} color={t.tileMeta} weight={500} alt={i % 2 === 1} t={t} />
          </div>
          <Status status={fl.status} actual={fl.actual} t={t} small />
        </div>
        {/* Right: destination code above flight link */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Flaps text={fl.code} size={22} weight={700} color={t.tileCode} alt={i % 2 === 1} t={t} />
          <FlightLink flight={fl.flight} t={t} size={13} alt={i % 2 === 1} />
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FlightBoard() {
  const [flights, setFlights]         = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [scraping, setScraping]       = useState(false)
  const [error, setError]             = useState(null)
  const [theme, setTheme]             = useState('dark')
  const [tick, setTick]               = useState(0)

  const width  = useWindowWidth()
  const mobile = width < 640
  const t      = THEMES[theme]

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
    const iv = setInterval(fetchFlights, 30 * 60 * 1000)
    return () => clearInterval(iv)
  }, [fetchFlights])

  useEffect(() => {
    const iv = setInterval(() => setTick(n => n + 1), 30000)
    return () => clearInterval(iv)
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

  const boardFlights = flights.map(f => ({
    code:      f.city,
    scheduled: f.time,
    gate:      f.gate,
    status:    deriveStatus(f.time, f.actual),
    actual:    f.actual,
    flight:    f.flight || null,
  }))

  const clock = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: t.page, color: t.pageText,
      fontFamily: '"JetBrains Mono", monospace',
      padding: mobile ? '16px' : '32px 48px',
      boxSizing: 'border-box',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{
          paddingBottom: 16,
          borderBottom: `1px dashed ${t.dashed}`,
          marginBottom: 20,
        }}>
          {/* Top row: logo + controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: mobile ? 12 : 14, fontWeight: 700, letterSpacing: '0.15em', color: t.headerLabel }}>
                  PHX · SKY HARBOR
                </div>
                <div style={{ marginTop: 2, fontSize: 10, color: t.headerSub, letterSpacing: '0.1em' }}>
                  TERMINAL 4 · GATES A22, 24–A30
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Clock — desktop only */}
              {!mobile && (
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', color: t.metaLabel }}>LOCAL · MST</div>
                  <div style={{ marginTop: 3, fontSize: 13, color: t.clockNum, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {clock}
                  </div>
                </div>
              )}
              <ScrapeButton onClick={handleScrape} scraping={scraping} t={t} />
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  background: t.toggleBg, color: t.toggleColor,
                  border: 'none', borderRadius: 6,
                  padding: '8px 10px', fontSize: 15,
                  cursor: 'pointer', lineHeight: 1,
                }}
              >
                {theme === 'dark' ? '☀' : '◑'}
              </button>
            </div>
          </div>

          {/* Mobile: clock below header */}
          {mobile && (
            <div style={{ marginTop: 10, fontSize: 10, color: t.metaLabel, letterSpacing: '0.12em' }}>
              {clock}
            </div>
          )}
        </div>

        {/* ── Title ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Flaps text="DEPARTURES" size={mobile ? 24 : 42} weight={700} color={t.tileTitle} t={t} />
          <span style={{ color: t.chipMute, fontSize: mobile ? 11 : 14, letterSpacing: '0.12em' }}>
            · {boardFlights.length} flights
          </span>
          <div style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center',
            gap: 7, fontSize: mobile ? 12 : 15, letterSpacing: '0.12em', color: t.accent,
          }}>
            {lastUpdated ? `UPDATED ${timeAgo(lastUpdated).toUpperCase()}` : 'LOADING...'}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            marginBottom: 14, padding: '10px 14px', borderRadius: 8,
            background: 'oklch(0.25 0.06 20)', border: '1px solid oklch(0.4 0.1 20)',
            color: 'oklch(0.78 0.12 30)', fontSize: 12, letterSpacing: '0.05em',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Table (desktop) / Cards (mobile) ── */}
        {mobile ? (
          // ── Mobile card list ──
          <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: t.shadow }}>
            {/* Mobile header strip */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 16px',
              background: t.headStrip, color: t.headStripIn,
              fontSize: 10, letterSpacing: '0.18em',
            }}>
              <span>GATE · TIME · STATUS</span>
              <span>DEST · FLIGHT</span>
            </div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px 16px', background: t.rowA, color: t.chipMute, fontSize: 12, letterSpacing: '0.1em' }}>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                LOADING...
              </div>
            ) : boardFlights.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', background: t.rowA, color: t.chipMute, fontSize: 12 }}>
                NO FLIGHT DATA
              </div>
            ) : (
              boardFlights.map((fl, i) => <FlightCard key={`${fl.code}-${i}`} fl={fl} i={i} t={t} />)
            )}
          </div>
        ) : (
          // ── Desktop table ──
          <>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '10px 20px',
              background: t.headStrip, color: t.headStripIn,
              fontSize: 11, letterSpacing: '0.18em',
              borderRadius: '8px 8px 0 0',
            }}>
              <div style={{ flex: 1 }}>GATE</div>
              <div style={{ flex: 1 }}>TIME</div>
              <div style={{ flex: 1 }}>DESTINATION</div>
              <div style={{ flex: 1 }}>STATUS</div>
              <div style={{ flex: 1, textAlign: 'right' }}>FLIGHT</div>
            </div>

            <div style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', boxShadow: t.shadow }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 20px', background: t.rowA, color: t.chipMute, fontSize: 14, letterSpacing: '0.12em' }}>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  LOADING FLIGHTS...
                </div>
              ) : boardFlights.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: t.rowA, color: t.chipMute, fontSize: 13, letterSpacing: '0.12em' }}>
                  NO FLIGHT DATA AVAILABLE
                </div>
              ) : (
                boardFlights.map((fl, i) => (
                  <div key={`${fl.code}-${fl.scheduled}-${i}`} style={{
                    display: 'flex', alignItems: 'center',
                    padding: '12px 20px',
                    background: i % 2 === 0 ? t.rowA : t.rowB,
                    borderTop: `1px solid ${t.rowSep}`,
                  }}>
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
                      <FlightLink flight={fl.flight} t={t} size={15} alt={i % 2 === 1} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── Footer ── */}
        <div style={{
          marginTop: 14, display: 'flex', justifyContent: 'space-between',
          fontSize: 10, letterSpacing: '0.14em', color: t.foot, flexWrap: 'wrap', gap: 6,
        }}>
          <span>{boardFlights.length} flights · gates A22, 24–A30</span>
          <span>Auto-refresh ⟳ 30 min</span>
        </div>

      </div>
    </div>
  )
}
