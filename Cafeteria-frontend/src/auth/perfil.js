import {
  actualizarPerfilUsuario,
  buscarUsuario,
  normalizarCorreo,
  verificarCredenciales,
} from './usuarios.js'
import { DEMO_CREDENTIALS } from '../config/env.js'

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
const PHONE_PATTERN = /^[+\d][\d\s()-]{6,}$/

export function leerPerfil(correo) {
  const usuario = buscarUsuario(correo)

  if (!usuario) {
    const email = normalizarCorreo(correo)

    return {
      nombre:
        email === normalizarCorreo(DEMO_CREDENTIALS.email)
          ? 'José Revucio'
          : '',
      email,
      telefono: '',
      foto: '',
    }
  }

  return {
    nombre: usuario.nombre ?? '',
    email: normalizarCorreo(usuario.email),
    telefono: usuario.telefono ?? '',
    foto: usuario.foto ?? '',
  }
}

export function validarPerfil(datos) {
  const nombre = String(datos?.nombre ?? '').trim()
  const email = normalizarCorreo(datos?.email)
  const telefono = String(datos?.telefono ?? '').trim()
  const foto = String(datos?.foto ?? '').trim()

  if (!nombre) {
    return { ok: false, error: 'El nombre es obligatorio.' }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Ingresa un correo electrónico válido.' }
  }

  if (telefono && !PHONE_PATTERN.test(telefono)) {
    return { ok: false, error: 'Ingresa un número de teléfono válido.' }
  }

  if (foto) {
    try {
      const url = new URL(foto)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      return { ok: false, error: 'La foto debe ser una URL válida.' }
    }
  }

  return { ok: true, perfil: { nombre, email, telefono, foto } }
}

export function actualizarPerfil({ correoActual, datos, claveConfirmacion }) {
  const validacion = validarPerfil(datos)

  if (!validacion.ok) return validacion

  const emailActual = normalizarCorreo(correoActual)
  const emailNuevo = validacion.perfil.email

  if (
    emailNuevo !== emailActual &&
    !verificarCredenciales(emailActual, claveConfirmacion)
  ) {
    return {
      ok: false,
      error: 'Confirma el cambio de correo con tu contraseña actual.',
    }
  }

  if (!actualizarPerfilUsuario(emailActual, validacion.perfil)) {
    return {
      ok: false,
      error: 'No se pudo guardar el perfil. Intenta nuevamente.',
    }
  }

  return {
    ok: true,
    perfil: validacion.perfil,
    mensaje: 'Perfil actualizado correctamente.',
  }
}
