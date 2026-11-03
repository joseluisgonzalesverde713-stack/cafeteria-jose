import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './auth/AuthProvider.jsx'
import CartProvider from './cart/CartProvider.jsx'
import OrdersProvider from './orders/OrdersProvider.jsx'
import ProductsProvider from './products/ProductsProvider.jsx'
import ReservationsProvider from './reservations/ReservationsProvider.jsx'
import SettingsProvider from './settings/SettingsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <ProductsProvider>
          <OrdersProvider>
            <ReservationsProvider>
              <CartProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </CartProvider>
            </ReservationsProvider>
          </OrdersProvider>
        </ProductsProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
