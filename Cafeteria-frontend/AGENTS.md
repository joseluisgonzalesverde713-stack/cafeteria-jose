# AGENTS.md

## Overview

React 19 + Vite 8 single-page app in JavaScript/JSX (no TypeScript, no backend in this repo). The UI is still largely the Vite starter template; don't assume cafeteria-specific features or an API layer exist.

## Reglas

- Responde siempre en español.
- Usa solo React y Tailwind.
- Cada pantalla debe cumplir los criterios de aceptación de su historia.
- Explica qué archivos cambias y por qué.
- Usa datos de prueba, no datos reales.
- `react-router-dom` es la única librería de enrutamiento y control de acceso; no agregues otra ni implementes redirecciones con `window.location`.
- `BrowserRouter` se monta una sola vez en `src/main.jsx`; las rutas se declaran solo en `src/App.jsx`.
- Toda pantalla privada debe colgar de `src/routes/ProtectedRoute.jsx`. Las pantallas públicas (como `/login`) deben colgar de `src/routes/PublicOnlyRoute.jsx` para redirigir a quien ya inició sesión.
- Usa `<Navigate replace />` para redirecciones declarativas y `useNavigate` para redirecciones tras una acción. Enlaces internos con `<Link>` o `<NavLink>`, nunca `<a href>`.
- El estado de sesión vive únicamente en `AuthProvider` y se consume con `useAuth`; no dupliques el estado de autenticación dentro de las pantallas.
- No inventes backend ni persistencia remota: la sesión de demostración se guarda en `sessionStorage` y los datos de pantalla son de prueba.

## Enrutamiento y acceso

Las rutas y los enlaces de navegación se definen solo en `src/config/routes.js` (`ROUTES` y `NAV_LINKS`). No escribas rutas como texto plano en pantallas, guards ni layouts.

Rutas actuales declaradas en `src/App.jsx`:

- `/` → redirige a `/dashboard` (que a su vez manda a `/login` si no hay sesión).
- `/login` → pública; si ya hay sesión redirige a `/dashboard`.
- `/dashboard` → privada, dentro de `AppLayout`.
- `/menu` → privada, dentro de `AppLayout`.
- `/carrito` → privada; carrito, datos del cliente, método de pago y finalización.
- `/boleta/:id` → privada; boleta de venta imprimible del pedido.
- `/configuracion` → privada; muestra la configuración activa y la paleta.
- `*` → redirige a `/`.

`ProtectedRoute` guarda la ubicación de origen en `state.from`; `Login` la usa para volver a la pantalla solicitada después de autenticarse.

`vite.config.js` usa `appType: 'spa'` y `public/_redirects` (`/* /index.html 200`) para que las rutas funcionen al recargar en alojamiento estático.

## Configuración

- `src/config/env.js` centraliza la lectura de variables `VITE_*` con valores por defecto. Las pantallas no deben leer `import.meta.env` directamente.
- `.env.example` documenta las variables; `.env` es local y está ignorado por git.
- Variables: `VITE_APP_NAME`, `VITE_APP_SHORT_NAME`, `VITE_APP_CURRENCY`, `VITE_SESSION_STORAGE_KEY`, `VITE_SETTINGS_STORAGE_KEY`, `VITE_PRODUCTS_STORAGE_KEY`, `VITE_CART_STORAGE_KEY`, `VITE_ORDERS_STORAGE_KEY`, `VITE_DEMO_USER_EMAIL`, `VITE_DEMO_USER_PASSWORD`.
- Los valores de `.env.example` son datos de prueba, nunca credenciales reales.
- El tema de Tailwind v4 se configura en `src/index.css` con `@theme` (paletas `brand` y `coffee`, fuente `sans`). No crear `tailwind.config.js`.

La configuración es funcional, no solo informativa:

- `src/settings/SettingsProvider.jsx` mantiene los ajustes en `localStorage` (`APP_CONFIG.settingsStorageKey`) y los expone con `useSettings`.
- Ajustes editables: nombre de la app, nombre corto, moneda y color de acento (`src/config/theme.js`).
- El color se aplica en tiempo de ejecución escribiendo variables CSS (`--app-accent*`) en `document.documentElement`; los componentes usan las utilidades `accent`, `accent-strong`, `accent-dark`, `accent-soft` y `accent-ring`.
- No uses clases `orange-*` en pantallas nuevas: usa los tokens `accent-*` para respetar el tema elegido.
- La moneda se formatea con `formatCurrency` de `src/config/format.js`; guarda precios como números, no como texto.
- `Settings.jsx` usa un borrador local con vista previa; al guardar se aplica a toda la app, al restablecer vuelve a `getDefaultSettings()` (valores de `.env`).

## Catálogo de productos

- Los productos por defecto viven en `src/config/products.js` (`DEFAULT_PRODUCTS`, `CATEGORIAS`, `PRODUCT_IMAGES`) y son datos de prueba.
- `Menu.jsx` no debe declarar productos locales: consume `useProducts()` y muestra una tarjeta por producto con su imagen.
- Editar desde la UI abre `ProductEditor`, que permite cambiar nombre, categoría, precio, descripción e imagen; los cambios persisten en `localStorage` bajo `APP_CONFIG.productsStorageKey`.
- Los precios se guardan como números y se muestran con `formatCurrency` según la moneda configurada.
- Las imágenes son SVG locales en `public/productos/`; si agregas una imagen nueva, regístrala también en `PRODUCT_IMAGES` para poder asignarla desde el editor.
- "Restablecer catálogo" borra la copia local y vuelve a `DEFAULT_PRODUCTS`.

## Carrito y compras

