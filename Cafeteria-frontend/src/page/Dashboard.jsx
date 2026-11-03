import { useState } from 'react'
import { Link } from 'react-router-dom'
import OrderEditor from '../components/OrderEditor.jsx'
import SystemStatus from '../components/SystemStatus.jsx'
import { formatCurrency } from '../config/format.js'
import { receiptPath } from '../config/routes.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function getFavoriteProduct(orders) {
  const counts = new Map()

  for (const order of orders) {
    for (const item of order.items ?? []) {
      const nombre = item?.nombre

      if (!nombre) {
        continue
      }

      const cantidad = Number(item.cantidad) || 1
      counts.set(nombre, (counts.get(nombre) ?? 0) + cantidad)
    }
  }

  let favorito = null
  let maximo = 0

  for (const [nombre, cantidad] of counts) {
    if (cantidad > maximo) {
      favorito = nombre
      maximo = cantidad
    }
  }

  return favorito ?? 'Sin compras'
}

function countActiveClients(orders) {
  const clients = new Set()

  for (const order of orders) {
    const cliente = order.cliente ?? {}
    const key = cliente.correo || cliente.nombre

    if (key) {
      clients.add(key)
    }
  }

  return clients.size
}

function parseOrderDate(fecha) {
  if (!fecha) {
    return null
  }

  const text = String(fecha).trim()
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  if (slash) {
    const [, day, month, year] = slash
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)

  if (iso) {
    const [, year, month, day] = iso
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const parsed = new Date(text)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDate(date) {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getSalesPeriod(orders) {
  let first = null
  let last = null

  for (const order of orders) {
    const date = parseOrderDate(order.fecha)

    if (!date) {
      continue
    }

    if (!first || date < first) {
      first = date
    }

    if (!last || date > last) {
      last = date
    }
  }

  if (!first) {
    return { label: 'Sin ventas', detail: 'Aún no hay pedidos' }
  }

  const label =
    first.getTime() === last.getTime()
      ? formatDate(first)
      : `${formatDate(first)} – ${formatDate(last)}`

  return { label, detail: 'Desde el primer pedido hasta el último' }
}

function getSalesByPeriod(orders) {
  const groups = new Map()

  for (const order of orders) {
    const fecha = order.fecha ?? 'Sin fecha'
    const entry = groups.get(fecha) ?? {
      fecha,
      date: parseOrderDate(fecha),
      pedidos: 0,
      total: 0,
    }

    entry.pedidos += 1
    entry.total += Number(order.total || 0)
    groups.set(fecha, entry)
  }

  return [...groups.values()].sort((a, b) => {
    if (a.date && b.date) {
      return a.date - b.date
    }

    if (a.date) {
      return -1
    }

    if (b.date) {
      return 1
    }

    return a.fecha.localeCompare(b.fecha)
  })
}

function getPaymentBreakdown(orders) {
  const groups = new Map()

  for (const order of orders) {
    const metodo = order.metodoPago ?? 'Sin definir'
    const entry = groups.get(metodo) ?? { metodo, pedidos: 0, total: 0 }

    entry.pedidos += 1
    entry.total += Number(order.total || 0)
    groups.set(metodo, entry)
  }

  const list = [...groups.values()].sort((a, b) => b.total - a.total)
  const totalGeneral = list.reduce((sum, entry) => sum + entry.total, 0)

  return list.map((entry) => ({
    ...entry,
    porcentaje:
      totalGeneral > 0 ? Math.round((entry.total / totalGeneral) * 100) : 0,
  }))
}

function Dashboard() {
  const { settings } = useSettings()
  const { orders, updateOrder, deleteOrder } = useOrders()
  const [editingOrder, setEditingOrder] = useState(null)
  const [deletingOrder, setDeletingOrder] = useState(null)
  const pedidos = [...orders].reverse()
  const ventasTotales = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  )
  const puntos = Math.round(ventasTotales)
  const clientesActivos = countActiveClients(orders)
  const ventasPorPeriodo = getSalesByPeriod(orders)
  const metodos = getPaymentBreakdown(orders)
  const metodoMasUsado = [...metodos].sort((a, b) => b.pedidos - a.pedidos)[0]
  const periodo = getSalesPeriod(orders)

  const resumen = [
    {
      label: 'Ventas totales',
      value: formatCurrency(ventasTotales, settings.currency),
      detail: 'Suma de todos tus pedidos',
    },
    {
      label: 'Método más usado',
      value: metodoMasUsado?.metodo ?? 'Sin datos',
      detail: metodoMasUsado
        ? `${metodoMasUsado.pedidos} pedido${metodoMasUsado.pedidos === 1 ? '' : 's'}`
        : 'Aún no hay pedidos',
    },
    {
      label: 'Periodo de ventas',
      value: periodo.label,
      detail: periodo.detail,
    },
    {
      label: 'Pedidos registrados',
      value: String(orders.length),
      detail: 'Incluye compras de prueba',
    },
    {
      label: 'Puntos acumulados',
      value: String(puntos),
      detail: 'Calculados con tus pedidos',
    },
    {
      label: 'Producto favorito',
      value: getFavoriteProduct(orders),
      detail: 'Según tus productos comprados',
    },
  ]

  return (
    <div className="space-y-8">
      <section aria-labelledby="resumen-titulo" className="space-y-4">
        <h2 id="resumen-titulo" className="text-2xl font-bold text-stone-900">
          Resumen
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <section aria-labelledby="estado-sistema-titulo" className="space-y-4">
        <h2
          id="estado-sistema-titulo"
          className="text-lg font-bold text-stone-900"
        >
          Estado del sistema
        </h2>
        <SystemStatus usuariosActivos={clientesActivos} />
      </section>

      <section aria-labelledby="periodo-titulo" className="space-y-4">
        <h2 id="periodo-titulo" className="text-lg font-bold text-stone-900">
          Ventas por periodo
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Fecha
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pedidos
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Ventas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ventasPorPeriodo.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-4 text-center text-stone-400"
                  >
                    Aún no hay ventas registradas.
                  </td>
                </tr>
              ) : (
                ventasPorPeriodo.map((item) => (
                  <tr key={item.fecha}>
                    <td className="px-5 py-4 font-medium text-stone-700">
                      {item.fecha}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {item.pedidos}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      {formatCurrency(item.total, settings.currency)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="metodos-titulo" className="space-y-4">
        <h2 id="metodos-titulo" className="text-lg font-bold text-stone-900">
          Desglose por método de pago
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Método
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pedidos
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Ventas
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Participación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {metodos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-4 text-center text-stone-400"
                  >
                    Aún no hay métodos de pago registrados.
                  </td>
                </tr>
              ) : (
                metodos.map((item) => (
                  <tr key={item.metodo}>
                    <td className="px-5 py-4 font-medium text-stone-700">
                      {item.metodo}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {item.pedidos}
                    </td>
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      {formatCurrency(item.total, settings.currency)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${item.porcentaje}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-stone-500">
                          {item.porcentaje}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="pedidos-titulo" className="space-y-4">
        <h2 id="pedidos-titulo" className="text-lg font-bold text-stone-900">
          Pedidos recientes
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pedido
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Fecha
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Total
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Pago
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Boleta
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-stone-700">
                    {pedido.id}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{pedido.fecha}</td>
                  <td className="px-5 py-4 font-semibold text-stone-900">
                    {formatCurrency(
                      pedido.total,
                      pedido.currency ?? settings.currency,
                    )}
                  </td>
                  <td className="px-5 py-4 text-stone-600">
                    {pedido.metodoPago ?? '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {pedido.items?.length ? (
                      <Link
                        to={receiptPath(pedido.id)}
                        className="text-xs font-semibold text-accent-strong underline-offset-2 hover:underline"
                      >
                        Ver boleta
                      </Link>
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingOrder(pedido)}
                        aria-label={`Editar pedido ${pedido.id}`}
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingOrder(pedido)}
                        aria-label={`Eliminar pedido ${pedido.id}`}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-500">
          Información de demostración. Las compras que finalices desde el
          carrito se agregan a esta tabla.
        </p>
      </section>

      {editingOrder && (
        <OrderEditor
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={(nextOrder) => {
            updateOrder(nextOrder)
            setEditingOrder(null)
          }}
        />
      )}

      {deletingOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="eliminar-pedido-titulo"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2
              id="eliminar-pedido-titulo"
              className="text-lg font-bold text-stone-900"
            >
              Eliminar pedido
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              ¿Seguro que quieres eliminar el pedido{' '}
              <strong>{deletingOrder.id}</strong>? Esta acción no se puede
              deshacer.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteOrder(deletingOrder.id)
                  setDeletingOrder(null)
                }}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
