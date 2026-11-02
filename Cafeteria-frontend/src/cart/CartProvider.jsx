import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config/env.js'
import { CartContext } from './CartContext.js'

function readStoredItems() {
  try {
    const raw = window.localStorage.getItem(APP_CONFIG.cartStorageKey)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    )
  } catch {
    return []
  }
}

function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredItems)

  useEffect(() => {
    if (items.length === 0) {
      window.localStorage.removeItem(APP_CONFIG.cartStorageKey)
      return
    }

    window.localStorage.setItem(
      APP_CONFIG.cartStorageKey,
      JSON.stringify(items),
    )
  }, [items])

  const addItem = useCallback((productId) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId)

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { productId, quantity: 1 }]
    })
  }, [])

  const decrementItem = useCallback((productId) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const incrementItem = useCallback((productId) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      count,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    }),
    [
      items,
      count,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
