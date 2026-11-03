export const RESERVATION_ESTADOS = [
  'Pendiente',
  'Confirmada',
  'Completada',
  'Cancelada',
]

export const DEFAULT_RESERVATIONS = [
  {
    id: 'RES-001',
    cliente: 'María López',
    telefono: '555 123 4567',
    fecha: '05/11/2026',
    hora: '10:30',
    personas: 2,
    estado: 'Confirmada',
    nota: 'Mesa junto a la ventana',
  },
  {
    id: 'RES-002',
    cliente: 'Carlos Ramírez',
    telefono: '555 987 6543',
    fecha: '06/11/2026',
    hora: '17:00',
    personas: 4,
    estado: 'Pendiente',
    nota: 'Cumpleaños',
  },
  {
    id: 'RES-003',
    cliente: 'Ana Torres',
    telefono: '555 456 7890',
    fecha: '07/11/2026',
    hora: '12:00',
    personas: 3,
    estado: 'Confirmada',
    nota: 'Sin gluten',
  },
]

export const HORARIOS = [
  { dia: 'Lunes a viernes', horario: '08:00 – 21:00' },
  { dia: 'Sábado', horario: '09:00 – 22:00' },
  { dia: 'Domingo', horario: '09:00 – 18:00' },
]

export const SERVICIOS = [
  'Café para llevar',
  'Reservas de mesa',
  'Pagos con QR, Yape y Plin',
  'Opciones calientes y frías',
]
