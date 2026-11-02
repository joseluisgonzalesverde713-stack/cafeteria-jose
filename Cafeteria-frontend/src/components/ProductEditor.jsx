import { useEffect, useState } from 'react'
import { CATEGORIAS, PRODUCT_IMAGES } from '../config/products.js'

const FIELD_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function ProductEditor({ product, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...product }))
  const [error, setError] = useState('')

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nombre = draft.nombre.trim()
    const descripcion = draft.descripcion.trim()
    const precio = Number(draft.precio)

    if (!nombre || !descripcion) {
      setError('El nombre y la descripción son obligatorios.')
      return
    }

    if (!Number.isFinite(precio) || precio < 0) {
      setError('El precio debe ser un número mayor o igual a cero.')
      return
    }

    onSave({ ...draft, nombre, descripcion, precio })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="producto-editor-titulo"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4 py-6"
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="producto-editor-titulo"
              className="text-xl font-bold text-stone-900"
            >
              Editar producto
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Los cambios se guardan en este navegador.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar editor"
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-accent"
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

        <img
          src={draft.imagen}
          alt={draft.nombre || 'Producto'}
          className="mt-4 h-40 w-full rounded-xl object-cover ring-1 ring-stone-200"
        />

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="producto-nombre"
              className="text-sm font-semibold text-stone-800"
            >
              Nombre
            </label>
            <input
              id="producto-nombre"
              type="text"
              value={draft.nombre}
              onChange={(event) => updateField('nombre', event.target.value)}
              className={FIELD_CLASSES}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="producto-categoria"
                className="text-sm font-semibold text-stone-800"
              >
                Categoría
              </label>
              <select
                id="producto-categoria"
                value={draft.categoria}
                onChange={(event) =>
                  updateField('categoria', event.target.value)
                }
                className={FIELD_CLASSES}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="producto-precio"
                className="text-sm font-semibold text-stone-800"
              >
                Precio
              </label>
              <input
                id="producto-precio"
                type="number"
                min="0"
                step="0.5"
                value={draft.precio}
                onChange={(event) => updateField('precio', event.target.value)}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="producto-descripcion"
              className="text-sm font-semibold text-stone-800"
            >
              Descripción
            </label>
            <textarea
              id="producto-descripcion"
              rows="3"
              value={draft.descripcion}
              onChange={(event) =>
                updateField('descripcion', event.target.value)
              }
              className={FIELD_CLASSES}
            />
          </div>

          <div>
            <label
              htmlFor="producto-imagen"
              className="text-sm font-semibold text-stone-800"
            >
              Imagen
            </label>
            <select
              id="producto-imagen"
              value={draft.imagen}
              onChange={(event) => updateField('imagen', event.target.value)}
              className={FIELD_CLASSES}
            >
              {PRODUCT_IMAGES.map((imagen) => (
                <option key={imagen.value} value={imagen.value}>
                  {imagen.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductEditor
