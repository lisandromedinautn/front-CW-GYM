/** Contrato de error del back: `{ codigo: "RN-...", mensaje }`. */
export interface ErrorApi {
  codigo: string;
  mensaje: string;
}

export function esErrorApi(valor: unknown): valor is ErrorApi {
  return (
    typeof valor === 'object' &&
    valor !== null &&
    typeof (valor as ErrorApi).codigo === 'string' &&
    typeof (valor as ErrorApi).mensaje === 'string'
  );
}
