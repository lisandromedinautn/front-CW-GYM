/** Cómo se mueve un bloque o circuito dentro de la rutina (US10). Sin esto no se muestran botones. */
export interface Reordenar {
  puedeSubir: boolean;
  puedeBajar: boolean;
  alSubir: () => void;
  alBajar: () => void;
}

/** RN-PLAN-01 reflejada (US10): "Subir" y "Bajar", deshabilitados en los extremos. */
export function BotonesOrden({ reordenar }: { reordenar?: Reordenar }) {
  if (!reordenar) return null;
  return (
    <div className="barra">
      <button
        type="button"
        className="secundario"
        disabled={!reordenar.puedeSubir}
        onClick={reordenar.alSubir}
      >
        Subir
      </button>
      <button
        type="button"
        className="secundario"
        disabled={!reordenar.puedeBajar}
        onClick={reordenar.alBajar}
      >
        Bajar
      </button>
    </div>
  );
}
