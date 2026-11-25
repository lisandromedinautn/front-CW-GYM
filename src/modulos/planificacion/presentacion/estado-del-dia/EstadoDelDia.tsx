import type { ReactNode } from 'react';
import { AccesoDelDia } from '../../../../compartido/presentacion/acceso-del-dia/AccesoDelDia.tsx';
import { usarRutinaDelDia } from '../../aplicacion/consultar-rutina-del-dia/usarRutinaDelDia.ts';
import { etiquetaDeFecha } from '../../dominio/plan/plan.ts';

/** Lo que el inicio necesita de la rutina de hoy para mostrar el entrenamiento del día. */
export interface RutinaDeHoy {
  nombre: string;
  fecha: string;
}

/**
 * RN-UI-ENT-06 (T25): tarjeta "Hoy" del inicio del Alumno, en dos columnas. A la izquierda, "Hoy",
 * la fecha del back y el estado; a la derecha, en la cancha, el acceso (`.estado-del-dia-acceso`).
 * Planificación resuelve el día (rutina, descanso o sin plan, RN-PLAN-18); con rutina, el estado y
 * el acceso los pone quien compone la página (el módulo entrenamiento).
 */
export function EstadoDelDia({
  entrenamiento,
}: {
  entrenamiento?: (rutina: RutinaDeHoy) => ReactNode;
}) {
  const { resultado, error, cargando } = usarRutinaDelDia();

  return (
    <section className="estado-del-dia" aria-labelledby="estado-del-dia-titulo">
      <div className="estado-del-dia-cabecera">
        <h2 id="estado-del-dia-titulo" className="estado-del-dia-titulo">
          Hoy
        </h2>
        {resultado && (
          <time className="estado-del-dia-fecha" dateTime={resultado.fecha}>
            {etiquetaDeFecha(resultado.fecha)}
          </time>
        )}
      </div>
      {error && (
        <p role="alert" className="error estado-del-dia-texto">
          {error}
        </p>
      )}
      {cargando && !resultado && <p className="tenue estado-del-dia-texto">Cargando tu rutina…</p>}
      {resultado?.estado === 'sin-plan' && (
        <p className="estado-del-dia-texto">No tenés un plan vigente.</p>
      )}
      {resultado?.estado === 'descanso' && (
        <>
          <p className="estado-del-dia-texto">Hoy es día de descanso.</p>
          <AccesoDelDia
            destino="/alumno/mi-plan"
            accion="Ver mi plan completo"
            titulo="Mi plan"
            etiqueta="Ir a mi plan"
          />
        </>
      )}
      {resultado?.estado === 'rutina' &&
        entrenamiento?.({ nombre: resultado.rutina.nombre, fecha: resultado.fecha })}
    </section>
  );
}
