import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

/**
 * Columna derecha de la tarjeta "Hoy" del inicio del Alumno (T25): en la cancha, una etiqueta a la
 * altura de "Hoy" ("Ir al entrenamiento"), el título grande y una flecha ámbar. Toda la columna
 * lleva al destino: el enlace se estira sobre ella. La etiqueta queda fuera del enlace para que su
 * nombre accesible (la acción con el título) contenga todo lo visible del enlace (WCAG 2.5.3).
 */
export function AccesoDelDia(props: {
  destino: string;
  accion: string;
  titulo: string;
  etiqueta: string;
}) {
  const nombre = props.accion.toLowerCase().includes(props.titulo.toLowerCase())
    ? props.accion
    : `${props.accion}: ${props.titulo}`;
  return (
    <div className="estado-del-dia-acceso">
      <p className="estado-del-dia-ir">{props.etiqueta}</p>
      <Link to={props.destino} className="estado-del-dia-enlace" aria-label={nombre}>
        <span className="estado-del-dia-rutina">{props.titulo}</span>
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
