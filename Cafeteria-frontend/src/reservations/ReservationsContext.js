import { createContext, useContext } from 'react'

export const ReservationsContext = createContext(null)

export function useReservations() {
  const context = useContext(ReservationsContext)

  if (!context) {
    throw new Error(
      'useReservations debe usarse dentro de <ReservationsProvider>.',
    )
  }

  return context
}
