import { useParams } from 'react-router';
import { usarEditarRutina } from '../../aplicacion/editar-rutina/usarEditarRutina.ts';
import { EditorRutina } from '../editor-rutina/EditorRutina.tsx';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';
import { Cargando } from '../../../../compartido/presentacion/estados/Cargando.tsx';

/** US06: detalle de una rutina propia en el editor, para cambiar su contenido (RN-PLAN-07). */
export function PaginaEditarRutina() {
  const { id = '' } = useParams();
  const edicion = usarEditarRutina(id);
  if (!edicion.rutina) {
    return (
      <section className="pagina">
        {edicion.error ? (
          <Aviso tipo="error">{edicion.error}</Aviso>
        ) : (
          <Cargando>Cargando rutina…</Cargando>
        )}
      </section>
    );
  }
  return <EditorRutina key={edicion.rutina.id} rutina={edicion.rutina} edicion={edicion} />;
}
