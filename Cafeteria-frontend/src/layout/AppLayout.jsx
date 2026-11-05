import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.js'
import { useCart } from '../cart/CartContext.js'
import { NAV_LINKS, ROUTES } from '../config/routes.js'
import { useSettings } from '../settings/SettingsContext.js'

function navLinkClass({ isActive }) {
  const base =
    'rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'

  return isActive
    ? `${base} bg-accent text-white shadow-sm`
    : `${base} text-stone-600 hover:bg-accent-soft hover:text-accent-strong`
}

function AppLayout() {
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.success

  function handleLogout() {
    signOut()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800">
      <header className="border-b border-stone-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-sm font-black tracking-tight text-white">
              {settings.shortName}
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900">
                {settings.appName}
              </p>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>
          </div>

          <nav
            aria-label="Navegación principal"
            className="flex flex-wrap items-center gap-2"
          >
            {NAV_LINKS.filter((link) => link.to !== ROUTES.settings).map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {link.to === ROUTES.cart && count > 0 && (
                      <span
                        className={`ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-accent text-white'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <NavLink to={ROUTES.settings} className={navLinkClass}>
              ⚙️ Configuración
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-accent-ring hover:text-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {successMessage && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            {successMessage}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
