import { Link } from 'react-router-dom'
import { formatCurrency } from '../config/format.js'
import { receiptPath } from '../config/routes.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useSettings } from '../settings/SettingsContext.js'

const ESTADOS_COMPLETOS = ['Pagado', 'Entregado']

function Completos() {
  const { orders } = useOrders()
  const { settings } = useSettings()

  const completos = orders.filter((order) =>
    ESTADOS_COMPLETOS.includes(order.estado),
  )
  const totalVendido = completos.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  )
  const ticketPromedio = completos.length
    ? totalVendido / completos.length
    : 0

  const resumen = [
    {
      label: 'Pedidos completados',
      value: String(completos.length),
      detail: 'Pagados o entregados',
    },
    {
      label: 'Total vendido',
      value: formatCurrency(totalVendido, settings.currency),
      detail: 'Suma de pedidos completados',
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(ticketPromedio, settings.currency),
      detail: 'Por pedido completado',
    },
  ]

  return (
    <div className="space-y-8">
      <section aria-labelledby="completos-resumen" className="space-y-4">
        <h1 id="completos-resumen" className="text-2xl font-bold text-stone-900">
          Completos
        </h1>

        <div className="grid gap-4 sm:grid-cols-3">
          {resumen.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-stone-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-stone-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="completos-lista" className="space-y-4">
        <h2 id="completos-lista" className="text-lg font-bold text-stone-900">
          Pedidos completados
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pedido
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Cliente
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Fecha
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pago
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Total
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Boleta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {completos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-4 text-center text-stone-400"
                  >
                    Aún no hay pedidos completados.
                  </td>
                </tr>
              ) : (
                completos.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-stone-700">
                      {order.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-stone-900">
                        {order.cliente?.nombre ?? 'Cliente de prueba'}
                      </p>
                      <p className="text-xs text-stone-500">
                        {order.cliente?.correo ?? '—'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{order.fecha}</td>
                    <td className="px-5 py-4 text-stone-600">
                      {order.metodoPago ?? '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      {formatCurrency(
                        order.total,
                        order.currency ?? settings.currency,
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.items?.length ? (
                        <Link
                          to={receiptPath(order.id)}
                          className="text-xs font-semibold text-accent-strong underline-offset-2 hover:underline"
                        >
                          Ver boleta
                        </Link>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-500">
          Se muestran los pedidos con estado Pagado o Entregado.
        </p>
      </section>
    </div>
  )
}

export default Completos
