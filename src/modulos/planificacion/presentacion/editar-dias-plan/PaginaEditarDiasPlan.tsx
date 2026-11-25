import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { usarEditarDiasPlan } from '../../aplicacion/editar-dias-plan/usarEditarDiasPlan.ts';
import { type DiaConsultado, diaEsEditable, etiquetaDeFecha } from '../../dominio/plan/plan.ts';
import type { RutinaCreada } from '../../dominio/rutina/rutina.ts';

/** RN-PLAN-23: el profesor cambia la rutina de los días de hoy en adelante de un plan. */
export function PaginaEditarDiasPlan() {
  const { id = '' } = useParams();
  const { plan, rutinas, error, ocupado, guardar } = usarEditarDiasPlan(id);

  return (
    <section className="pagina pagina-ancha">
      <Link to="/profesor/planes" className="volver">
        Volver a planes
      </Link>
      <h1>Editar días del plan</h1>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!plan && !error && <p role="status">Cargando plan…</p>}
      {plan && (
        <ul className="dias-del-plan dias-editables" aria-label="Días del plan">
          {plan.dias.map((dia) => (
            <DiaEditable
              key={dia.numero}
              dia={dia}
              rutinas={rutinas}
              ocupado={ocupado}
              alGuardar={guardar}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function DiaEditable(props: {
  dia: DiaConsultado;
  rutinas: RutinaCreada[];
  ocupado: boolean;
  alGuardar: (numero: number, rutinaId: string | null) => Promise<void>;
}) {
  const { dia, rutinas } = props;
  const [elegida, setElegida] = useState(dia.rutinaId ?? '');
  const nombre = dia.rutinaId
    ? (rutinas.find((r) => r.id === dia.rutinaId)?.nombre ?? 'Rutina')
    : 'Descanso';

  return (
    <li className={`dia-del-plan${dia.rutinaId ? ' con-rutina' : ''}`}>
      <div className="dia-del-plan-encabezado">
        <h2 className="dia-del-plan-numero">{`Día ${dia.numero}`}</h2>
        <p className="dia-del-plan-fecha">{etiquetaDeFecha(dia.fecha)}</p>
      </div>
      <p className="dia-del-plan-rutina">{nombre}</p>
      {diaEsEditable(dia.fecha) && (
        <>
          <select
            aria-label={`Rutina del día ${dia.numero}`}
            value={elegida}
            onChange={(e) => setElegida(e.target.value)}
          >
            <option value="">Descanso</option>
            {rutinas.map((rutina) => (
              <option key={rutina.id} value={rutina.id}>
                {rutina.nombre}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="secundario"
            disabled={props.ocupado}
            onClick={() => void props.alGuardar(dia.numero, elegida || null)}
          >
            Guardar
          </button>
        </>
      )}
    </li>
  );
}
