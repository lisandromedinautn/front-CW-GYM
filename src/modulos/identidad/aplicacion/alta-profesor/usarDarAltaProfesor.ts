import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { darAltaProfesor, type DatosAltaProfesor } from '../../infraestructura/api/apiIdentidad.ts';

/** Devuelve true si el alta se hizo, para que la página vacíe el formulario. */
export function usarDarAltaProfesor() {
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function darDeAlta(datos: DatosAltaProfesor): Promise<boolean> {
    setError(null);
    setExito(null);
    setEnviando(true);
    try {
      const { legajo } = await darAltaProfesor(datos);
      setExito(`Profesor ${legajo} dado de alta`);
      return true;
    } catch (e) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo dar de alta, intentá de nuevo');
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return { darDeAlta, error, exito, enviando };
}
