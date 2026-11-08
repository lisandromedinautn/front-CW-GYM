import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usarSesion } from '../../../../compartido/aplicacion/sesion/usarSesion.ts';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { RUTA_INICIO } from '../../../../compartido/dominio/sesion/sesion.ts';
import { ingresar } from '../../infraestructura/api/apiIdentidad.ts';

export function usarIngresarAlSistema() {
  const { guardarSesion } = usarSesion();
  const navegar = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function ingresarAlSistema(email: string, contrasenia: string) {
    setError(null);
    setEnviando(true);
    try {
      const sesion = await ingresar(email, contrasenia);
      guardarSesion(sesion);
      void navegar(RUTA_INICIO[sesion.rol], { replace: true });
    } catch (e) {
      setError(
        esErrorApi(e) && e.codigo === 'RN-IDE-01'
          ? e.mensaje
          : 'No se pudo ingresar, intentá de nuevo',
      );
    } finally {
      setEnviando(false);
    }
  }

  return { ingresarAlSistema, error, enviando };
}
