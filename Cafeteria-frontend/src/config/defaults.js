import { APP_CONFIG } from './env.js'
import { DEFAULT_THEME } from './theme.js'

export function getDefaultSettings() {
  return {
    appName: APP_CONFIG.name,
    shortName: APP_CONFIG.shortName,
    currency: APP_CONFIG.currency,
    businessEmail: APP_CONFIG.businessEmail,
    businessPhone: APP_CONFIG.businessPhone,
    businessAddress: APP_CONFIG.businessAddress,
    taxRate: APP_CONFIG.taxRate,
    theme: DEFAULT_THEME,
  }
}
