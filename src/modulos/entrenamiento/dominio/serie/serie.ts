/** Lo que el alumno escribe en una fila: la medida prescripta y, si corresponde, el peso. */
export interface EntradaSerie {
  medida: 'repeticiones' | 'segundos';
  valor: string;
  peso: string;
}

export interface MedidaRealizada {
  repeticiones?: number;
  segundos?: number;
  pesoKg?: number;
}

export type ValidacionSerie =
  | { valida: true; cuerpo: MedidaRealizada }
  | { valida: false; campo: 'medida' | 'peso'; mensaje: string };

/** RN-ENT-03 (reflejo del back): medida entera ≥ 0 obligatoria; peso opcional ≥ 0. */
export function validarSerie(entrada: EntradaSerie): ValidacionSerie {
  const medida = numero(entrada.valor);
  if (medida === null || !Number.isInteger(medida) || medida < 0) {
    return { valida: false, campo: 'medida', mensaje: 'Ingresá un número entero de 0 o más.' };
  }
  const cuerpo: MedidaRealizada = { [entrada.medida]: medida };
  if (entrada.peso.trim() !== '') {
    const pesoKg = numero(entrada.peso);
    if (pesoKg === null || pesoKg < 0) {
      return { valida: false, campo: 'peso', mensaje: 'Ingresá un peso de 0 o más.' };
    }
    cuerpo.pesoKg = pesoKg;
  }
  return { valida: true, cuerpo };
}

function numero(texto: string): number | null {
  if (texto.trim() === '') return null;
  const valor = Number(texto.replace(',', '.'));
  return Number.isFinite(valor) ? valor : null;
}
