import { DEMO_CREDENTIALS } from '../config/env.js'

const USUARIOS_KEY = 'cafeteria-jose:usuarios-registrados'
const TOKENS_KEY = 'cafeteria-jose:recuperacion'
const CORREOS_KEY = 'cafeteria-jose:correos-recuperacion'

export const TOKEN_TTL_MS = 15 * 60 * 1000

export function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase()
}

function obtenerStorage() {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage ?? null
  } catch {
    return null
  }
}

function leerJson(key, fallback) {
  const storage = obtenerStorage()

  if (!storage) {
    return fallback
  }

  try {
    const raw = storage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null

    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function escribirJson(key, value) {
  const storage = obtenerStorage()

  if (!storage) {
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function nombreDesdeCorreo(correo) {
  const local = normalizarCorreo(correo)
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

export function leerUsuarios() {
  const usuarios = leerJson(USUARIOS_KEY, [])

  return Array.isArray(usuarios) ? usuarios : []
}

export function buscarUsuario(correo) {
  const email = normalizarCorreo(correo)

  return (
    leerUsuarios().find(
      (usuario) => normalizarCorreo(usuario?.email) === email,
    ) ?? null
  )
}

export function correoRegistrado(correo) {
  const email = normalizarCorreo(correo)

  if (email === normalizarCorreo(DEMO_CREDENTIALS.email)) {
    return true
  }

  return Boolean(buscarUsuario(email))
}

export function registrarUsuario({ nombre, email, clave }) {
  const usuarios = leerUsuarios()
  usuarios.push({
    nombre: String(nombre ?? '').trim() || nombreDesdeCorreo(email),
    email: normalizarCorreo(email),
    clave,
  })

  escribirJson(USUARIOS_KEY, usuarios)
}

export function actualizarClave(correo, nuevaClave) {
  const email = normalizarCorreo(correo)
  const usuarios = leerUsuarios()
  const index = usuarios.findIndex(
    (usuario) => normalizarCorreo(usuario?.email) === email,
  )

  if (index >= 0) {
    usuarios[index] = { ...usuarios[index], clave: nuevaClave }
  } else {
    usuarios.push({
      nombre: nombreDesdeCorreo(email),
      email,
      clave: nuevaClave,
    })
  }

  escribirJson(USUARIOS_KEY, usuarios)
}

export function actualizarPerfilUsuario(correoActual, perfil) {
  const emailActual = normalizarCorreo(correoActual)
  const usuarios = leerUsuarios()
  const index = usuarios.findIndex(
    (usuario) => normalizarCorreo(usuario?.email) === emailActual,
  )

  if (index < 0) {
    if (emailActual !== normalizarCorreo(DEMO_CREDENTIALS.email)) {
      return false
    }

    usuarios.push({
      nombre: perfil.nombre,
      email: perfil.email,
      telefono: perfil.telefono,
      foto: perfil.foto,
      clave: DEMO_CREDENTIALS.password,
    })
  } else {
    usuarios[index] = {
      ...usuarios[index],
      ...perfil,
    }
  }

  return escribirJson(USUARIOS_KEY, usuarios)
}

export function verificarCredenciales(correo, clave) {
  const email = normalizarCorreo(correo)
  const registrado = buscarUsuario(email)

  if (registrado) {
    if (registrado.clave !== clave) {
      return null
    }

    return {
      email,
      nombre: registrado.nombre ?? nombreDesdeCorreo(email),
    }
  }

  if (
    email === normalizarCorreo(DEMO_CREDENTIALS.email) &&
    clave === DEMO_CREDENTIALS.password
  ) {
    return { email, nombre: nombreDesdeCorreo(email) }
  }

  return null
}

export function generarToken() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID().replace(/-/g, '')
  }

  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export function crearTokenRecuperacion(
  correo,
  { ttlMs = TOKEN_TTL_MS, ahora = Date.now() } = {},
) {
  const token = generarToken()
  const expiraEn = ahora + ttlMs
  const tokens = leerJson(TOKENS_KEY, {})

  tokens[token] = { email: normalizarCorreo(correo), expiraEn }
  const guardado = escribirJson(TOKENS_KEY, tokens)

  return { token, expiraEn, guardado }
}

export function esTokenVigente(registro, ahora = Date.now()) {
  return (
    Boolean(registro) &&
    typeof registro.expiraEn === 'number' &&
    registro.expiraEn > ahora
  )
}

export function validarTokenRecuperacion(token, ahora = Date.now()) {
  if (!token) {
    return { ok: false, error: 'El enlace de recuperación no es válido.' }
  }

  const tokens = leerJson(TOKENS_KEY, {})
  const registro = tokens[token]

  if (!registro) {
    return { ok: false, error: 'El enlace de recuperación no es válido.' }
  }

  if (!esTokenVigente(registro, ahora)) {
    return {
      ok: false,
      error: 'El enlace de recuperación ha expirado. Solicita uno nuevo.',
    }
  }

  return { ok: true, email: registro.email }
}

export function eliminarToken(token) {
  const tokens = leerJson(TOKENS_KEY, {})
  delete tokens[token]
  escribirJson(TOKENS_KEY, tokens)
}

export function enviarCorreoRecuperacion({
  email,
  enlace,
  expiraEn,
  ahora = Date.now(),
}) {
  const correos = leerJson(CORREOS_KEY, [])
  const buzon = Array.isArray(correos) ? correos : []
  const correo = {
    para: normalizarCorreo(email),
    asunto: 'Restablece tu contraseña de Cafetería José Revulución',
    instrucciones:
      'Abre el siguiente enlace para restablecer tu contraseña. Si no solicitaste este cambio, ignora este mensaje.',
    enlace,
    expiraEn,
    enviadoEn: ahora,
  }

  buzon.push(correo)

  return escribirJson(CORREOS_KEY, buzon) ? correo : null
}

export function leerCorreosRecuperacion() {
  const correos = leerJson(CORREOS_KEY, [])

  return Array.isArray(correos) ? correos : []
}
