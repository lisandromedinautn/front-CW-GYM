import { useState } from 'react';
import { esErrorApi } from '../../../compartido/dominio/errorApi.ts';
import { vincularAlumno } from '../infraestructura/apiIdentidad.ts';

export function usarVincularAlumno() {
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [yaVinculado, setYaVinculado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function vincular(codigo: string) {
    setError(null);
    setEnviando(true);
    try {
      const { profesor } = await vincularAlumno(codigo);
      setExito(`Quedaste vinculado con ${profesor.nombre} ${profesor.apellido}`);
    } catch (e) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo vincular, intentá de nuevo');
      // RN-IDE-10: ya tiene profesor, no tiene sentido seguir mostrando el formulario.
      if (esErrorApi(e) && e.codigo === 'RN-IDE-10') setYaVinculado(true);
    } finally {
      setEnviando(false);
    }
  }

  return { vincular, error, exito, yaVinculado, enviando };
}
