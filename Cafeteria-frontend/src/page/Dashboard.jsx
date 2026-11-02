import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import OrderEditor from '../components/OrderEditor.jsx'
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

function Dashboard() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const { orders, updateOrder, deleteOrder } = useOrders()
  const [editingOrder, setEditingOrder] = useState(null)
  const [deletingOrder, setDeletingOrder] = useState(null)
  const nombre = user?.name ?? 'cliente'
  const pedidos = [...orders].reverse()
  const puntos = Math.round(
    orders.reduce((total, order) => total + Number(order.total || 0), 0),
  )

  const resumen = [
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
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
          {settings.appName}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Bienvenido, {nombre}
        </h1>
      </header>

      <section aria-labelledby="resumen-titulo" className="space-y-4">
        <h2 id="resumen-titulo" className="text-2xl font-bold text-stone-900">
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
