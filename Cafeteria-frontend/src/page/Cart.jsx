import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import { useCart } from '../cart/CartContext.js'
import { formatCurrency } from '../config/format.js'
import { PAYMENT_METHODS } from '../config/payments.js'
import { ROUTES, receiptPath } from '../config/routes.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useProducts } from '../products/ProductsContext.js'
import { useSettings } from '../settings/SettingsContext.js'

const FIELD_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function Cart() {
  const { items, incrementItem, decrementItem, removeItem, clearCart } =
    useCart()
  const { products } = useProducts()
  const { addOrder } = useOrders()
  const { settings } = useSettings()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [metodoPago, setMetodoPago] = useState(PAYMENT_METHODS[0])
  const [nombre, setNombre] = useState(user?.name ?? '')
  const [correo, setCorreo] = useState(user?.email ?? '')
  const [error, setError] = useState('')

  const lines = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return product ? [{ ...item, product }] : []
  })

  const total = lines.reduce(
    (sum, line) => sum + line.product.precio * line.quantity,
    0,
  )

  function handleCheckout() {
    const nombreCliente = nombre.trim()
    const correoCliente = correo.trim()

    if (lines.length === 0) {
      return
    }

    if (!nombreCliente || !correoCliente) {
      setError('Completa el nombre y el correo para generar la boleta.')
      return
    }

    if (!correoCliente.includes('@')) {
      setError('Ingresa un correo válido para la boleta.')
      return
    }

    const order = addOrder({
      total,
      currency: settings.currency,
      metodoPago,
      cliente: { nombre: nombreCliente, correo: correoCliente },
      items: lines.map((line) => ({
        nombre: line.product.nombre,
        precio: line.product.precio,
        cantidad: line.quantity,
      })),
    })

    clearCart()
    navigate(receiptPath(order.id), { replace: true })
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Agrega productos desde el menú para preparar una compra de prueba.
        </p>
        <Link
          to={ROUTES.menu}
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Ir al menú
        </Link>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
        <h1 className="text-3xl font-bold text-stone-900">Carrito</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Revisa tus productos, elige el método de pago y genera tu boleta.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          aria-label="Productos en el carrito"
          className="space-y-3 lg:col-span-2"
        >
          {lines.map((line) => (
            <article
              key={line.productId}
              className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:flex-row sm:items-center"
            >
              <img
                src={line.product.imagen}
                alt={line.product.nombre}
                className="h-24 w-full rounded-xl object-cover sm:w-32"
              />

              <div className="flex-1">
                <h2 className="text-base font-bold text-stone-900">
                  {line.product.nombre}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {line.product.categoria}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {formatCurrency(line.product.precio, settings.currency)} c/u
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg border border-stone-300">
                  <button
                    type="button"
                    onClick={() => decrementItem(line.productId)}
                    aria-label={`Quitar una unidad de ${line.product.nombre}`}
                    className="px-3 py-2 text-lg font-bold text-stone-600 transition hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold text-stone-900">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementItem(line.productId)}
                    aria-label={`Agregar una unidad de ${line.product.nombre}`}
                    className="px-3 py-2 text-lg font-bold text-stone-600 transition hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    +
                  </button>
                </div>

                <span className="min-w-20 text-right text-sm font-bold text-stone-900">
                  {formatCurrency(
                    line.product.precio * line.quantity,
                    settings.currency,
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(line.productId)}
                  aria-label={`Eliminar ${line.product.nombre} del carrito`}
                  className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-base font-bold text-stone-900">Resumen</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">Productos</dt>
              <dd className="font-semibold text-stone-800">
                {lines.reduce((sum, line) => sum + line.quantity, 0)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">Moneda</dt>
              <dd className="font-semibold text-stone-800">
                {settings.currency}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <dt className="font-semibold text-stone-800">Total</dt>
              <dd className="text-lg font-bold text-stone-900">
                {formatCurrency(total, settings.currency)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-stone-200 pt-4">
            <h3 className="text-sm font-bold text-stone-900">
              Datos para la boleta
            </h3>

            <div className="mt-3 space-y-3">
              <div>
                <label
                  htmlFor="cliente-nombre"
                  className="text-xs font-semibold text-stone-700"
                >
                  Nombre del cliente
                </label>
                <input
                  id="cliente-nombre"
                  type="text"
                  value={nombre}
                  onChange={(event) => {
                    setNombre(event.target.value)
                    setError('')
                  }}
                  placeholder="Nombre de prueba"
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label
                  htmlFor="cliente-correo"
                  className="text-xs font-semibold text-stone-700"
                >
                  Correo
                </label>
                <input
                  id="cliente-correo"
                  type="email"
                  value={correo}
                  onChange={(event) => {
                    setCorreo(event.target.value)
                    setError('')
                  }}
                  placeholder="correo@ejemplo.com"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>
          </div>

          <fieldset className="mt-4">
            <legend className="text-sm font-bold text-stone-900">
              Método de pago
            </legend>
            <div className="mt-2 space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = metodoPago === method

                return (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm transition ${
                      isSelected
                        ? 'border-accent font-semibold text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={method}
                      checked={isSelected}
                      onChange={() => setMetodoPago(method)}
                      style={{ accentColor: 'var(--app-accent)' }}
                      className="size-4"
                    />
                    {method}
                  </label>
                )
              })}
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Finalizar compra y generar boleta
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-red-300 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Vaciar carrito
          </button>

          <p className="mt-4 text-xs text-stone-500">
            Compra de demostración con datos de prueba. No se realizan cobros.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default Cart
