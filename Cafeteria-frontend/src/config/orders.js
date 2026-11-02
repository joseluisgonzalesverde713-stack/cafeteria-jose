export const DEMO_CLIENT = {
  nombre: 'José Revución',
  correo: 'jose.revucio@cafeteriajose.com',
}

export const DEFAULT_ORDERS = [
  {
    id: 'PED-001',
    fecha: '12/10/2026',
    total: 85,
    currency: 'MXN',
    estado: 'Entregado',
    metodoPago: 'Efectivo',
    cliente: DEMO_CLIENT,
    items: [
      { nombre: 'Café americano', precio: 40, cantidad: 1 },
      { nombre: 'Capuchino', precio: 45, cantidad: 1 },
    ],
  },
  {
    id: 'PED-002',
    fecha: '18/10/2026',
    total: 52,
    currency: 'MXN',
    estado: 'Entregado',
    metodoPago: 'Tarjeta',
    cliente: DEMO_CLIENT,
    items: [{ nombre: 'Frappé de moka', precio: 52, cantidad: 1 }],
  },
  {
    id: 'PED-003',
    fecha: '24/10/2026',
    total: 96,
    currency: 'MXN',
    estado: 'Entregado',
    metodoPago: 'Transferencia',
    cliente: DEMO_CLIENT,
    items: [
      { nombre: 'Frappé de moka', precio: 52, cantidad: 1 },
      { nombre: 'Capuchino', precio: 44, cantidad: 1 },
    ],
  },
]
