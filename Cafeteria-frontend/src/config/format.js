export const CURRENCIES = ['MXN', 'USD', 'EUR']

export function formatCurrency(value, currency) {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(value)
  } catch {
    return `$${Number(value).toFixed(2)}`
  }
}
