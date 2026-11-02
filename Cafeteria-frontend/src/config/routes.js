export const ROUTES = {
  home: '/',
  login: '/login',
  inicio: '/inicio',
  dashboard: '/dashboard',
  clients: '/clientes',
  menu: '/menu',
  cart: '/carrito',
  receipt: '/boleta/:id',
  settings: '/configuracion',
}

export function receiptPath(id) {
  return `/boleta/${id}`
}

export const NAV_LINKS = [
  { to: ROUTES.inicio, label: '🏠 Inicio' },
  { to: ROUTES.dashboard, label: '📊 Panel' },
  { to: ROUTES.clients, label: '👥 Clientes' },
  { to: ROUTES.menu, label: '☕ Menú' },
  { to: ROUTES.cart, label: '🛒 Carrito' },
  { to: ROUTES.settings, label: '⚙️ Configuración' },
]
