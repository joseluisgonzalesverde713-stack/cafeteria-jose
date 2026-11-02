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

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_PRODUCTS
    }

    const storedIds = new Set(parsed.map((product) => product.id))
    const missingDefaults = DEFAULT_PRODUCTS.filter(
      (product) => !storedIds.has(product.id),
    )
    const updated = parsed.map((product) => {
      const fallback = DEFAULT_PRODUCTS.find(
        (entry) => entry.id === product.id,
      )

      if (fallback && String(product.imagen).endsWith('.svg')) {
        return { ...product, imagen: fallback.imagen }
      }

      return product
    })

    return [...updated, ...missingDefaults]
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
