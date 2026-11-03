import { formatCurrency } from '../config/format.js'
import { HORARIOS, SERVICIOS } from '../config/reservations.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useProducts } from '../products/ProductsContext.js'
import { useReservations } from '../reservations/ReservationsContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function Informacion() {
  const { settings } = useSettings()
  const { products } = useProducts()
  const { orders } = useOrders()
  const { reservations } = useReservations()

  const ventasTotales = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0,
  )

  const resumen = [
    {
      label: 'Productos',
      value: String(products.length),
      detail: 'En el catálogo actual',
    },
    {
      label: 'Pedidos',
      value: String(orders.length),
      detail: 'Registrados en el demo',
    },
    {
      label: 'Reservas',
      value: String(reservations.length),
      detail: 'Mesas reservadas',
    },
    {
      label: 'Ventas totales',
      value: formatCurrency(ventasTotales, settings.currency),
      detail: 'Suma de todos los pedidos',
    },
  ]

  const datos = [
    { label: 'Nombre', value: settings.appName },
    { label: 'Nombre corto', value: settings.shortName },
    { label: 'Correo', value: settings.businessEmail || '—' },
    { label: 'Teléfono', value: settings.businessPhone || '—' },
    { label: 'Dirección', value: settings.businessAddress || '—' },
    { label: 'Moneda', value: settings.currency },
    { label: 'Impuesto', value: `${Number(settings.taxRate) || 0}%` },
  ]

  return (
    <div className="space-y-8">
      <section aria-labelledby="informacion-resumen" className="space-y-4">
        <h1
          id="informacion-resumen"
          className="text-2xl font-bold text-stone-900"
        >
          Información
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <section
          aria-labelledby="informacion-negocio"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
        >
          <h2
            id="informacion-negocio"
            className="text-lg font-bold text-stone-900"
          >
            Datos del negocio
          </h2>

          <dl className="mt-3">
            {datos.map((dato) => (
              <div
                key={dato.label}
                className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0"
              >
                <dt className="text-sm text-stone-500">{dato.label}</dt>
                <dd className="text-right text-sm font-semibold text-stone-900">
                  {dato.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="informacion-horarios"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
        >
          <h2
            id="informacion-horarios"
            className="text-lg font-bold text-stone-900"
          >
            Horarios de atención
          </h2>

          <dl className="mt-3">
            {HORARIOS.map((horario) => (
              <div
                key={horario.dia}
                className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0"
              >
                <dt className="text-sm text-stone-500">{horario.dia}</dt>
                <dd className="text-sm font-semibold text-stone-900">
                  {horario.horario}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Servicios
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {SERVICIOS.map((servicio) => (
              <li
                key={servicio}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong"
              >
                {servicio}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="text-xs text-stone-500">
        Información de demostración. Puedes cambiar el nombre, contacto,
        dirección e impuesto desde Configuración.
      </p>
    </div>
  )
}

export default Informacion
