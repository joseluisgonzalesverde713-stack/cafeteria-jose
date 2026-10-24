import { useState } from 'react'

const AUTHORIZED_USER = {
  email: 'jose.revucio@cafeteriajose.com',
  password: 'Cafeteria26!',
}

const PASSWORD_LENGTH = 12

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const SUSPICIOUS_DOMAINS = [
  '10minutemail.com',
  'dispostable.com',
  'fakeinbox.com',
  'getnada.com',
  'guerrillamail.com',
  'maildrop.cc',
  'mailinator.com',
  'sharklasers.com',
  'temp-mail.org',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'fake.com',
  'correo-falso.com',
]

const RESERVED_TLDS = ['test', 'example', 'invalid', 'localhost']

const INPUT_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'

function getDomain(email) {
  return email.slice(email.lastIndexOf('@') + 1).toLowerCase()
}

function isSuspiciousEmail(email) {
  const domain = getDomain(email)
  const tld = domain.slice(domain.lastIndexOf('.') + 1)

  return (
    RESERVED_TLDS.includes(tld) ||
    SUSPICIOUS_DOMAINS.some(
      (blocked) => domain === blocked || domain.endsWith(`.${blocked}`),
    )
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [accessMessage, setAccessMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      setError('Completa el correo y la contraseña para continuar.')
      return
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError(
        'El correo no tiene una sintaxis válida. Ejemplo: nombre@dominio.com',
      )
      return
    }

    if (isSuspiciousEmail(normalizedEmail)) {
      setError(
        'No se permite el ingreso con correos falsos o dominios sospechosos.',
      )
      return
    }

    if (password.length !== PASSWORD_LENGTH) {
      setError(
        `La contraseña debe tener exactamente ${PASSWORD_LENGTH} caracteres.`,
      )
      return
    }

    if (
      normalizedEmail !== AUTHORIZED_USER.email ||
      password !== AUTHORIZED_USER.password
    ) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      return
    }

    setError('')
    setAccessMessage(
      `Bienvenido, José. Acceso concedido a CAFETERÍA JOSÉ REVUCIÓN.`,
    )
    setIsAuthenticated(true)
  }

  function handleLogout() {
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setError('')
    setAccessMessage('')
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-stone-200">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckIcon />
          </span>

          <h1 className="mt-6 text-2xl font-bold text-stone-900">
            Acceso concedido
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{accessMessage}</p>

          <p className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            {email}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Cerrar sesión
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-rose-100 px-4 py-10 text-stone-800">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-stone-200 md:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-linear-to-br from-orange-600 via-orange-500 to-amber-400 p-10 text-white md:flex">
          <div>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-black tracking-tight ring-1 ring-white/30">
              JR
            </span>
            <h2 className="mt-8 text-3xl font-bold leading-tight">
              Cafetería José Revución
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-orange-50">
              Tus datos y tus compras, en un solo lugar.
            </p>
          </div>

          <ul className="mt-10 space-y-4 text-sm font-medium">
            <FeatureItem>Acceso seguro a tu cuenta</FeatureItem>
            <FeatureItem>Historial de compras disponible</FeatureItem>
            <FeatureItem>Datos personales protegidos</FeatureItem>
          </ul>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-orange-100">
            Sabor de siempre, servicio digital
          </p>
        </aside>

        <section className="p-6 sm:p-10">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
            Portal de clientes
          </span>

          <h1 className="mt-4 text-3xl font-bold text-stone-900">
            Inicia sesión
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Ingresa con el correo registrado en la cafetería para consultar tus
            compras.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
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
                  className="absolute inset-y-0 right-0 mt-2 flex w-12 items-center justify-center rounded-r-xl text-stone-400 transition hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <p
                id="password-help"
                className="mt-2 flex items-center justify-between text-xs text-stone-500"
              >
                <span>Debe tener exactamente {PASSWORD_LENGTH} caracteres.</span>
                <span
                  className={
                    password.length === PASSWORD_LENGTH
                      ? 'font-semibold text-emerald-600'
                      : 'font-medium text-stone-500'
                  }
                >
                  {password.length}/{PASSWORD_LENGTH}
                </span>
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
              className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Ingresar
            </button>
          </form>

          <details className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <summary className="cursor-pointer font-semibold">
              Credenciales de demostración
            </summary>
            <p className="mt-2">
              Correo:{' '}
              <span className="font-mono text-xs">
                jose.revucio@cafeteriajose.com
              </span>
            </p>
            <p className="mt-1">
              Contraseña: <span className="font-mono text-xs">Cafeteria26!</span>
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
