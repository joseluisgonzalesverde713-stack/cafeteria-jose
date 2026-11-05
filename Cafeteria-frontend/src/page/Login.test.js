import { describe, expect, it } from 'vitest'
import { DEMO_CREDENTIALS } from '../config/env.js'
import {
  esClaveValida,
  esCorreoValido,
  validarCredenciales,
} from './Login.jsx'

describe('US-login: validación de correo', () => {
  it('rechaza un correo con sintaxis incorrecta', () => {
    expect(esCorreoValido('jose.cafeteriajose.com')).toBe(false)
    expect(esCorreoValido('jose@cafeteria')).toBe(false)
  })

  it('rechaza correos con dominios sospechosos o falsos', () => {
    expect(esCorreoValido('jose@example.com')).toBe(false)
    expect(esCorreoValido('jose@mailinator.com')).toBe(false)
    expect(esCorreoValido('jose@cafeteriajose.com')).toBe(true)
  })
})

describe('US-login: validación de contraseña', () => {
  it('exige al menos 12 caracteres', () => {
    expect(esClaveValida('Cafeteria26')).toBe(false)
    expect(esClaveValida('Cafeteria26!')).toBe(true)
  })
})

describe('US-login: validación de credenciales', () => {
  it('muestra un error cuando los datos son incorrectos', () => {
    const resultado = validarCredenciales({
      correo: DEMO_CREDENTIALS.email,
      clave: 'ClaveIncorrecta1!',
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/incorrect/i)
  })

  it('permite el acceso y muestra un mensaje de éxito con datos correctos', () => {
    const resultado = validarCredenciales({
      correo: DEMO_CREDENTIALS.email,
      clave: DEMO_CREDENTIALS.password,
    })

    expect(resultado.ok).toBe(true)
    expect(resultado.mensaje).toMatch(/éxito|correcto/i)
    expect(resultado.usuario.email).toBe(DEMO_CREDENTIALS.email)
  })
})
