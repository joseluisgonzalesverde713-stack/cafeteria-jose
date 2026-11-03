const ENV = import.meta.env

function readEnv(key, fallback) {
  const value = ENV[key]

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return fallback
}

function readNumber(key, fallback) {
  const raw = ENV[key]

  if (typeof raw === 'string' && raw.trim()) {
    const value = Number(raw)

    if (Number.isFinite(value)) {
      return value
    }
  }

  return fallback
}

export const APP_CONFIG = {
  name: readEnv('VITE_APP_NAME', 'Cafetería José Revución'),
  shortName: readEnv('VITE_APP_SHORT_NAME', 'JR'),
  currency: readEnv('VITE_APP_CURRENCY', 'MXN'),
  businessEmail: readEnv(
    'VITE_BUSINESS_EMAIL',
    'contacto@cafeteriajose.com',
  ),
  businessPhone: readEnv('VITE_BUSINESS_PHONE', '+52 55 1234 5678'),
  businessAddress: readEnv(
    'VITE_BUSINESS_ADDRESS',
    'Av. Reforma 123, Ciudad de México',
  ),
  taxRate: readNumber('VITE_TAX_RATE', 0),
  sessionStorageKey: readEnv(
    'VITE_SESSION_STORAGE_KEY',
    'cafeteria-jose:usuario-demo',
  ),
  settingsStorageKey: readEnv(
    'VITE_SETTINGS_STORAGE_KEY',
    'cafeteria-jose:configuracion',
  ),
  productsStorageKey: readEnv(
    'VITE_PRODUCTS_STORAGE_KEY',
    'cafeteria-jose:productos',
  ),
  cartStorageKey: readEnv('VITE_CART_STORAGE_KEY', 'cafeteria-jose:carrito'),
  ordersStorageKey: readEnv(
    'VITE_ORDERS_STORAGE_KEY',
    'cafeteria-jose:pedidos',
  ),
  reservationsStorageKey: readEnv(
    'VITE_RESERVATIONS_STORAGE_KEY',
    'cafeteria-jose:reservas',
  ),
}

export const DEMO_CREDENTIALS = {
  email: readEnv('VITE_DEMO_USER_EMAIL', 'jose.revucio@cafeteriajose.com'),
  password: readEnv('VITE_DEMO_USER_PASSWORD', 'Cafeteria26!'),
}
