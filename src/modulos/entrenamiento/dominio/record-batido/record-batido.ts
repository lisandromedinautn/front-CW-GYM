export type TipoRecord = 'repeticiones' | 'volumen' | '1rm' | 'tiempo';

export interface RecordBatido {
  ejercicioId: string;
  nombre: string;
  tipo: TipoRecord;
  valorAnterior: number;
  valorNuevo: number;
}

export interface FilaRecord {
  nombre: string;
  etiqueta: string;
  valorAnterior: number;
  valorNuevo: number;
  unidad: string;
}
