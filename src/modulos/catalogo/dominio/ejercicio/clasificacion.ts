/** RN-CAT-02: el tipo de ejercicio. */
export const TIPOS_EJERCICIO = ['por tiempo', 'por repeticiones'] as const;

/** RN-CAT-03: el tipo de carga. */
export const TIPOS_CARGA = [
  'Sin Peso',
  'Peso Corporal',
  'Peso Extra',
  'Peso Corporal + Peso Extra',
] as const;

/** RN-CAT-05: cada grupo muscular con sus músculos (lista cerrada; el grupo se deriva del músculo). */
export const MUSCULOS_POR_GRUPO = {
  Piernas: [
    'Cuádriceps',
    'Isquiotibiales',
    'Glúteos',
    'Gemelos',
    'Sóleo',
    'Aductores',
    'Abductores',
  ],
  Pecho: ['Pectoral', 'Serrato'],
  Espalda: ['Dorsal', 'Trapecio', 'Lumbar', 'Elevador de la escápula'],
  Hombros: ['Deltoides'],
  Brazos: ['Bíceps', 'Tríceps', 'Antebrazo'],
  Core: ['Abdominales', 'Oblicuos'],
  Cardio: ['Cardiovascular'],
} as const;

export const GRUPOS_MUSCULARES: string[] = Object.keys(MUSCULOS_POR_GRUPO);

export const MUSCULOS: string[] = Object.values(MUSCULOS_POR_GRUPO).flat();

/** RN-CAT-05: los músculos de un grupo; sin grupo (vacío), todos. */
export function musculosDelGrupo(grupo: string): readonly string[] {
  return grupo in MUSCULOS_POR_GRUPO
    ? MUSCULOS_POR_GRUPO[grupo as keyof typeof MUSCULOS_POR_GRUPO]
    : MUSCULOS;
}

/** Filtros del listado de ejercicios (RN-UI-LIS-04). Vacío = sin filtro. */
export interface FiltrosEjercicios {
  busqueda: string;
  grupo: string;
  musculo: string;
  tipo: string;
  tipoCarga: string;
}

export const SIN_FILTROS: FiltrosEjercicios = {
  busqueda: '',
  grupo: '',
  musculo: '',
  tipo: '',
  tipoCarga: '',
};
