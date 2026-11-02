import { useCallback, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config/env.js'
import { DEFAULT_PRODUCTS } from '../config/products.js'
import { ProductsContext } from './ProductsContext.js'

function readStoredProducts() {
  try {
    const raw = window.localStorage.getItem(APP_CONFIG.productsStorageKey)

    if (!raw) {
      return DEFAULT_PRODUCTS
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_PRODUCTS
  } catch {
    return DEFAULT_PRODUCTS
  }
}

function ProductsProvider({ children }) {
  const [products, setProducts] = useState(readStoredProducts)

  const persist = useCallback((nextProducts) => {
    setProducts(nextProducts)
    window.localStorage.setItem(
      APP_CONFIG.productsStorageKey,
      JSON.stringify(nextProducts),
    )
  }, [])

  const updateProduct = useCallback(
    (nextProduct) => {
      persist(
        products.map((product) =>
          product.id === nextProduct.id ? nextProduct : product,
        ),
      )
    },
    [products, persist],
  )

  const resetProducts = useCallback(() => {
    setProducts(DEFAULT_PRODUCTS)
    window.localStorage.removeItem(APP_CONFIG.productsStorageKey)
  }, [])

  const value = useMemo(
    () => ({ products, updateProduct, resetProducts }),
    [products, updateProduct, resetProducts],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsProvider
