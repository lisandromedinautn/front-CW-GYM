import { Link, useNavigate } from 'react-router';
import { usarEntrenamientoEnCurso } from '../../aplicacion/consultar-entrenamiento-en-curso/usarEntrenamientoEnCurso.ts';
import { usarIniciarEntrenamiento } from '../../aplicacion/iniciar-entrenamiento/usarIniciarEntrenamiento.ts';
import { RUTA_ENTRENAMIENTO } from './rutas.ts';

export function AccionesEntrenamiento({ hayRutina }: { hayRutina: boolean }) {
  const { resultado, error: errorConsulta } = usarEntrenamientoEnCurso();
  const { iniciar, iniciando, error: errorInicio } = usarIniciarEntrenamiento();
  const navegar = useNavigate();

  if (errorConsulta) return <p role="alert">{errorConsulta}</p>;
  if (!resultado) return null;
  if (
    resultado.estado === 'finalizado' &&
    resultado.entrenamiento.inicio.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ) {
    return (
      <Link to={RUTA_ENTRENAMIENTO} className="boton secundario accion-del-dia">
        Ver resumen del entrenamiento
      </Link>
    );
  }
  if (resultado.estado === 'en-curso') {
    return (
      <Link to={RUTA_ENTRENAMIENTO} className="boton accion-principal accion-del-dia">
        Retomar entrenamiento
      </Link>
    );
  }

  async function iniciarYMostrar() {
    if (await iniciar()) void navegar(RUTA_ENTRENAMIENTO);
  }

  return (
    <div className="acciones-del-dia">
      {errorInicio && (
        <p role="alert" className="error">
          {errorInicio}
        </p>
      )}
      {hayRutina && (
        <button
          type="button"
          className="accion-principal accion-del-dia"
          disabled={iniciando}
          onClick={() => void iniciarYMostrar()}
        >
          Iniciar entrenamiento
        </button>
      )}
      {resultado.estado === 'abandonado' && (
        <p>
          <Link to={RUTA_ENTRENAMIENTO}>Ver entrenamiento abandonado</Link>
        </p>
      )}
    </div>
  );
}
