/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import { correoRegistrado, registrarUsuario } from '../auth/usuarios.js'
import { ROUTES } from '../config/routes.js'
import { useSettings } from '../settings/SettingsContext.js'
import {
  esClaveValida,
  esCorreoValido,
  esDominioSospechoso,
  normalizarCorreo,
} from './Login.jsx'

const INPUT_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

export function esClaveSegura(clave) {
  return (
    esClaveValida(clave) &&
    /[A-Z]/.test(clave) &&
    /\d/.test(clave) &&
    /[^A-Za-z0-9\s]/.test(clave)
  )
}

export function validarRegistro({ nombre, correo, clave, confirmar }) {
  const nombreLimpio = String(nombre ?? '').trim()
  const email = normalizarCorreo(correo)

  if (!nombreLimpio || !email || !clave || !confirmar) {
    return {
      ok: false,
      error: 'Completa todos los campos para crear tu cuenta.',
    }
  }

  if (!esCorreoValido(email)) {
    if (esDominioSospechoso(email)) {
      return {
        ok: false,
        error:
          'No se permite el registro con correos falsos, temporales o dominios sospechosos.',
      }
    }

    return {
      ok: false,
      error:
        'El correo no tiene una sintaxis válida. Ejemplo: nombre@dominio.com',
    }
  }

  if (!esClaveSegura(clave)) {
    return {
      ok: false,
      error:
        'La contraseña debe tener al menos 12 caracteres e incluir una mayúscula, un número y un símbolo.',
    }
  }

  if (clave !== confirmar) {
    return { ok: false, error: 'Las contraseñas no coinciden.' }
  }

  if (correoRegistrado(email)) {
    return {
      ok: false,
      error: 'Ya existe una cuenta registrada con este correo electrónico.',
    }
  }

  return {
    ok: true,
    mensaje: 'Registro exitoso. ¡Bienvenido!',
    usuario: { nombre: nombreLimpio, email },
  }
}

function Register() {
  const { signIn } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const resultado = validarRegistro({ nombre, correo, clave, confirmar })

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    setError('')
    registrarUsuario({
      nombre: resultado.usuario.nombre,
      email: resultado.usuario.email,
      clave,
    })
    signIn({
      email: resultado.usuario.email,
      name: resultado.usuario.nombre,
    })
    navigate(ROUTES.dashboard, {
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
              Crea tu cuenta para pedir, reservar y consultar tus compras.
            </p>
          </div>
          <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Sabor de siempre, servicio digital
          </p>
        </aside>

        <section className="p-6 sm:p-10">
          <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-dark">
            Portal de clientes
          </span>

          <h1 className="mt-4 text-3xl font-bold text-stone-900">
            Crea tu cuenta
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Completa tus datos para registrarte.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="text-sm font-semibold text-stone-800"
              >
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(event) => {
                  setNombre(event.target.value)
                  if (error) setError('')
                }}
                className={INPUT_CLASSES}
              />
            </div>

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

            <div>
              <label
                htmlFor="clave"
                className="text-sm font-semibold text-stone-800"
              >
                Contraseña
              </label>
              <input
                id="clave"
                name="clave"
                type="password"
                autoComplete="new-password"
                placeholder="Crea una contraseña"
                value={clave}
                onChange={(event) => {
                  setClave(event.target.value)
                  if (error) setError('')
                }}
                aria-describedby="clave-help"
                className={INPUT_CLASSES}
              />
              <p id="clave-help" className="mt-2 text-xs text-stone-500">
                Mínimo 12 caracteres, con mayúscula, número y símbolo.
              </p>
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
              Registrarme
            </button>

            <p className="text-center text-xs text-stone-500">
              ¿Ya tienes cuenta?{' '}
              <Link
                to={ROUTES.login}
                className="font-semibold text-accent-strong underline-offset-2 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}

export default Register
