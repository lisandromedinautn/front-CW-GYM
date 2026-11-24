import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import type { RegistroSerie, SerieRealizada } from '../../dominio/entrenamiento/entrenamiento.ts';
import { claveSerie } from '../../dominio/serie/filasSeries.ts';
import { registrarSerie } from '../../infraestructura/api/apiEntrenamiento.ts';

const clave = (s: { orden: number; numero: number; posicion: number | null }) =>
  claveSerie(s.orden, s.numero, s.posicion);

/** US14: registra series del entrenamiento en curso y lleva las ya registradas para mostrarlas. */
export function usarRegistrarSerie(entrenamientoId: string, iniciales: SerieRealizada[]) {
  const [series, setSeries] = useState(iniciales);
  const [error, setError] = useState<string | null>(null);
  // RN-ENT-20: si el back avisa que pasó la medianoche, ya no se ofrece registrar.
  const [abandonado, setAbandonado] = useState(false);

  async function registrar(registro: RegistroSerie): Promise<boolean> {
    setError(null);
    try {
      const serie = await registrarSerie(entrenamientoId, registro);
      setSeries((previas) => [...previas.filter((s) => clave(s) !== clave(serie)), serie]);
      return true;
    } catch (e: unknown) {
      if (esErrorApi(e) && e.codigo === 'RN-ENT-20') setAbandonado(true);
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo registrar la serie');
      return false;
    }
  }

  return { series, registrar, error, abandonado };
}
