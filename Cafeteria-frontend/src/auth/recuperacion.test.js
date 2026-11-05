import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  restablecerClave,
  solicitarRecuperacion,
  validarNuevaClave,
} from './recuperacion.js'
import {
  esTokenVigente,
  leerCorreosRecuperacion,
  registrarUsuario,
  verificarCredenciales,
} from './usuarios.js'

function crearStorage() {
  const data = new Map()

  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => {
      data.set(key, String(value))
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

beforeEach(() => {
  vi.stubGlobal('window', { localStorage: crearStorage() })
  registrarUsuario({
    nombre: 'Ana López',
    email: 'ana.lopez@cafeteriajose.com',
    clave: 'Cafeteria26!',
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('US-recuperación: solicitud del correo', () => {
  it('rechaza un correo con sintaxis incorrecta', () => {
    const resultado = solicitarRecuperacion('ana.lopez.cafeteriajose.com')

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/sintaxis/i)
  })

  it('advierte cuando el correo no está registrado', () => {
    const resultado = solicitarRecuperacion('nadie@cafeteriajose.com')

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/no está registrado/i)
  })

  it('genera un token con expiración para un correo registrado', () => {
    const resultado = solicitarRecuperacion('ana.lopez@cafeteriajose.com')

    expect(resultado.ok).toBe(true)
    expect(resultado.token).toBeTruthy()
    expect(resultado.enlace).toContain(resultado.token)
    expect(resultado.expiraEn).toBeGreaterThan(Date.now())
  })

  it('envía un correo con las instrucciones y el enlace de recuperación', () => {
    const resultado = solicitarRecuperacion('ana.lopez@cafeteriajose.com')

    expect(resultado.correoEnviado).toBe(true)

    const buzon = leerCorreosRecuperacion()
    const correo = buzon[buzon.length - 1]

    expect(correo.para).toBe('ana.lopez@cafeteriajose.com')
    expect(correo.asunto).toMatch(/contraseña/i)
    expect(correo.enlace).toBe(resultado.enlace)
    expect(correo.instrucciones).toMatch(/restablecer/i)
  })
})

describe('US-recuperación: expiración del enlace', () => {
  it('considera vigente un token dentro del tiempo y expirado fuera de él', () => {
    const ahora = 1_000

    expect(esTokenVigente({ expiraEn: ahora + 1 }, ahora)).toBe(true)
    expect(esTokenVigente({ expiraEn: ahora - 1 }, ahora)).toBe(false)
  })

  it('rechaza el restablecimiento con un token expirado', () => {
    const solicitud = solicitarRecuperacion('ana.lopez@cafeteriajose.com', {
      ahora: 1_000,
      ttlMs: 1_000,
    })

    const resultado = restablecerClave({
      token: solicitud.token,
      clave: 'NuevaClave26!',
      confirmar: 'NuevaClave26!',
      ahora: 5_000,
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/expirado/i)
  })
})

describe('US-recuperación: nueva contraseña', () => {
  it('exige mínimo 12 caracteres', () => {
    expect(validarNuevaClave('Cafeteria26')).toBe(false)
    expect(validarNuevaClave('Cafeteria26!')).toBe(true)
  })

  it('actualiza la contraseña y muestra un mensaje de éxito', () => {
    const solicitud = solicitarRecuperacion('ana.lopez@cafeteriajose.com')
    const resultado = restablecerClave({
      token: solicitud.token,
      clave: 'NuevaClave26!',
      confirmar: 'NuevaClave26!',
    })

    expect(resultado.ok).toBe(true)
    expect(resultado.mensaje).toMatch(/actualizada/i)
    expect(
      verificarCredenciales('ana.lopez@cafeteriajose.com', 'NuevaClave26!'),
    ).not.toBeNull()
  })
})
