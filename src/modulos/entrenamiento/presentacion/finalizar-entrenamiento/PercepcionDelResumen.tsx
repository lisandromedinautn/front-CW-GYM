import { useId, useState, type FormEvent } from 'react';
import { usarRegistrarPercepcion } from '../../aplicacion/registrar-percepcion/usarRegistrarPercepcion.ts';
import type { Percepcion } from '../../dominio/percepcion/percepcion.ts';
import { describirPercepcion } from '../../dominio/percepcion/percepcion.ts';
import { Aviso } from '../../../../compartido/presentacion/estados/Aviso.tsx';

/** US17 (RN-ENT-16): con la percepción ya cargada solo se muestra; si no, se pide una vez. */
export function PercepcionDelResumen(props: {
  entrenamientoId: string;
  percepcion: Percepcion | null | undefined;
}) {
  const registro = usarRegistrarPercepcion(props.entrenamientoId);
  const cargada = props.percepcion ?? registro.percepcion;
  const [rpe, setRpe] = useState('');
  const [sensacionFuerza, setSensacionFuerza] = useState('');
  const id = useId();

  if (cargada) return <p className="percepcion-cargada">{describirPercepcion(cargada)}</p>;

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    void registro.guardar({ rpe, sensacionFuerza });
  }

  return (
    <form
      noValidate
      onSubmit={enviar}
      aria-label="Percepción del entrenamiento"
      className="formulario formulario-percepcion"
    >
      {registro.error && <Aviso tipo="error">{registro.error}</Aviso>}
      <Campo
        id={`${id}-rpe`}
        etiqueta="RPE (1 a 10)"
        valor={rpe}
        alCambiar={setRpe}
        error={registro.errores.rpe}
      />
      <Campo
        id={`${id}-fuerza`}
        etiqueta="Sensación de fuerza (1 a 5)"
        valor={sensacionFuerza}
        alCambiar={setSensacionFuerza}
        error={registro.errores.sensacionFuerza}
      />
      <button type="submit" className="accion-principal" disabled={registro.guardando}>
        Guardar percepción
      </button>
    </form>
  );
}

function Campo(props: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  error: string | undefined;
}) {
  return (
    <div className="campo-serie">
      <label htmlFor={props.id}>{props.etiqueta}</label>
      <input
        id={props.id}
        inputMode="numeric"
        value={props.valor}
        onChange={(evento) => props.alCambiar(evento.target.value)}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
      />
      {props.error && (
        <span id={`${props.id}-error`} className="error-campo">
          {props.error}
        </span>
      )}
    </div>
  );
}
