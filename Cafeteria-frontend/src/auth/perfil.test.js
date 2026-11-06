import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { actualizarPerfil, leerPerfil, validarPerfil } from './perfil.js'
import { registrarUsuario, verificarCredenciales } from './usuarios.js'

function crearStorage() {
  const data = new Map()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
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

afterEach(() => vi.unstubAllGlobals())

describe('US-perfil: datos y validaciones', () => {
  it('carga los datos actuales del usuario', () => {
    expect(leerPerfil('ana.lopez@cafeteriajose.com')).toMatchObject({
      nombre: 'Ana López',
      email: 'ana.lopez@cafeteriajose.com',
    })
  })

  it('carga el correo y nombre de la cuenta demo', () => {
    expect(leerPerfil('jose.revucio@cafeteriajose.com')).toMatchObject({
      nombre: 'José Revucio',
      email: 'jose.revucio@cafeteriajose.com',
    })
  })

  it('rechaza campos vacíos y formatos inválidos con mensajes específicos', () => {
    expect(validarPerfil({ nombre: '', email: 'incorrecto' }).error).toMatch(/nombre/i)
    expect(validarPerfil({ nombre: 'Ana', email: 'incorrecto' }).error).toMatch(/correo/i)
    expect(validarPerfil({ nombre: 'Ana', email: 'ana@correo.com', telefono: 'abc' }).error).toMatch(/teléfono/i)
  })

  it('exige la contraseña actual antes de modificar el correo', () => {
    const resultado = actualizarPerfil({
      correoActual: 'ana.lopez@cafeteriajose.com',
      datos: { nombre: 'Ana', email: 'ana.nueva@cafeteriajose.com' },
      claveConfirmacion: 'incorrecta',
    })
    expect(resultado.ok).toBe(false)
    expect(resultado.error).toMatch(/contraseña/i)
  })

  it('guarda cambios válidos y conserva el acceso con la nueva información', () => {
    const resultado = actualizarPerfil({
      correoActual: 'ana.lopez@cafeteriajose.com',
      datos: {
        nombre: 'Ana Actualizada',
        email: 'ana.nueva@cafeteriajose.com',
        telefono: '+52 55 1234 5678',
        foto: 'https://ejemplo.com/ana.jpg',
      },
      claveConfirmacion: 'Cafeteria26!',
    })
    expect(resultado.ok).toBe(true)
    expect(resultado.mensaje).toMatch(/actualizado/i)
    expect(verificarCredenciales('ana.nueva@cafeteriajose.com', 'Cafeteria26!')).not.toBeNull()
  })
})
