import { it, expect } from 'vitest'
import { esCorreoValido, esClaveValida } from './validaciones'

it('rechaza correo sin dominio', () => {
  expect(esCorreoValido('ana@correo')).toBe(false)
})
it('rechaza clave de 11 caracteres', () => {
  expect(esClaveValida('a'.repeat(11))).toBe(false)
})
// crear un test que se acepte un correo validacion
it('acepta correo con dominio openvalido', () => {
  expect(esCorreoValido('ana@correo.com')).toBe(true)
})