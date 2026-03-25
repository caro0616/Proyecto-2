/**
 * Categorías odontológicas predefined para el catálogo de Depósito Dental Virtual Pitalito.
 * Estas categorías representan las principales áreas de productos dentales.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

/**
 * Lista de categorías principales para el catálogo odontológico.
 * Seleccionadas por relevancia de negocio y volumen de productos esperado.
 */
export const DENTAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Instrumental',
    slug: 'instrumental',
    icon: 'medical_services',
    description: 'Instrumentos y herramientas dentales para procedimientos clínicos',
  },
  {
    id: '2',
    name: 'Materiales de Restauración',
    slug: 'materiales',
    icon: 'build',
    description: 'Resinas, amalgamas, ionómeros y materiales de obturación',
  },
  {
    id: '3',
    name: 'Endodoncia',
    slug: 'endodoncia',
    icon: 'precision_manufacturing',
    description: 'Limas, gutapercha, obturadores y materiales para tratamiento de conducto',
  },
  {
    id: '4',
    name: 'Ortodoncia',
    slug: 'ortodoncia',
    icon: 'straighten',
    description: 'Brackets, arcos, ligaduras y apparejos ortodóncicos',
  },
  {
    id: '5',
    name: 'Equipos Dentales',
    slug: 'equipos',
    icon: 'health_and_safety',
    description: 'Sillas dentales, motores, equipos de aspiración y accesorios',
  },
  {
    id: '6',
    name: 'Protección Personal',
    slug: 'proteccion',
    icon: 'mask',
    description: 'Mascarillas, guantes, goggles, batas y equipos de protección',
  },
];

/**
 * Obtiene una categoría por su slug.
 * @param slug - El slug de la categoría a buscar
 * @returns La categoría encontrada o undefined
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return DENTAL_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Obtiene una categoría por su ID.
 * @param id - El ID de la categoría a buscar
 * @returns La categoría encontrada o undefined
 */
export function getCategoryById(id: string): Category | undefined {
  return DENTAL_CATEGORIES.find((cat) => cat.id === id);
}
