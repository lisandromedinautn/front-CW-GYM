import type { FilaRecord, RecordBatido, TipoRecord } from './record-batido.ts';

const ETIQUETAS: Readonly<Record<TipoRecord, string>> = {
  repeticiones: 'Repeticiones',
  volumen: 'Volumen',
  '1rm': '1RM',
  tiempo: 'Tiempo',
};

const UNIDADES: Readonly<Record<TipoRecord, string>> = {
  repeticiones: '',
  volumen: 'kg',
  '1rm': 'kg',
  tiempo: 's',
};

/**
 * RN-ENT-13: aplana los récords batidos a una fila por récord,
 * manteniendo el orden de entrada.
 */
export function aplanarRecords(records: RecordBatido[]): FilaRecord[] {
  return records.map((record) => ({
    nombre: record.nombre,
    etiqueta: ETIQUETAS[record.tipo],
    valorAnterior: record.valorAnterior,
    valorNuevo: record.valorNuevo,
    unidad: UNIDADES[record.tipo],
  }));
}
