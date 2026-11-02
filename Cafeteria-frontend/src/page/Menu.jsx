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
  const { products, updateProduct, resetProducts } = useProducts()
  const { items, addItem, count } = useCart()
  const [editingProduct, setEditingProduct] = useState(null)

  function handleSave(nextProduct) {
    updateProduct(nextProduct)
    setEditingProduct(null)
  }

  function handleReset() {
    resetProducts()
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        {count > 0 && (
          <Link
            to={ROUTES.cart}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Ir al carrito ({count})
          </Link>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Restablecer catálogo
        </button>
      </div>

      <section
        aria-label="Productos del menú"
        className="grid gap-4 sm:grid-cols-2"
      >
        {products.map((producto) => (
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
