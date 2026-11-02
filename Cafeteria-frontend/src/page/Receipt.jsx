import { Link, useParams } from 'react-router-dom'
import { formatCurrency } from '../config/format.js'
import { ROUTES } from '../config/routes.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function Receipt() {
  const { id } = useParams()
  const { orders } = useOrders()
  const { settings } = useSettings()

  const order = orders.find((entry) => entry.id === id)

  if (!order) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">
          Boleta no encontrada
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          No existe un pedido con el folio {id}.
        </p>
        <Link
          to={ROUTES.dashboard}
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Ver mis pedidos
        </Link>
      </section>
    )
  }

  const items = order.items ?? []
  const currency = order.currency ?? settings.currency

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8 print:shadow-none print:ring-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-stone-300 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
              {settings.appName}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-stone-900">
              Boleta de venta
            </h1>
            <p className="text-xs text-stone-500">Documento de prueba</p>
          </div>

          <div className="text-right text-sm">
            <p className="font-mono text-base font-bold text-stone-900">
              {order.id}
            </p>
            <p className="text-stone-500">{order.fecha}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Cliente
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {order.cliente?.nombre ?? 'Cliente de prueba'}
            </p>
            <p className="text-sm text-stone-600">
              {order.cliente?.correo ?? 'Sin correo registrado'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Pago
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {order.metodoPago ?? 'No especificado'}
            </p>
            <p className="text-sm text-stone-600">Estado: {order.estado}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-y border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th scope="col" className="px-2 py-2 font-semibold">
                Cant.
              </th>
              <th scope="col" className="px-2 py-2 font-semibold">
                Descripción
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">
                P. unit.
              </th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">
                Importe
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item, index) => (
              <tr key={`${item.nombre}-${index}`}>
                <td className="px-2 py-2 text-stone-700">{item.cantidad}</td>
                <td className="px-2 py-2 text-stone-800">{item.nombre}</td>
                <td className="px-2 py-2 text-right text-stone-600">
                  {formatCurrency(item.precio, currency)}
                </td>
                <td className="px-2 py-2 text-right font-semibold text-stone-900">
                  {formatCurrency(item.precio * item.cantidad, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
            Este pedido no tiene detalle de productos (pedido de ejemplo).
          </p>
        )}

        <div className="mt-4 flex justify-end border-t border-dashed border-stone-300 pt-4">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Total
            </p>
            <p className="text-2xl font-bold text-stone-900">
              {formatCurrency(order.total, currency)}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500">
          Gracias por tu compra de prueba. Documento sin validez fiscal.
        </p>
      </section>

      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Imprimir boleta
        </button>
        <Link
          to={ROUTES.dashboard}
          className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Ver mis pedidos
        </Link>
        <Link
          to={ROUTES.menu}
          className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

export default Receipt
