import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config/env.js'
import { DEFAULT_ORDERS, DEMO_CLIENT } from '../config/orders.js'
import { OrdersContext } from './OrdersContext.js'

function normalizeOrder(order) {
  const fallback = DEFAULT_ORDERS.find((entry) => entry.id === order.id)

  return {
    ...order,
    metodoPago: order.metodoPago ?? fallback?.metodoPago ?? 'Efectivo',
    cliente: order.cliente ?? fallback?.cliente ?? DEMO_CLIENT,
    items: order.items?.length ? order.items : (fallback?.items ?? []),
  }
}

function readStoredOrders() {
  try {
    const raw = window.localStorage.getItem(APP_CONFIG.ordersStorageKey)

    if (!raw) {
      return DEFAULT_ORDERS
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : DEFAULT_ORDERS
  } catch {
    return DEFAULT_ORDERS
  }
}

function nextOrderId(orders) {
  const lastNumber = orders.reduce((max, order) => {
    const number = Number(String(order.id).replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 0)

  return `PED-${String(lastNumber + 1).padStart(3, '0')}`
}

function today() {
  return new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readStoredOrders)

  useEffect(() => {
    window.localStorage.setItem(
      APP_CONFIG.ordersStorageKey,
      JSON.stringify(orders),
    )
  }, [orders])

  const addOrder = useCallback(
    ({
      total,
      subtotal,
      descuento,
      cupon,
      currency,
      items,
      metodoPago,
      cliente,
    }) => {
      const order = {
        id: nextOrderId(orders),
        fecha: today(),
        total,
        subtotal,
        descuento,
        cupon,
        currency,
        estado: 'Pagado',
        metodoPago,
        cliente,
        items,
      }

      setOrders((current) => [...current, order])

      return order
    },
    [orders],
  )

  const updateOrder = useCallback((nextOrder) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === nextOrder.id ? { ...order, ...nextOrder } : order,
      ),
    )
  }, [])

  const deleteOrder = useCallback((orderId) => {
    setOrders((current) => current.filter((order) => order.id !== orderId))
  }, [])

  const value = useMemo(
    () => ({ orders, addOrder, updateOrder, deleteOrder }),
    [orders, addOrder, updateOrder, deleteOrder],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export default OrdersProvider
