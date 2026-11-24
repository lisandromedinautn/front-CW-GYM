/** Contrato de `GET /notificaciones/mis-notificaciones` (US21). La gravedad la calcula el back. */
export type Gravedad = 'leve' | 'grave';

export interface MedidaSerie {
  repeticiones: number | null;
  segundos: number | null;
  pesoKg: number | null;
}

export interface SeriePorDebajo {
  orden: number;
  numero: number;
  /** `null` en una serie de bloque; número de ejercicio dentro de la vuelta en un circuito. */
  posicion: number | null;
  ejercicioId: string;
  nombre: string;
  prescripta: MedidaSerie;
  /** `null` si la serie no se registró. */
  realizada: MedidaSerie | null;
}

/** RN-NOT-05 (a confirmar con US17): hasta entonces llega `null`. */
export interface Percepcion {
  rpe: number | null;
  sensacionFuerza: number | null;
}

export interface Notificacion {
  id: string;
  creada: string;
  leida: boolean;
  gravedad: Gravedad;
  alumno: { id: string; nombre: string; apellido: string };
  entrenamiento: { id: string; rutina: string; inicio: string };
  totalSeries: number;
  seriesPorDebajo: SeriePorDebajo[];
  percepcion: Percepcion | null;
}

export interface BandejaNotificaciones {
  items: Notificacion[];
  total: number;
  pagina: number;
  tamanio: number;
  noLeidas: number;
}

const ETIQUETAS_GRAVEDAD: Record<Gravedad, string> = { leve: 'Leve', grave: 'Grave' };

/** RN-NOT-02: la gravedad se muestra como texto. */
export function etiquetaDeGravedad(gravedad: Gravedad): string {
  return ETIQUETAS_GRAVEDAD[gravedad];
}

/** «10 repeticiones · 30 kg», «60 segundos». */
export function describirMedida(medida: MedidaSerie): string {
  const partes: string[] = [];
  if (medida.repeticiones !== null) partes.push(`${medida.repeticiones} repeticiones`);
  if (medida.segundos !== null) partes.push(`${medida.segundos} segundos`);
  if (medida.pesoKg !== null) partes.push(`${String(medida.pesoKg).replace('.', ',')} kg`);
  return partes.join(' · ');
}

/** RN-NOT-01: lo realizado, o «Sin registrar» si la serie no se registró. */
export function describirRealizada(realizada: MedidaSerie | null): string {
  return realizada === null ? 'Sin registrar' : describirMedida(realizada);
}

/** «Serie 3 · press» en un bloque; «Vuelta 2 · plancha» en un circuito. */
export function tituloDeSerie(serie: SeriePorDebajo): string {
  return `${serie.posicion === null ? 'Serie' : 'Vuelta'} ${serie.numero} · ${serie.nombre}`;
}

const FORMATO = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** RN-NOT-01: fecha y hora en hora de Argentina (dd/mm/aaaa hh:mm). */
export function fechaHora(iso: string): string {
  const partes = Object.fromEntries(
    FORMATO.formatToParts(new Date(iso)).map((parte) => [parte.type, parte.value]),
  );
  return `${partes.day}/${partes.month}/${partes.year} ${partes.hour}:${partes.minute}`;
}
