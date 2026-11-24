import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import {
  type EntradaPercepcion,
  type ErroresPercepcion,
  type Percepcion,
  validarPercepcion,
} from '../../dominio/percepcion/percepcion.ts';
import { registrarPercepcion } from '../../infraestructura/api/apiEntrenamiento.ts';

/** US17 (RN-ENT-14, 15, 16): valida antes de enviar y guarda la percepción del entrenamiento finalizado. */
export function usarRegistrarPercepcion(id: string) {
  const [percepcion, setPercepcion] = useState<Percepcion | null>(null);
  const [errores, setErrores] = useState<ErroresPercepcion>({});
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function guardar(entrada: EntradaPercepcion) {
    setError(null);
    const validacion = validarPercepcion(entrada);
    if (!validacion.valida) {
      setErrores(validacion.errores);
      return;
    }
    setErrores({});
    setGuardando(true);
    try {
      setPercepcion(await registrarPercepcion(id, validacion.cuerpo));
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo guardar la percepción');
    } finally {
      setGuardando(false);
    }
  }
  return { percepcion, errores, error, guardando, guardar };
}
