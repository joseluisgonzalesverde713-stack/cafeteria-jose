export const CATEGORIAS = [
  'Bebidas calientes',
  'Bebidas frías',
  'Panadería',
  'Alimentos',
  'Postres',
]

export const PRODUCT_IMAGES = [
  { value: '/productos/cafe-americano.svg', label: 'Café americano' },
  { value: '/productos/capuchino.svg', label: 'Capuchino' },
  { value: '/productos/frappe-moka.svg', label: 'Frappé de moka' },
  { value: '/productos/pan-dulce.svg', label: 'Pan dulce' },
  { value: '/productos/sandwich-pollo.svg', label: 'Sándwich de pollo' },
  { value: '/productos/agua-horchata.svg', label: 'Agua de horchata' },
]

export const DEFAULT_PRODUCTS = [
  {
    id: 'P-01',
    nombre: 'Café americano',
    categoria: 'Bebidas calientes',
    precio: 35,
    descripcion: 'Café de grano recién molido, servido caliente.',
    imagen: '/productos/cafe-americano.svg',
  },
  {
    id: 'P-02',
    nombre: 'Capuchino',
    categoria: 'Bebidas calientes',
    precio: 45,
    descripcion: 'Espresso con leche vaporizada y espuma cremosa.',
    imagen: '/productos/capuchino.svg',
  },
  {
    id: 'P-03',
    nombre: 'Frappé de moka',
    categoria: 'Bebidas frías',
    precio: 52,
    descripcion: 'Bebida fría con café, chocolate y hielo.',
    imagen: '/productos/frappe-moka.svg',
  },
  {
    id: 'P-04',
    nombre: 'Pan dulce de la casa',
    categoria: 'Panadería',
    precio: 28,
    descripcion: 'Pieza horneada diariamente con receta de prueba.',
    imagen: '/productos/pan-dulce.svg',
  },
  {
    id: 'P-05',
    nombre: 'Sándwich de pollo',
    categoria: 'Alimentos',
    precio: 65,
    descripcion: 'Pan artesanal, pollo, lechuga y aderezo de la casa.',
    imagen: '/productos/sandwich-pollo.svg',
  },
  {
    id: 'P-06',
    nombre: 'Agua de horchata',
    categoria: 'Bebidas frías',
    precio: 30,
    descripcion: 'Preparación tradicional servida bien fría.',
    imagen: '/productos/agua-horchata.svg',
  },
]
