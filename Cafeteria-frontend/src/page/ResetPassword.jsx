import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { restablecerClave } from '../auth/recuperacion.js'
import { validarTokenRecuperacion } from '../auth/usuarios.js'
import { ROUTES } from '../config/routes.js'
import { useSettings } from '../settings/SettingsContext.js'

const INPUT_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function ResetPassword() {
  const { settings } = useSettings()
  const { token } = useParams()
  const navigate = useNavigate()
  const [tokenInfo] = useState(() => validarTokenRecuperacion(token))
  const [clave, setClave] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const resultado = restablecerClave({ token, clave, confirmar })

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setError('')
    navigate(ROUTES.login, {
      replace: true,
      state: { success: resultado.mensaje },
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-accent-soft via-stone-50 to-stone-200 px-4 py-10 text-stone-800">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-stone-200 sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-xl font-black tracking-tight text-white">
          {settings.shortName}
        </span>

        <h1 className="mt-6 text-2xl font-bold text-stone-900">
          Nueva contraseña
        </h1>

        {!tokenInfo.ok ? (
          <>
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {tokenInfo.error}
            </p>
            <p className="mt-5 text-center text-xs text-stone-500">
              <Link
                to={ROUTES.recuperar}
                className="font-semibold text-accent-strong underline-offset-2 hover:underline"
              >
                Solicitar un nuevo enlace
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Define una contraseña de al menos 12 caracteres para{' '}
              <span className="font-medium">{tokenInfo.email}</span>.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="clave"
                  className="text-sm font-semibold text-stone-800"
                >
                  Nueva contraseña
                </label>
                <input
                  id="clave"
                  name="clave"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 12 caracteres"
                  value={clave}
                  onChange={(event) => {
                    setClave(event.target.value)
                    if (error) setError('')
                  }}
                  className={INPUT_CLASSES}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmar"
                  className="text-sm font-semibold text-stone-800"
                >
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar"
                  name="confirmar"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={confirmar}
                  onChange={(event) => {
                    setConfirmar(event.target.value)
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

              <button
                type="submit"
                className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Actualizar contraseña
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}

export default ResetPassword
