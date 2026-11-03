import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.js'
import { getDefaultSettings } from '../config/defaults.js'
import { DEMO_CREDENTIALS } from '../config/env.js'
import { CURRENCIES, formatCurrency } from '../config/format.js'
import { getTheme, THEMES } from '../config/theme.js'
import { useSettings } from '../settings/SettingsContext.js'

const FIELD_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

function Settings() {
  const { user } = useAuth()
  const { settings, saveSettings, resetSettings } = useSettings()
  const [draft, setDraft] = useState(() => ({ ...settings }))
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const previewTheme = getTheme(draft.theme)
  const previewTaxRate = Number(draft.taxRate) || 0
  const previewPrice = 35
  const previewTax = (previewPrice * previewTaxRate) / 100

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
    setError('')
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const appName = draft.appName.trim()
    const shortName = draft.shortName.trim()
    const businessEmail = (draft.businessEmail ?? '').trim()
    const businessPhone = (draft.businessPhone ?? '').trim()
    const businessAddress = (draft.businessAddress ?? '').trim()
    const taxRate = Number(draft.taxRate) || 0

    if (!appName || !shortName) {
      setError('El nombre y el nombre corto son obligatorios.')
      setMessage('')
      return
    }

    if (businessEmail && !businessEmail.includes('@')) {
      setError('Ingresa un correo de contacto válido.')
      setMessage('')
      return
    }

    if (taxRate < 0 || taxRate > 100) {
      setError('El impuesto debe ser un número entre 0 y 100.')
      setMessage('')
      return
    }

    const nextSettings = {
      ...draft,
      appName,
      shortName,
      businessEmail,
      businessPhone,
      businessAddress,
      taxRate,
    }
    saveSettings(nextSettings)
    setDraft(nextSettings)
    setError('')
    setMessage('Configuración guardada y aplicada a toda la aplicación.')
  }

  function handleReset() {
    const defaults = getDefaultSettings()
    resetSettings()
    setDraft(defaults)
    setError('')
    setMessage('Configuración restablecida a los valores de .env.')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6 lg:col-span-2"
        >
          <h2 className="text-base font-bold text-stone-900">
            Ajustes de la aplicación
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="appName"
                className="text-sm font-semibold text-stone-800"
              >
                Nombre de la aplicación
              </label>
              <input
                id="appName"
                type="text"
                value={draft.appName}
                onChange={(event) => updateField('appName', event.target.value)}
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="shortName"
                className="text-sm font-semibold text-stone-800"
              >
                Nombre corto
              </label>
              <input
                id="shortName"
                type="text"
                maxLength={4}
                value={draft.shortName}
                onChange={(event) => updateField('shortName', event.target.value)}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="text-sm font-semibold text-stone-800"
            >
              Moneda
            </label>
            <select
              id="currency"
              value={draft.currency}
              onChange={(event) => updateField('currency', event.target.value)}
              className={FIELD_CLASSES}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-stone-500">
              Se usa para formatear los precios del menú y los pedidos.
            </p>
          </div>

          <div className="space-y-5 border-t border-stone-200 pt-5">
            <h3 className="text-sm font-bold text-stone-900">
              Información del negocio
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="businessEmail"
                  className="text-sm font-semibold text-stone-800"
                >
                  Correo de contacto
                </label>
                <input
                  id="businessEmail"
                  type="email"
                  value={draft.businessEmail}
                  onChange={(event) =>
                    updateField('businessEmail', event.target.value)
                  }
                  placeholder="contacto@ejemplo.com"
                  className={FIELD_CLASSES}
                />
              </div>

              <div>
                <label
                  htmlFor="businessPhone"
                  className="text-sm font-semibold text-stone-800"
                >
                  Teléfono
                </label>
                <input
                  id="businessPhone"
                  type="tel"
                  value={draft.businessPhone}
                  onChange={(event) =>
                    updateField('businessPhone', event.target.value)
                  }
                  placeholder="+52 55 1234 5678"
                  className={FIELD_CLASSES}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="businessAddress"
                className="text-sm font-semibold text-stone-800"
              >
                Dirección
              </label>
              <input
                id="businessAddress"
                type="text"
                value={draft.businessAddress}
                onChange={(event) =>
                  updateField('businessAddress', event.target.value)
                }
                placeholder="Calle, número, ciudad"
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="taxRate"
                className="text-sm font-semibold text-stone-800"
              >
                Impuesto (%)
              </label>
              <input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={draft.taxRate}
                onChange={(event) => updateField('taxRate', event.target.value)}
                className={FIELD_CLASSES}
              />
              <p className="mt-2 text-xs text-stone-500">
                Se suma al total del carrito y se muestra en la boleta.
              </p>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-stone-800">
              Color de acento
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {Object.entries(THEMES).map(([key, theme]) => {
                const isSelected = draft.theme === key

                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition ${
                      isSelected
                        ? 'text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                    style={
                      isSelected ? { borderColor: theme.accent } : undefined
                    }
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={key}
                      checked={isSelected}
                      onChange={() => updateField('theme', key)}
                      className="sr-only"
                    />
                    <span
                      className="size-5 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: theme.accent }}
                    />
                    {theme.label}
                  </label>
                )
              })}
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              {message}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Restablecer
            </button>
          </div>
        </form>

        <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-base font-bold text-stone-900">Vista previa</h2>
          <p className="mt-1 text-xs text-stone-500">
            Se actualiza antes de guardar.
          </p>

          <div className="mt-4 rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-lg text-xs font-black text-white"
                style={{ backgroundColor: previewTheme.accent }}
              >
                {draft.shortName || 'JR'}
              </span>
              <p className="text-sm font-bold text-stone-900">
                {draft.appName || 'Nombre de la aplicación'}
              </p>
            </div>

            <div
              className="mt-4 flex items-center justify-between rounded-xl px-3 py-2"
              style={{ backgroundColor: previewTheme.soft }}
            >
              <span className="text-sm text-stone-700">Café americano</span>
              <span
                className="text-sm font-semibold"
                style={{ color: previewTheme.dark }}
              >
                {formatCurrency(previewPrice, draft.currency)}
              </span>
            </div>

            {previewTax > 0 && (
              <div className="mt-2 flex items-center justify-between px-3 text-xs text-stone-500">
                <span>Impuesto ({previewTaxRate}%)</span>
                <span>{formatCurrency(previewTax, draft.currency)}</span>
              </div>
            )}

            <span
              className="mt-4 inline-flex rounded-lg px-4 py-2 text-xs font-semibold text-white"
              style={{ backgroundColor: previewTheme.accent }}
            >
              Botón de ejemplo
            </span>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Sesión activa</dt>
              <dd className="font-semibold text-emerald-700">{user?.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Correo demo</dt>
              <dd className="font-mono text-xs text-stone-800">
                {DEMO_CREDENTIALS.email}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Contacto</dt>
              <dd className="truncate text-xs font-semibold text-stone-800">
                {draft.businessEmail || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Teléfono</dt>
              <dd className="text-xs font-semibold text-stone-800">
                {draft.businessPhone || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Dirección</dt>
              <dd className="text-right text-xs font-semibold text-stone-800">
                {draft.businessAddress || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-stone-500">Impuesto</dt>
              <dd className="font-semibold text-stone-800">{previewTaxRate}%</dd>
            </div>
          </dl>
        </article>
      </div>

      <p className="rounded-xl border border-dashed border-accent-ring bg-accent-soft px-4 py-3 text-sm text-accent-dark">
        Los ajustes se guardan en <code className="font-mono">localStorage</code>.
        Los valores iniciales provienen de <code className="font-mono">.env</code>
        ; si cambias ese archivo, reinicia el servidor de Vite.
      </p>
    </div>
  )
}

export default Settings
