import { useCallback, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config/env.js'
import { AuthContext } from './AuthContext.js'

function readStoredUser() {
  try {
    const stored = window.sessionStorage.getItem(APP_CONFIG.sessionStorageKey)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const signIn = useCallback((nextUser) => {
    setUser(nextUser)
    window.sessionStorage.setItem(
      APP_CONFIG.sessionStorageKey,
      JSON.stringify(nextUser),
    )
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    window.sessionStorage.removeItem(APP_CONFIG.sessionStorageKey)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
