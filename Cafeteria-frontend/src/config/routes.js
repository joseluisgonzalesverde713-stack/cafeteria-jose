export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  menu: '/menu',
  cart: '/carrito',
  receipt: '/boleta/:id',
  settings: '/configuracion',
}

export function receiptPath(id) {
  return `/boleta/${id}`
}

export const NAV_LINKS = [
  { to: ROUTES.dashboard, label: 'Panel' },
  { to: ROUTES.menu, label: 'Menú' },
  { to: ROUTES.cart, label: 'Carrito' },
  { to: ROUTES.settings, label: 'Configuración' },
]
