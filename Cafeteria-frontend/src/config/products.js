export const CATEGORIAS = ['Bebidas calientes', 'Bebidas frías']

export const PRODUCT_IMAGES = [
  { value: '/productos/cafe-americano.jpg', label: 'Café americano' },
  { value: '/productos/capuchino.jpg', label: 'Capuchino' },
  { value: '/productos/latte.jpg', label: 'Latte' },
  { value: '/productos/flat-white.jpg', label: 'Flat white' },
  { value: '/productos/mocha.jpg', label: 'Mocha' },
  { value: '/productos/frappe-moka.jpg', label: 'Frappé de moka' },
  { value: '/productos/cold-brew.jpg', label: 'Cold brew' },
]

export const DEFAULT_PRODUCTS = [
  {
    id: 'P-01',
    nombre: 'Café americano',
    categoria: 'Bebidas calientes',
    precio: 35,
    descripcion: 'Café de grano recién molido, servido caliente.',
    imagen: '/productos/cafe-americano.jpg',
  },
  {
    id: 'P-02',
    nombre: 'Capuchino',
    categoria: 'Bebidas calientes',
    precio: 45,
    descripcion: 'Espresso con leche vaporizada y espuma cremosa.',
    imagen: '/productos/capuchino.jpg',
  },
  {
    id: 'P-03',
    nombre: 'Latte',
    categoria: 'Bebidas calientes',
    precio: 48,
    descripcion: 'Espresso con leche cremosa y un toque de espuma.',
    imagen: '/productos/latte.jpg',
  },
  {
    id: 'P-04',
    nombre: 'Flat white',
    categoria: 'Bebidas calientes',
    precio: 46,
    descripcion: 'Doble espresso con leche microespumada y sedosa.',
    imagen: '/productos/flat-white.jpg',
  },
  {
    id: 'P-05',
    nombre: 'Mocha',
    categoria: 'Bebidas calientes',
    precio: 50,
    descripcion: 'Café con chocolate, leche vaporizada y crema.',
    imagen: '/productos/mocha.jpg',
  },
  {
    id: 'P-06',
    nombre: 'Frappé de moka',
    categoria: 'Bebidas frías',
    precio: 52,
    descripcion: 'Bebida fría con café, chocolate y hielo.',
    imagen: '/productos/frappe-moka.jpg',
  },
  {
    id: 'P-07',
    nombre: 'Cold brew',
    categoria: 'Bebidas frías',
    precio: 48,
    descripcion: 'Café infusionado en frío por 18 horas, servido con hielo.',
    imagen: '/productos/cold-brew.jpg',
  },
]
