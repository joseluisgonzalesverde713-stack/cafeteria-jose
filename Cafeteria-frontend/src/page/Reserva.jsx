import { useState } from 'react'
import { useReservations } from '../reservations/ReservationsContext.js'

const FIELD_CLASSES =
  'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-accent focus:ring-2 focus:ring-accent-ring'

const ESTADO_STYLES = {
  Pendiente: 'bg-amber-50 text-amber-700',
  Confirmada: 'bg-emerald-50 text-emerald-700',
  Completada: 'bg-sky-50 text-sky-700',
  Cancelada: 'bg-red-50 text-red-600',
}

function Reserva() {
  const { reservations, addReservation, deleteReservation } = useReservations()
  const [cliente, setCliente] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [personas, setPersonas] = useState('2')
  const [nota, setNota] = useState('')
  const [error, setError] = useState('')

  const totalPersonas = reservations.reduce(
    (total, reserva) => total + Number(reserva.personas || 0),
    0,
  )
  const confirmadas = reservations.filter(
    (reserva) => reserva.estado === 'Confirmada',
  ).length

  const resumen = [
    {
      label: 'Reservas registradas',
      value: String(reservations.length),
      detail: 'Incluye reservas de prueba',
    },
    {
      label: 'Personas esperadas',
      value: String(totalPersonas),
      detail: 'Suma de todos los grupos',
    },
    {
      label: 'Confirmadas',
      value: String(confirmadas),
      detail: 'Listas para recibir',
    },
  ]

  function handleSubmit(event) {
    event.preventDefault()

    const nombre = cliente.trim()
    const telefonoCliente = telefono.trim()
    const fechaReserva = fecha.trim()
    const horaReserva = hora.trim()
    const numeroPersonas = Number(personas)

    if (!nombre || !fechaReserva || !horaReserva) {
      setError('Completa el nombre, la fecha y la hora de la reserva.')
      return
    }

    if (!Number.isFinite(numeroPersonas) || numeroPersonas < 1) {
      setError('La cantidad de personas debe ser al menos 1.')
      return
    }

    addReservation({
      cliente: nombre,
      telefono: telefonoCliente,
      fecha: fechaReserva,
      hora: horaReserva,
      personas: numeroPersonas,
      nota: nota.trim(),
    })

    setCliente('')
    setTelefono('')
    setFecha('')
    setHora('')
    setPersonas('2')
    setNota('')
    setError('')
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="reserva-resumen" className="space-y-4">
        <h1 id="reserva-resumen" className="text-2xl font-bold text-stone-900">
          Reservas
        </h1>

        <div className="grid gap-4 sm:grid-cols-3">
          {resumen.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-stone-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-stone-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="reserva-formulario"
        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-6"
      >
        <h2 id="reserva-formulario" className="text-lg font-bold text-stone-900">
          Nueva reserva
        </h2>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reserva-cliente"
                className="text-sm font-semibold text-stone-800"
              >
                Cliente
              </label>
              <input
                id="reserva-cliente"
                type="text"
                value={cliente}
                onChange={(event) => {
                  setCliente(event.target.value)
                  setError('')
                }}
                placeholder="Nombre del cliente"
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="reserva-telefono"
                className="text-sm font-semibold text-stone-800"
              >
                Teléfono
              </label>
              <input
                id="reserva-telefono"
                type="tel"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                placeholder="555 123 4567"
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="reserva-fecha"
                className="text-sm font-semibold text-stone-800"
              >
                Fecha
              </label>
              <input
                id="reserva-fecha"
                type="text"
                value={fecha}
                onChange={(event) => {
                  setFecha(event.target.value)
                  setError('')
                }}
                placeholder="dd/mm/aaaa"
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="reserva-hora"
                className="text-sm font-semibold text-stone-800"
              >
                Hora
              </label>
              <input
                id="reserva-hora"
                type="time"
                value={hora}
                onChange={(event) => {
                  setHora(event.target.value)
                  setError('')
                }}
                className={FIELD_CLASSES}
              />
            </div>

            <div>
              <label
                htmlFor="reserva-personas"
                className="text-sm font-semibold text-stone-800"
              >
                Personas
              </label>
              <input
                id="reserva-personas"
                type="number"
                min="1"
                max="30"
                value={personas}
                onChange={(event) => setPersonas(event.target.value)}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reserva-nota"
              className="text-sm font-semibold text-stone-800"
            >
              Nota
            </label>
            <input
              id="reserva-nota"
              type="text"
              value={nota}
              onChange={(event) => setNota(event.target.value)}
              placeholder="Preferencias o comentarios"
              className={FIELD_CLASSES}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Agregar reserva
          </button>
        </form>
      </section>

      <section aria-labelledby="reserva-lista" className="space-y-4">
        <h2 id="reserva-lista" className="text-lg font-bold text-stone-900">
          Próximas reservas
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Reserva
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Cliente
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Fecha y hora
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Personas
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-4 text-center text-stone-400"
                  >
                    Aún no hay reservas registradas.
                  </td>
                </tr>
              ) : (
                reservations.map((reserva) => (
                  <tr key={reserva.id}>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-stone-700">
                      {reserva.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-stone-900">
                        {reserva.cliente}
                      </p>
                      <p className="text-xs text-stone-500">
                        {reserva.telefono || 'Sin teléfono'}
                      </p>
                      {reserva.nota && (
                        <p className="text-xs text-stone-400">{reserva.nota}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {reserva.fecha} · {reserva.hora}
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {reserva.personas}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ESTADO_STYLES[reserva.estado] ??
                          'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => deleteReservation(reserva.id)}
                        aria-label={`Eliminar reserva ${reserva.id}`}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-stone-500">
          Información de demostración. Las reservas se guardan en tu navegador.
        </p>
      </section>
    </div>
  )
}

export default Reserva
