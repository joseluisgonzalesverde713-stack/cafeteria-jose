/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import { verificarCredenciales } from '../auth/usuarios.js'
import { DEMO_CREDENTIALS } from '../config/env.js'
import { ROUTES } from '../config/routes.js'
import { useSettings } from '../settings/SettingsContext.js'

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const INPUT_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

const DOMINIOS_SOSPECHOSOS = [
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'fake.com',
  'correo.com',
  'mailinator.com',
  'yopmail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'getnada.com',
  'maildrop.cc',
]

export function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase()
}

function obtenerDominio(correo) {
  return normalizarCorreo(correo).split('@')[1] ?? ''
}

export function esDominioSospechoso(correo) {
  const dominio = obtenerDominio(correo)

  return DOMINIOS_SOSPECHOSOS.some(
    (sospechoso) => dominio === sospechoso || dominio.endsWith(`.${sospechoso}`),
  )
}

export function esCorreoValido(correo) {
  const normalizado = normalizarCorreo(correo)

  return EMAIL_PATTERN.test(normalizado) && !esDominioSospechoso(normalizado)
}

export function esClaveValida(clave) {
  return typeof clave === 'string' && clave.length >= 12
}

export function validarCredenciales({ correo, clave }) {
  const email = normalizarCorreo(correo)

  if (!email || !clave) {
    return {
      ok: false,
      error: 'Completa el correo y la contraseña para continuar.',
    }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      error:
        'El correo no tiene una sintaxis válida. Ejemplo: nombre@dominio.com',
    }
  }

  if (esDominioSospechoso(email)) {
    return {
      ok: false,
      error:
        'No se permite el ingreso con correos falsos o dominios sospechosos.',
    }
  }

  if (!esClaveValida(clave)) {
    return {
      ok: false,
      error: 'La contraseña debe tener al menos 12 caracteres.',
    }
  }

  const usuario = verificarCredenciales(email, clave)

  if (!usuario) {
    return {
      ok: false,
      error: 'Correo o contraseña incorrectos. Verifica tus datos.',
    }
  }

  return {
    ok: true,
    mensaje: 'Inicio de sesión correcto. ¡Bienvenido!',
    usuario: {
      email: usuario.email,
      nombre: usuario.nombre ?? nameFromEmail(email),
    },
  }
}

function nameFromEmail(email) {
  const local = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim()

  if (!local) {
    return 'Cliente'
  }

  return local
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function Login() {
  const { signIn } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = location.state?.from?.pathname ?? ROUTES.dashboard

  function handleSubmit(event) {
    event.preventDefault()

    const resultado = validarCredenciales({ correo: email, clave: password })

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setError('')
    signIn({
      email: resultado.usuario.email,
      name: resultado.usuario.nombre,
    })
    navigate(redirectTo, {
      replace: true,
      state: { success: resultado.mensaje },
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent-soft via-stone-50 to-stone-200 px-4 py-10 text-stone-800">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200 md:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-linear-to-br from-accent via-accent-strong to-accent-dark p-10 text-white md:flex">
          <div>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-black tracking-tight ring-1 ring-white/30">
              {settings.shortName}
            </span>
            <h2 className="mt-8 text-3xl font-bold leading-tight">
              {settings.appName}
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">
              Café y bebidas frías en un solo lugar.
            </p>
            <img
              src="/cafeteria/hero.svg"
              alt="Ilustración de una taza de café con un croissant"
              className="mx-auto mt-6 w-full max-w-[260px] drop-shadow-xl"
            />
          </div>

          <ul className="mt-10 space-y-4 text-sm font-medium">
            <FeatureItem>Café americano, capuchino y chocolate</FeatureItem>
            <FeatureItem>Frappés, cold brew y agua de horchata</FeatureItem>
            <FeatureItem>Opciones calientes y frías todo el día</FeatureItem>
          </ul>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Sabor de siempre, servicio digital
          </p>
        </aside>

        <section className="p-6 sm:p-10">
          <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
            Portal de clientes
          </span>

          <h1 className="mt-4 text-3xl font-bold text-stone-900">
            Inicia sesión
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Ingresa con tu correo y contraseña para acceder al portal de
            clientes.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {location.state?.success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              >
                {location.state.success}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="text-sm font-semibold text-stone-800"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nombre@dominio.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError('')
                }}
                className={INPUT_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-stone-800"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (error) setError('')
                  }}
                  aria-describedby="password-help"
                  className={`${INPUT_CLASSES} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 mt-2 flex w-12 items-center justify-center rounded-r-xl text-stone-400 transition hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <p id="password-help" className="mt-2 text-xs text-stone-500">
                La contraseña debe tener al menos 12 caracteres.
              </p>
              <p className="mt-1 text-right text-xs">
                <Link
                  to={ROUTES.recuperar}
                  className="font-semibold text-accent-strong underline-offset-2 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <WarningIcon />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Ingresar
            </button>

            <p className="text-center text-xs text-stone-500">
              Al ingresar serás redirigido a tu panel de cliente.
            </p>

            <p className="text-center text-xs text-stone-500">
              ¿No tienes cuenta?{' '}
              <Link
                to={ROUTES.registro}
                className="font-semibold text-accent-strong underline-offset-2 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </form>

          <details className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <summary className="cursor-pointer font-semibold">
              Credenciales de demostración
            </summary>
            <p className="mt-2">
              Correo:{' '}
              <span className="font-mono text-xs">{DEMO_CREDENTIALS.email}</span>
            </p>
            <p className="mt-1">
              Contraseña:{' '}
              <span className="font-mono text-xs">
                {DEMO_CREDENTIALS.password}
              </span>
            </p>
          </details>
        </section>
      </div>
    </main>
  )
}

function FeatureItem({ children }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
        <CheckIcon className="size-4" />
      </span>
      {children}
    </li>
  )
}

function CheckIcon({ className = 'size-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg
      className="mt-0.5 size-5 shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.516-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.477 10.477a3 3 0 0 0 4.046 4.046" />
      <path d="M9.879 5.223A9.956 9.956 0 0 1 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639a10.98 10.98 0 0 1-4.162 5.314M6.228 6.228a10.98 10.98 0 0 0-4.192 5.455 1.012 1.012 0 0 0 0 .639C3.423 16.49 7.36 19.5 12 19.5c1.63 0 3.17-.373 4.544-1.036" />
    </svg>
  )
}

export default Login
