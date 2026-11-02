import { useEffect, useState } from 'react'
import { formatCurrency } from '../config/format.js'
import { ORDER_ESTADOS, PAYMENT_METHODS } from '../config/payments.js'

const FIELD_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function OrderEditor({ order, onClose, onSave }) {
  const [nombre, setNombre] = useState(order.cliente?.nombre ?? '')
  const [correo, setCorreo] = useState(order.cliente?.correo ?? '')
  const [metodoPago, setMetodoPago] = useState(
    order.metodoPago ?? PAYMENT_METHODS[0],
  )
  const [estado, setEstado] = useState(order.estado ?? ORDER_ESTADOS[0])
  const [error, setError] = useState('')

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()

    const nombreCliente = nombre.trim()
    const correoCliente = correo.trim()

    if (!nombreCliente || !correoCliente) {
      setError('El nombre y el correo del cliente son obligatorios.')
      return
    }

    if (!correoCliente.includes('@')) {
      setError('Ingresa un correo válido.')
      return
    }

    onSave({
      ...order,
      cliente: {
        ...order.cliente,
        nombre: nombreCliente,
        correo: correoCliente,
      },
      metodoPago,
      estado,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pedido-editor-titulo"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4 py-6"
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="pedido-editor-titulo"
              className="text-xl font-bold text-stone-900"
            >
              Editar pedido
            </h2>
            <p className="mt-1 font-mono text-xs text-stone-500">
              {order.id} · {order.fecha}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar editor"
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pedido-cliente"
                className="text-sm font-semibold text-stone-800"
              >
                Cliente
              </label>
              <input
                id="pedido-cliente"
                type="text"
                value={nombre}
                onChange={(event) => {
                  setNombre(event.target.value)
                  setError('')
                }}
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="pedido-correo"
                className="text-sm font-semibold text-stone-800"
              >
                Correo
              </label>
              <input
                id="pedido-correo"
                type="email"
                value={correo}
                onChange={(event) => {
                  setCorreo(event.target.value)
                  setError('')
                }}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pedido-pago"
                className="text-sm font-semibold text-stone-800"
              >
                Método de pago
              </label>
              <select
                id="pedido-pago"
                value={metodoPago}
                onChange={(event) => setMetodoPago(event.target.value)}
                className={FIELD_CLASSES}
              >
                {[
                  ...(PAYMENT_METHODS.includes(metodoPago) ? [] : [metodoPago]),
                  ...PAYMENT_METHODS,
                ].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pedido-estado"
                className="text-sm font-semibold text-stone-800"
              >
                Estado
              </label>
              <select
                id="pedido-estado"
                value={estado}
                onChange={(event) => setEstado(event.target.value)}
                className={FIELD_CLASSES}
              >
                {ORDER_ESTADOS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
            <p className="flex items-center justify-between gap-2">
              <span>Total del pedido</span>
              <span className="font-semibold text-stone-900">
                {formatCurrency(order.total, order.currency ?? 'MXN')}
              </span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-2">
              <span>Productos</span>
              <span className="font-semibold text-stone-900">
                {order.items?.length ?? 0}
              </span>
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderEditor
