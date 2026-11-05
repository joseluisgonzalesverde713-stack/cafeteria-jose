import { describe, expect, it } from 'vitest'
import { correoRegistrado } from '../auth/usuarios.js'
import { DEMO_CREDENTIALS } from '../config/env.js'
import { esClaveSegura, validarRegistro } from './Register.jsx'

const DATOS_VALIDOS = {
  nombre: 'Ana López',
  correo: 'ana.lopez@cafeteriajose.com',
  clave: 'Cafeteria26!',
  confirmar: 'Cafeteria26!',
}

describe('US-registro: datos del formulario', () => {
  it('muestra un error cuando faltan campos', () => {
    const resultado = validarRegistro({
      ...DATOS_VALIDOS,
      correo: '',
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/completa/i)
  })

  it('rechaza un correo con sintaxis incorrecta', () => {
    const resultado = validarRegistro({
      ...DATOS_VALIDOS,
      correo: 'ana.cafeteriajose.com',
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/sintaxis/i)
  })

  it('rechaza correos falsos, temporales o de dominios sospechosos', () => {
    const resultado = validarRegistro({
      ...DATOS_VALIDOS,
      correo: 'ana@mailinator.com',
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/sospechosos|falsos/i)
  })
})

describe('US-registro: seguridad de la contraseña', () => {
  it('exige mínimo 12 caracteres', () => {
    expect(esClaveSegura('Cafeteria1!')).toBe(false)
    expect(esClaveSegura('Cafeteria26!')).toBe(true)
  })

  it('exige mayúscula, número y símbolo', () => {
    expect(esClaveSegura('cafeteria26!')).toBe(false)
    expect(esClaveSegura('Cafeteriae!#!')).toBe(false)
    expect(esClaveSegura('Cafeteria!abc')).toBe(false)
  })

  it('rechaza cuando las contraseñas no coinciden', () => {
    const resultado = validarRegistro({
      ...DATOS_VALIDOS,
      confirmar: 'Cafeteria26?',
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/no coinciden/i)
  })
})

describe('US-registro: correo ya registrado', () => {
  it('detecta el correo de la cuenta demo como ya registrado', () => {
    expect(correoRegistrado(DEMO_CREDENTIALS.email)).toBe(true)

    const resultado = validarRegistro({
      ...DATOS_VALIDOS,
      correo: DEMO_CREDENTIALS.email,
    })

    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/ya existe/i)
  })

  it('acepta un registro válido con un correo nuevo', () => {
    const resultado = validarRegistro(DATOS_VALIDOS)

    expect(resultado.ok).toBe(true)
    expect(resultado.usuario.email).toBe(DATOS_VALIDOS.correo)
  })
})
