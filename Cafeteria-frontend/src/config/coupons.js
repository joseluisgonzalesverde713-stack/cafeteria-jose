export const COUPONS = [
  { code: 'CAFE10', percent: 10, label: '10% de descuento' },
  { code: 'JOSE20', percent: 20, label: '20% de descuento' },
  { code: 'BIENVENIDO15', percent: 15, label: '15% de descuento' },
]

export function normalizeCouponCode(code) {
  return String(code ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_-]/g, '')
    .toUpperCase()
}

export function findCoupon(code) {
  const normalized = normalizeCouponCode(code)

  return (
    COUPONS.find(
      (coupon) => normalizeCouponCode(coupon.code) === normalized,
    ) ?? null
  )
}
