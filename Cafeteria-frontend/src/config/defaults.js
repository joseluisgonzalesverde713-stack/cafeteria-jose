import { APP_CONFIG } from './env.js'
import { DEFAULT_THEME } from './theme.js'

export function getDefaultSettings() {
  return {
    appName: APP_CONFIG.name,
    shortName: APP_CONFIG.shortName,
    currency: APP_CONFIG.currency,
    theme: DEFAULT_THEME,
  }
}
