export const ROUTES = {
  home: '/',
  login: '/login',
  registro: '/registro',
  recuperar: '/recuperar',
  restablecer: '/restablecer/:token',
  inicio: '/inicio',
  dashboard: '/dashboard',
  clients: '/clientes',
  reserva: '/reserva',
  informacion: '/informacion',
  completos: '/completos',
  menu: '/menu',
  cart: '/carrito',
  receipt: '/boleta/:id',
  settings: '/configuracion',
}

export function receiptPath(id) {
  return `/boleta/${id}`
}

export function resetPath(token) {
  return `/restablecer/${token}`
}

export const NAV_LINKS = [
  { to: ROUTES.inicio, label: '🏠 Inicio' },
  { to: ROUTES.dashboard, label: '📊 Panel' },
  { to: ROUTES.clients, label: '👥 Clientes' },
  { to: ROUTES.reserva, label: '🛒 Reserva' },
  { to: ROUTES.informacion, label: '📦 Información' },
  { to: ROUTES.completos, label: '📄 Completos' },
  { to: ROUTES.menu, label: '☕ Menú' },
  { to: ROUTES.cart, label: '🛒 Carrito' },
  { to: ROUTES.settings, label: '⚙️ Configuración' },
]
