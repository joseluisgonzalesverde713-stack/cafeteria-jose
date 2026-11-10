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
  const esNavidad = settings.theme === 'navidad'

  function handleLogout() {
    signOut()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div
      className={`min-h-screen bg-stone-100 text-stone-800 ${
        esNavidad ? 'navidad-fondo' : ''
      }`}
    >
      {esNavidad && (
        <div className="navidad-nieve print:hidden" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className="navidad-copo"
              style={{
                left: `${(index * 100) / 18}%`,
                fontSize: `${10 + (index % 5) * 4}px`,
                animationDelay: `${(index % 9) * 0.9}s`,
                animationDuration: `${9 + (index % 6) * 2}s`,
              }}
            >
              ❄
            </span>
          ))}
        </div>
      )}
      {esNavidad && (
        <div className="navidad-santa-fijo print:hidden" aria-hidden="true">
          <span className="navidad-santa-globo">¡Feliz Navidad!</span>
          <span className="navidad-santa-emoji">🎅</span>
        </div>
      )}
      <div
        aria-hidden="true"
        className={`h-1.5 w-full print:hidden ${
          esNavidad
            ? 'bg-[linear-gradient(90deg,#b91c1c_0%,#b91c1c_25%,#166534_50%,#b91c1c_75%,#b91c1c_100%)]'
            : ''
        }`}
      />
      <header className="border-b border-stone-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-sm font-black tracking-tight text-white">
              {settings.shortName}
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900">
                {settings.appName}{' '}
                {esNavidad && (
                  <span aria-label="Tema navideño" role="img">
                    🎄
                  </span>
                )}
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

      {esNavidad && (
        <div className="navidad-guirnalda print:hidden" aria-hidden="true">
          <span className="navidad-cable" />
          {Array.from({ length: 26 }, (_, index) => {
            const color = ['#ef4444', '#22c55e', '#f59e0b'][index % 3]

            return (
              <span
                key={index}
                className="navidad-luz"
                style={{
                  backgroundColor: color,
                  color,
                  animationDelay: `${(index % 7) * 0.25}s`,
                }}
              />
            )
          })}
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {esNavidad && (
          <div className="navidad-letrero mb-6 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#450a0a_0%,#7f1d1d_45%,#052e16_100%)] px-5 py-4 text-white shadow-sm print:hidden">
            <div>
              <p className="navidad-neon text-base font-black uppercase tracking-[0.15em]">
                🎄 ¡Feliz Navidad! 🎄
              </p>
              <p className="mt-1 text-xs text-white/80">
                Disfruta la temporada con {settings.appName}.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-2xl" aria-hidden="true">
              <span className="navidad-santa">🎅</span>
              <span>🎁</span>
              <span>⭐</span>
              <span>🔔</span>
            </div>
          </div>
        )}
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
