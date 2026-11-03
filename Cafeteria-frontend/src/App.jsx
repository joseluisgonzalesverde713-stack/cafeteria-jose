import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './config/routes.js'
import AppLayout from './layout/AppLayout.jsx'
import Cart from './page/Cart.jsx'
import Clients from './page/Clients.jsx'
import Completos from './page/Completos.jsx'
import Dashboard from './page/Dashboard.jsx'
import Home from './page/Home.jsx'
import Informacion from './page/Informacion.jsx'
import Login from './page/Login.jsx'
import Menu from './page/Menu.jsx'
import Receipt from './page/Receipt.jsx'
import Reserva from './page/Reserva.jsx'
import Settings from './page/Settings.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.dashboard} replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.login} element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.inicio} element={<Home />} />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.clients} element={<Clients />} />
          <Route path={ROUTES.reserva} element={<Reserva />} />
          <Route path={ROUTES.informacion} element={<Informacion />} />
          <Route path={ROUTES.completos} element={<Completos />} />
          <Route path={ROUTES.menu} element={<Menu />} />
          <Route path={ROUTES.cart} element={<Cart />} />
          <Route path={ROUTES.receipt} element={<Receipt />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}

export default App
