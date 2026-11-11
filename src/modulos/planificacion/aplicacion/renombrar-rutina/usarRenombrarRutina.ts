import { useState } from 'react';
import { esErrorApi } from '../../../../compartido/dominio/error-api/errorApi.ts';
import { validarNombreRutina } from '../../dominio/rutina/nombreRutina.ts';
import type { RutinaCreada } from '../../dominio/rutina/rutina.ts';
import { renombrarRutina } from '../../infraestructura/api/apiPlanificacion.ts';

/** Renombra una rutina (RN-PLAN-21): valida antes de enviar y muestra el error del back. */
export function usarRenombrarRutina(rutinaId: string) {
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  /** Devuelve la rutina actualizada, o `null` si el nombre no vale o el back lo rechazó. */
  async function renombrar(nombre: string): Promise<RutinaCreada | null> {
    const aviso = validarNombreRutina(nombre);
    if (aviso) {
      setError(aviso);
      return null;
    }
    setError(null);
    setGuardando(true);
    try {
      return await renombrarRutina(rutinaId, nombre.trim());
    } catch (e: unknown) {
      setError(esErrorApi(e) ? e.mensaje : 'No se pudo cambiar el nombre');
      return null;
    } finally {
      setGuardando(false);
    }
  }

  return { renombrar, error, guardando, limpiarError: () => setError(null) };
}
