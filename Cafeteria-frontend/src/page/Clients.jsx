import { formatCurrency } from '../config/format.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function clientKey(order) {
  const cliente = order.cliente ?? {}
  return cliente.correo || cliente.nombre || 'sin-cliente'
}

function buildClientStats(orders) {
  const stats = new Map()

  for (const order of orders) {
    const cliente = order.cliente ?? {}
    const key = clientKey(order)
    const total = Number(order.total) || 0
    const actual = stats.get(key)

    if (actual) {
      actual.pedidos += 1
      actual.total += total
      actual.currency = order.currency ?? actual.currency
      actual.ultimaCompra = order.fecha ?? actual.ultimaCompra
      continue
    }

    stats.set(key, {
      key,
      nombre: cliente.nombre ?? 'Cliente sin nombre',
      correo: cliente.correo ?? '—',
      pedidos: 1,
      total,
      currency: order.currency,
      ultimaCompra: order.fecha ?? '—',
    })
  }

  return [...stats.values()]
    .map((cliente) => ({
      ...cliente,
      puntos: Math.round(cliente.total),
    }))
    .sort((a, b) => b.puntos - a.puntos)
}

function Clients() {
  const { orders } = useOrders()
  const { settings } = useSettings()
  const clientes = buildClientStats(orders)
  const puntosTotales = clientes.reduce(
    (total, cliente) => total + cliente.puntos,
    0,
  )
  const resumen = [
    {
      label: 'Clientes registrados',
      value: String(clientes.length),
      detail: 'Con al menos un pedido',
    },
    {
      label: 'Puntos acumulados',
      value: String(puntosTotales),
      detail: 'Suma de todos los clientes',
    },
    {
      label: 'Cliente destacado',
      value: clientes[0]?.nombre ?? 'Sin compras',
      detail: clientes[0]
        ? `${clientes[0].puntos} puntos`
        : 'Aún no hay pedidos',
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
          {settings.appName}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Clientes</h1>
        <p className="mt-1 text-sm text-stone-500">
          Estadísticas de puntos acumulados por cliente según sus pedidos.
        </p>
      </header>

      <section aria-labelledby="clientes-resumen" className="space-y-4">
        <h2
          id="clientes-resumen"
          className="text-lg font-bold text-stone-900"
        >
          Resumen
        </h2>

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

      <section aria-labelledby="clientes-titulo" className="space-y-4">
        <h2 id="clientes-titulo" className="text-lg font-bold text-stone-900">
          Puntos por cliente
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Cliente
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pedidos
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Total gastado
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Última compra
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Puntos acumulados
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {clientes.map((cliente) => (
                <tr key={cliente.key}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-stone-900">
                      {cliente.nombre}
                    </p>
                    <p className="text-xs text-stone-500">{cliente.correo}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{cliente.pedidos}</td>
                  <td className="px-5 py-4 font-semibold text-stone-900">
                    {formatCurrency(
                      cliente.total,
                      cliente.currency ?? settings.currency,
                    )}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {cliente.ultimaCompra}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                      {cliente.puntos} puntos
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-500">
          Información de demostración. Los puntos se calculan con el total de los
          pedidos de cada cliente.
        </p>
      </section>
    </div>
  )
}

export default Clients
