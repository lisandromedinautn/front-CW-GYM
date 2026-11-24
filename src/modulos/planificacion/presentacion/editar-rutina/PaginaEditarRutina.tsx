import { useParams } from 'react-router';
import { usarEditarRutina } from '../../aplicacion/editar-rutina/usarEditarRutina.ts';
import { EditorRutina } from '../editor-rutina/EditorRutina.tsx';

/** US06: detalle de una rutina propia en el editor, para cambiar su contenido (RN-PLAN-07). */
export function PaginaEditarRutina() {
  const { id = '' } = useParams();
  const edicion = usarEditarRutina(id);
  if (!edicion.rutina) {
    return (
      <section className="pagina">
        {edicion.error ? (
          <p role="alert" className="error">
            {edicion.error}
          </p>
        ) : (
          <p className="tenue">Cargando rutina…</p>
        )}
      </section>
    );
  }
  return <EditorRutina key={edicion.rutina.id} rutina={edicion.rutina} edicion={edicion} />;
}
