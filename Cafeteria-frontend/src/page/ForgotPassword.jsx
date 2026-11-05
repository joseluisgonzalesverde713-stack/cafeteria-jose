import { useState } from 'react'
import { Link } from 'react-router-dom'
import { solicitarRecuperacion } from '../auth/recuperacion.js'
import { ROUTES, resetPath } from '../config/routes.js'
import { useSettings } from '../settings/SettingsContext.js'

const INPUT_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function ForgotPassword() {
  const { settings } = useSettings()
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    const solicitud = solicitarRecuperacion(correo)

    if (!solicitud.ok) {
      setResultado(null)
      setError(solicitud.error)
      return
    }

    setError('')
    setResultado(solicitud)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent-soft via-stone-50 to-stone-200 px-4 py-10 text-stone-800">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200 sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-xl font-black tracking-tight text-white">
          {settings.shortName}
        </span>

        <h1 className="mt-6 text-2xl font-bold text-stone-900">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Ingresa el correo con el que te registraste.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="correo"
              className="text-sm font-semibold text-stone-800"
            >
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@dominio.com"
              value={correo}
              onChange={(event) => {
                setCorreo(event.target.value)
                if (error) setError('')
              }}
              className={INPUT_CLASSES}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {resultado && (
            <div
              role="status"
              className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <p className="font-medium">{resultado.mensaje}</p>
              <p className="text-xs">
                El enlace expira el{' '}
                {new Date(resultado.expiraEn).toLocaleString('es-MX')}.
              </p>
              <Link
                to={resetPath(resultado.token)}
                className="inline-block font-semibold underline underline-offset-2"
              >
                Abrir enlace de recuperación
              </Link>
              <p className="text-xs text-emerald-700">
                Demostración: aquí se muestra el enlace que normalmente se
                enviaría por correo electrónico.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Enviar instrucciones
          </button>

          <p className="text-center text-xs text-stone-500">
            <Link
              to={ROUTES.login}
              className="font-semibold text-accent-strong underline-offset-2 hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default ForgotPassword