- El carrito guarda solo `{ productId, quantity }`; los datos del producto se resuelven con `useProducts()` para respetar las ediciones.
- `Menu.jsx` agrega productos con `addItem` y muestra el contador del carrito.
- `Cart.jsx` calcula totales con `formatCurrency`, permite cambiar cantidades, eliminar y vaciar. Antes de comprar pide nombre, correo y método de pago (`Efectivo`, `Tarjeta`, `Transferencia`).
- "Finalizar compra y generar boleta" crea un pedido de demostración con `addOrder` (estado `Pagado`, `metodoPago` y `cliente`), vacía el carrito y navega a `/boleta/:id`. No hay cobros ni backend.
- `Receipt.jsx` muestra la boleta con folio, fecha, cliente, método de pago, detalle de productos y total; incluye `window.print()` para imprimir. El header usa `print:hidden`.
- `Dashboard.jsx` muestra los pedidos desde `useOrders()` con su método de pago y enlace "Ver boleta" cuando el pedido tiene detalle; cada pedido conserva su `currency` para formatear su total correctamente.
- En "Pedidos recientes" se puede **Editar** (cliente, método de pago y estado con `OrderEditor`) y **Eliminar** (con confirmación). Usa `updateOrder` y `deleteOrder` de `useOrders`; no modifiques el array de pedidos directamente.
- Los métodos de pago y estados permitidos viven en `src/config/payments.js` (`PAYMENT_METHODS`, `ORDER_ESTADOS`); reutilízalos en formularios nuevos.
- El resumen del Panel se calcula con los pedidos: cantidad de pedidos, puntos (suma de totales) y producto favorito (mayor cantidad comprada en `order.items`). No uses valores fijos en esas tarjetas.
- Los pedidos iniciales de prueba viven en `src/config/orders.js` (`DEFAULT_ORDERS`, `DEMO_CLIENT`) con `metodoPago`, `cliente` e `items` coherentes con su total.
- `OrdersProvider` normaliza los pedidos guardados para completar `metodoPago`, `cliente` e `items` faltantes; así los pedidos antiguos también muestran pago y boleta.
- La boleta y los métodos de pago son de demostración: nunca agregues cobros reales ni datos personales reales.

## Commands

- Install: `npm install` (uses `package-lock.json`)
- Dev server: `npm run dev` (Vite, default http://localhost:5173)
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint` (runs `eslint .`)

There is no test runner and no typecheck script. Do not invent one; verify changes with `npm run lint` and `npm run build`.

## Structure

- `src/main.jsx` mounts `<BrowserRouter><SettingsProvider><ProductsProvider><OrdersProvider><CartProvider><AuthProvider><App /></AuthProvider></CartProvider></OrdersProvider></ProductsProvider></SettingsProvider></BrowserRouter>` into `#root` and imports `src/index.css` (Tailwind entry).
- `src/App.jsx` declares all routes with `Routes`/`Route` and redirects.
- `src/auth/` holds the demo session: `AuthContext.js` (context + `useAuth`) and `AuthProvider.jsx` (session state in `sessionStorage`).
- `src/config/` holds `env.js` (`APP_CONFIG`, `DEMO_CREDENTIALS`), `routes.js` (`ROUTES`, `NAV_LINKS`), `theme.js` (`THEMES`), `defaults.js` and `format.js`.
- `src/settings/` holds `SettingsContext.js` (context + `useSettings`) and `SettingsProvider.jsx` (persistent runtime settings).
- `src/products/` holds `ProductsContext.js` (context + `useProducts`) and `ProductsProvider.jsx` (editable catalog persisted in `localStorage`).
- `src/cart/` holds `CartContext.js` (context + `useCart`) and `CartProvider.jsx` (cart persisted in `localStorage`).
- `src/orders/` holds `OrdersContext.js` (context + `useOrders`) and `OrdersProvider.jsx` (demo orders persisted in `localStorage`).
- `src/components/ProductEditor.jsx` is the product edit modal.
- `src/components/OrderEditor.jsx` is the order edit modal (cliente, pago y estado).
- `public/productos/` holds the SVG product illustrations served from `/productos/...`.
- `src/routes/` holds `ProtectedRoute.jsx` and `PublicOnlyRoute.jsx`.
- `src/layout/AppLayout.jsx` renders the private header, `NavLink`s and `<Outlet />`.
- `src/page/` holds screens: `Login.jsx`, `Dashboard.jsx`, `Menu.jsx`, `Cart.jsx`, `Receipt.jsx`, `Settings.jsx`.
- `src/assets/` images are imported as ES modules (e.g. `import heroImg from './assets/hero.png'`).
- `public/` is served from `/` (e.g. `/icons.svg`, `/favicon.svg`).
- `index.html` is the Vite entry point.

## Toolchain quirks

- Tailwind v4 only: loaded via the `@tailwindcss/vite` plugin in `vite.config.js` and `@import "tailwindcss";` in `src/index.css`. There is no `tailwind.config.js`; do not add one or use v3 directives (`@tailwind base/components/utilities`).
- Import from the `tailwindcss` package. The `css` and `tailwind` packages in `dependencies` are unused/stray — don't import from them.
- `src/App.css` uses native CSS nesting and theme CSS variables (`--accent`, `--border`, etc.), not Tailwind utilities. Put component styles there; keep global Tailwind imports in `index.css`.
- ESLint uses flat config (`eslint.config.js`); there is no `.eslintrc`. It lints `**/*.{js,jsx}` and ignores `dist`.
- Dependencies are intentionally current (React 19, Vite 8, ESLint 10); check current docs instead of relying on older API assumptions.

## Gotchas

- Private screens must render inside `AppLayout` via `<Outlet />`; adding a link to a route that is not declared in `App.jsx` falls through to the `*` redirect.
- The demo session is stored under `cafeteria-jose:usuario-demo` in `sessionStorage`; clear it to test the unauthenticated flow.
