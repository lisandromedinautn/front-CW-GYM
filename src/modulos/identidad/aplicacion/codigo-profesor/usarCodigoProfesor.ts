import { useEffect, useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import {
  generarCodigoProfesor,
  obtenerCodigoProfesor,
} from '../../infraestructura/api/apiIdentidad.ts';

function mensajeDe(e: unknown, porDefecto: string) {
  return esErrorApi(e) ? e.mensaje : porDefecto;
}

export function usarCodigoProfesor() {
  const [codigo, setCodigo] = useState<string | null>(null);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    let vigente = true;
    obtenerCodigoProfesor()
      .then((r) => {
        if (!vigente) return;
        setCodigo(r.codigo);
        setCargado(true);
      })
      .catch((e: unknown) => {
        if (vigente) setError(mensajeDe(e, 'No se pudo cargar tu código'));
      });
    return () => {
      vigente = false;
    };
  }, []);

  async function generar() {
    setError(null);
    setAviso(null);
    try {
      setCodigo((await generarCodigoProfesor()).codigo);
    } catch (e) {
      setError(mensajeDe(e, 'No se pudo generar el código'));
    }
  }

  async function copiar() {
    if (codigo === null) return;
    setError(null);
    try {
      await navigator.clipboard.writeText(codigo);
      setAviso('Código copiado');
    } catch {
      setAviso(null);
      setError('No se pudo copiar el código');
    }
  }

  return { codigo, cargado, error, aviso, generar, copiar };
}
