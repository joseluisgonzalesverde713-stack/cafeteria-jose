import { useAuth } from '../auth/AuthContext.js'
import { CURRENCIES, formatCurrency } from '../config/format.js'
import { CATEGORIAS } from '../config/products.js'
import { getTheme } from '../config/theme.js'
import { useOrders } from '../orders/OrdersContext.js'
import { useProducts } from '../products/ProductsContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function ChipList({ items }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function DataRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-stone-900">
        {value}
      </dd>
    </div>
  )
}

function Home() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const { products } = useProducts()
  const { orders } = useOrders()

  const tema = getTheme(settings.theme)
  const nombre = user?.name ?? 'cliente'
  const puntos = Math.round(
    orders.reduce((total, order) => total + Number(order.total || 0), 0),
  )
  const clientes = new Set(
    orders.map(
      (order) =>
        order.cliente?.correo || order.cliente?.nombre || 'sin-cliente',
    ),
  ).size
  const precios = products.map((product) => Number(product.precio) || 0)
  const precioMin = precios.length ? Math.min(...precios) : 0
  const precioMax = precios.length ? Math.max(...precios) : 0

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
      label: 'Clientes',
      value: String(clientes),
      detail: 'Con al menos un pedido',
    },
    {
      label: 'Puntos acumulados',
      value: String(puntos),
      detail: 'Suma de todos los pedidos',
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

      <section aria-labelledby="inicio-resumen" className="space-y-4">
        <h2 id="inicio-resumen" className="text-lg font-bold text-stone-900">
          Datos generales
        </h2>

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
          aria-labelledby="inicio-proyecto"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
        >
          <h2 id="inicio-proyecto" className="text-base font-bold text-stone-900">
            Proyecto
          </h2>
          <dl className="mt-3">
            <DataRow label="Nombre" value={settings.appName} />
            <DataRow label="Nombre corto" value={settings.shortName} />
            <DataRow label="Moneda" value={settings.currency} />
            <DataRow label="Tema" value={tema.label} />
            <DataRow label="Usuario activo" value={user?.email ?? '—'} />
            <DataRow
              label="Tipo de proyecto"
              value="SPA demo de cafetería"
            />
          </dl>
        </section>

        <section
          aria-labelledby="inicio-catalogo"
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
        >
          <h2 id="inicio-catalogo" className="text-base font-bold text-stone-900">
            Catálogo
          </h2>
          <p className="mt-3 text-sm text-stone-500">
            Precios entre{' '}
            <strong className="font-semibold text-stone-900">
              {formatCurrency(precioMin, settings.currency)}
            </strong>{' '}
            y{' '}
            <strong className="font-semibold text-stone-900">
              {formatCurrency(precioMax, settings.currency)}
            </strong>
            .
          </p>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Categorías
          </p>
          <ChipList items={CATEGORIAS} />

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Monedas disponibles
          </p>
          <ChipList items={CURRENCIES} />
        </section>

      </div>

      <section aria-labelledby="inicio-productos" className="space-y-4">
        <h2 id="inicio-productos" className="text-lg font-bold text-stone-900">
          Productos disponibles
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
            >
              <img
                src={product.imagen}
                alt={product.nombre}
                loading="lazy"
                className="h-36 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {product.categoria}
                </p>
                <h3 className="mt-1 text-base font-bold text-stone-900">
                  {product.nombre}
                </h3>
                <p className="mt-2 text-sm font-semibold text-accent-strong">
                  {formatCurrency(product.precio, settings.currency)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-stone-500">
        Información de demostración. Los datos viven en el navegador
        (localStorage y sessionStorage) y no hay backend.
      </p>
    </div>
  )
}

export default Home
