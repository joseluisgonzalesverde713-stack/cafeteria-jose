import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductEditor from '../components/ProductEditor.jsx'
import { useCart } from '../cart/CartContext.js'
import { formatCurrency } from '../config/format.js'
import { ROUTES } from '../config/routes.js'
import { useProducts } from '../products/ProductsContext.js'
import { useSettings } from '../settings/SettingsContext.js'

function Menu() {
  const { settings } = useSettings()
  const { products, updateProduct } = useProducts()
  const { items, addItem, count } = useCart()
  const [editingProduct, setEditingProduct] = useState(null)
  const [query, setQuery] = useState('')

  const term = query.trim().toLowerCase()
  const filteredProducts = term
    ? products.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(term) ||
          producto.categoria.toLowerCase().includes(term),
      )
    : products

  function handleSave(nextProduct) {
    updateProduct(nextProduct)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar productos por nombre o categoría"
            aria-label="Buscar productos"
            className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {count > 0 && (
            <Link
              to={ROUTES.cart}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Ir al carrito ({count})
            </Link>
          )}
        </div>
      </div>

      <section
        aria-label="Productos del menú"
        className="grid gap-4 sm:grid-cols-2"
      >
        {filteredProducts.map((producto) => (
          <article
            key={producto.id}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              className="h-44 w-full object-cover"
            />

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-stone-900">
                    {producto.nombre}
                  </h2>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dark">
                    {formatCurrency(producto.precio, settings.currency)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {producto.descripcion}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {producto.categoria}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(producto)}
                    className="rounded-lg border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => addItem(producto.id)}
                    className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {items.some((item) => item.productId === producto.id) && (
                <p className="mt-2 text-xs font-medium text-accent-strong">
                  En el carrito:{' '}
                  {
                    items.find((item) => item.productId === producto.id)
                      .quantity
                  }
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-stone-500 shadow-sm ring-1 ring-stone-200">
          No se encontraron productos para “{query.trim()}”.
        </p>
      )}

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default Menu
