import { useCallback, useEffect, useMemo, useState } from 'react'
import { APP_CONFIG } from '../config/env.js'
import { DEFAULT_RESERVATIONS } from '../config/reservations.js'
import { ReservationsContext } from './ReservationsContext.js'

function readStoredReservations() {
  try {
    const raw = window.localStorage.getItem(
      APP_CONFIG.reservationsStorageKey,
    )

    if (!raw) {
      return DEFAULT_RESERVATIONS
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : DEFAULT_RESERVATIONS
  } catch {
    return DEFAULT_RESERVATIONS
  }
}

function nextReservationId(reservations) {
  const lastNumber = reservations.reduce((max, reservation) => {
    const number = Number(String(reservation.id).replace(/\D/g, ''))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 0)

  return `RES-${String(lastNumber + 1).padStart(3, '0')}`
}

function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState(readStoredReservations)

  useEffect(() => {
    window.localStorage.setItem(
      APP_CONFIG.reservationsStorageKey,
      JSON.stringify(reservations),
    )
  }, [reservations])

  const addReservation = useCallback(
    ({ cliente, telefono, fecha, hora, personas, nota }) => {
      const reservation = {
        id: nextReservationId(reservations),
        cliente,
        telefono,
        fecha,
        hora,
        personas,
        nota,
        estado: 'Pendiente',
      }

      setReservations((current) => [...current, reservation])

      return reservation
    },
    [reservations],
  )

  const deleteReservation = useCallback((reservationId) => {
    setReservations((current) =>
      current.filter((reservation) => reservation.id !== reservationId),
    )
  }, [])

  const value = useMemo(
    () => ({ reservations, addReservation, deleteReservation }),
    [reservations, addReservation, deleteReservation],
  )

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  )
}

export default ReservationsProvider
