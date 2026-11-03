import { useCallback, useEffect, useId, useState } from 'react'

const CAPACIDAD_USUARIOS = 50
const MAX_SAMPLES = 12
const SAMPLE_INTERVAL = 5000

const ESTADOS = {
  ok: { label: 'Operacional', className: 'bg-emerald-50 text-emerald-700' },
  checking: { label: 'Verificando…', className: 'bg-stone-100 text-stone-600' },
  degraded: {
    label: 'Servicio degradado',
    className: 'bg-amber-50 text-amber-700',
  },
  offline: { label: 'Sin conexión', className: 'bg-red-50 text-red-600' },
}

function formatResponseTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '—'
  }

  if (seconds < 1) {
    return `${Math.max(1, Math.round(seconds * 1000))} ms`
  }

  return `${seconds.toFixed(1)}s`
}

function useSystemHealth() {
  const [status, setStatus] = useState('checking')
  const [samples, setSamples] = useState([])

  const check = useCallback(async () => {
    const started = performance.now()
    let nextStatus = 'ok'
    let elapsed = 0

    try {
      if (!navigator.onLine) {
        nextStatus = 'offline'
      } else {
        await fetch('/favicon.svg', { method: 'HEAD', cache: 'no-store' })
        elapsed = (performance.now() - started) / 1000
      }
    } catch {
      nextStatus = 'degraded'
      elapsed = (performance.now() - started) / 1000
    }

    setStatus(nextStatus)
    setSamples((current) => [
      ...current.slice(-(MAX_SAMPLES - 1)),
      elapsed,
    ])
  }, [])

  useEffect(() => {
    const initial = window.setTimeout(check, 0)
    const interval = window.setInterval(check, SAMPLE_INTERVAL)
    const handleConnectionChange = () => check()

    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)

    return () => {
      window.clearTimeout(initial)
      window.clearInterval(interval)
      window.removeEventListener('online', handleConnectionChange)
      window.removeEventListener('offline', handleConnectionChange)
    }
  }, [check])

  return { status, samples, check }
}

function buildSparklinePoints(values, width, height, padding) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step =
    values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0

  return values.map((value, index) => ({
    x: padding + index * step,
    y: height - padding - ((value - min) / range) * (height - padding * 2),
  }))
}

function buildLinePath(points) {
  if (points.length === 0) {
    return ''
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    const previous = points[index - 1]
    const control = (point.x - previous.x) / 3

    return `${path} C ${previous.x + control} ${previous.y}, ${point.x - control} ${point.y}, ${point.x} ${point.y}`
  }, '')
}

function Sparkline({ values }) {
  const gradientId = `sparkline-${useId().replace(/:/g, '')}`
  const width = 140
  const height = 56
  const padding = 6
  const safeValues = values.length > 0 ? values : [0]
  const series =
    safeValues.length > 1 ? safeValues : [safeValues[0], safeValues[0]]
  const points = buildSparklinePoints(series, width, height, padding)
  const linePath = buildLinePath(points)
  const first = points[0]
  const last = points[points.length - 1]
  const areaPath = `${linePath} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-36"
      role="img"
      aria-label="Historial del tiempo de respuesta"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Gauge({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100))

  return (
    <svg
      viewBox="0 0 120 72"
      className="h-16 w-24"
      role="img"
      aria-label={`Carga de usuarios ${percent}%`}
    >
      <path
        d="M 15 60 A 45 45 0 0 1 105 60"
        fill="none"
        stroke="#e7e5e4"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 15 60 A 45 45 0 0 1 105 60"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="12"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={`${percent} 100`}
      />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        className="fill-stone-700 text-sm font-bold"
      >
        {value}/{max}
      </text>
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-stone-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"
      />
      <circle cx="9.5" cy="7.5" r="3.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 19v-1a4 4 0 0 0-3-3.87M16.5 4.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  )
}

function SystemStatus({ usuariosActivos = 0 }) {
  const { status, samples, check } = useSystemHealth()
  const ultimoTiempo = samples[samples.length - 1] ?? 0
  const usuarios = Math.min(usuariosActivos, CAPACIDAD_USUARIOS)
  const estado = ESTADOS[status] ?? ESTADOS.checking

  return (
    <article className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-stone-900">Estado del Sistema</h3>
        <button
          type="button"
          onClick={check}
          aria-label="Actualizar estado del sistema"
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Actualizar
        </button>
      </div>

      <div
        aria-live="polite"
        className={`mt-4 rounded-xl px-4 py-3 text-center ${estado.className}`}
      >
        <span className="text-lg font-bold">{estado.label}</span>
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-stone-700">
            Tiempo de Respuesta Promedio:
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="text-2xl font-bold text-stone-900">
              {formatResponseTime(ultimoTiempo)}
            </p>
            <Sparkline values={samples} />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-stone-700">
            Carga de Usuarios:
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <UsersIcon />
              <p className="text-2xl font-bold text-stone-900">
                {usuarios}/{CAPACIDAD_USUARIOS}
              </p>
            </div>
            <div className="pr-2">
              <Gauge value={usuarios} max={CAPACIDAD_USUARIOS} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default SystemStatus
