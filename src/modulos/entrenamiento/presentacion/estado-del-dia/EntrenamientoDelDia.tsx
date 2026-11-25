import { AccesoDelDia } from '../../../../compartido/presentacion/acceso-del-dia/AccesoDelDia.tsx';
import { usarEntrenamientoEnCurso } from '../../aplicacion/consultar-entrenamiento-en-curso/usarEntrenamientoEnCurso.ts';
import { RUTA_ENTRENAMIENTO } from '../entrenamiento-en-curso/rutas.ts';

const RUTA_RUTINA_DEL_DIA = '/alumno/rutina-del-dia';

/**
 * RN-UI-ENT-06 (T25): con rutina hoy, la tarjeta "Hoy" dice si el entrenamiento está pendiente, en
 * curso o ya hecho (columna izquierda) y lleva a donde corresponde con el nombre de la rutina
 * (columna derecha). Uno abandonado deja la rutina pendiente, como en la rutina del día.
 */
export function EntrenamientoDelDia({ nombre, fecha }: { nombre: string; fecha: string }) {
  const { resultado, error } = usarEntrenamientoEnCurso();

  if (error) {
    return (
      <p role="alert" className="error estado-del-dia-texto">
        {error}
      </p>
    );
  }
  if (!resultado) return null;

  if (resultado.estado === 'en-curso') {
    return (
      <>
        <p className="estado-del-dia-texto">Tenés un entrenamiento en curso</p>
        <AccesoDelDia
          destino={RUTA_ENTRENAMIENTO}
          accion="Retomar entrenamiento"
          titulo={nombre}
          etiqueta="Ir al entrenamiento"
        />
      </>
    );
  }
  if (resultado.estado === 'finalizado' && resultado.entrenamiento.inicio.slice(0, 10) === fecha) {
    return (
      <>
        <p className="estado-del-dia-texto">Ya entrenaste hoy</p>
        <AccesoDelDia
          destino={RUTA_ENTRENAMIENTO}
          accion="Ver resumen del entrenamiento"
          titulo={nombre}
          etiqueta="Ir al entrenamiento"
        />
      </>
    );
  }
  return (
    <>
      <p className="estado-del-dia-texto">Tenés un entrenamiento pendiente hoy</p>
      <AccesoDelDia
        destino={RUTA_RUTINA_DEL_DIA}
        accion="Ver mi rutina del día"
        titulo={nombre}
        etiqueta="Ir al entrenamiento"
      />
    </>
  );
}
