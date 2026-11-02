import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDefaultSettings } from '../config/defaults.js'
import { APP_CONFIG } from '../config/env.js'
import { getTheme } from '../config/theme.js'
import { SettingsContext } from './SettingsContext.js'

function readStoredSettings() {
  const defaults = getDefaultSettings()

  try {
    const raw = window.localStorage.getItem(APP_CONFIG.settingsStorageKey)

    if (!raw) {
      return defaults
    }

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') {
      return defaults
    }

    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings)

  useEffect(() => {
    const theme = getTheme(settings.theme)
    const root = document.documentElement

    root.style.setProperty('--app-accent', theme.accent)
    root.style.setProperty('--app-accent-strong', theme.strong)
    root.style.setProperty('--app-accent-dark', theme.dark)
    root.style.setProperty('--app-accent-soft', theme.soft)
    root.style.setProperty('--app-accent-ring', theme.ring)

    document.title = `${settings.appName} · Portal de clientes`
  }, [settings])

  const saveSettings = useCallback((nextSettings) => {
    setSettings(nextSettings)
    window.localStorage.setItem(
      APP_CONFIG.settingsStorageKey,
      JSON.stringify(nextSettings),
    )
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(getDefaultSettings())
    window.localStorage.removeItem(APP_CONFIG.settingsStorageKey)
  }, [])

  const value = useMemo(
    () => ({ settings, saveSettings, resetSettings }),
    [settings, saveSettings, resetSettings],
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export default SettingsProvider
