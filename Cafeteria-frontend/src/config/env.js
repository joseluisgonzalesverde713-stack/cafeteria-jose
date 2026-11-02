const ENV = import.meta.env

function readEnv(key, fallback) {
  const value = ENV[key]

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return fallback
}

export const APP_CONFIG = {
  name: readEnv('VITE_APP_NAME', 'Cafetería José Revución'),
  shortName: readEnv('VITE_APP_SHORT_NAME', 'JR'),
  currency: readEnv('VITE_APP_CURRENCY', 'MXN'),
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
}

export const DEMO_CREDENTIALS = {
  email: readEnv('VITE_DEMO_USER_EMAIL', 'jose.revucio@cafeteriajose.com'),
  password: readEnv('VITE_DEMO_USER_PASSWORD', 'Cafeteria26!'),
}
