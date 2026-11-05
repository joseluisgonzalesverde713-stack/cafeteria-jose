import {
  actualizarClave,
  correoRegistrado,
  crearTokenRecuperacion,
  eliminarToken,
  enviarCorreoRecuperacion,
  normalizarCorreo,
  validarTokenRecuperacion,
} from './usuarios.js'

const EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

export const CLAVE_MINIMA = 12

export function validarNuevaClave(clave) {
  return typeof clave === 'string' && clave.length >= CLAVE_MINIMA
}

export function solicitarRecuperacion(correo, opciones = {}) {
  const email = normalizarCorreo(correo)

  if (!email) {
    return {
      ok: false,
      error: 'Ingresa el correo electrónico de tu cuenta.',
    }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      error:
        'El correo no tiene una sintaxis válida. Ejemplo: nombre@dominio.com',
    }
  }

  if (!correoRegistrado(email)) {
    return {
      ok: false,
      error: 'El correo no está registrado. Verifica tus datos o crea una cuenta.',
    }
  }

  const { token, expiraEn, guardado } = crearTokenRecuperacion(email, opciones)

  if (!guardado) {
    return {
      ok: false,
      error:
        'No pudimos preparar el enlace de recuperación. Intenta nuevamente.',
    }
  }

  const enlace = `/restablecer/${token}`
  const correoEnviado = enviarCorreoRecuperacion({
    email,
    enlace,
    expiraEn,
    ahora: opciones.ahora,
  })

  if (!correoEnviado) {
    eliminarToken(token)

    return {
      ok: false,
      error:
        'No pudimos enviar las instrucciones de recuperación. Intenta nuevamente.',
    }
  }

  return {
    ok: true,
    token,
    expiraEn,
    enlace,
    correoEnviado: true,
    mensaje: `Enviamos las instrucciones de recuperación a ${email}.`,
  }
}

export function restablecerClave({ token, clave, confirmar, ahora }) {
  const tokenInfo = validarTokenRecuperacion(token, ahora)

  if (!tokenInfo.ok) {
    return tokenInfo
  }

  if (!clave || !confirmar) {
    return {
      ok: false,
      error: 'Completa la nueva contraseña y su confirmación.',
    }
  }

  if (!validarNuevaClave(clave)) {
    return {
      ok: false,
      error: `La contraseña debe tener al menos ${CLAVE_MINIMA} caracteres.`,
    }
  }

  if (clave !== confirmar) {
    return { ok: false, error: 'Las contraseñas no coinciden.' }
  }

  actualizarClave(tokenInfo.email, clave)
  eliminarToken(token)

  return {
    ok: true,
    email: tokenInfo.email,
    mensaje: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
  }
}
