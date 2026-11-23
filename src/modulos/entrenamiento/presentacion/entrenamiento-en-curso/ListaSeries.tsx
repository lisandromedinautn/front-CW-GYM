import { useId, useState, type FormEvent } from 'react';
import type { RegistroSerie } from '../../dominio/entrenamiento/entrenamiento.ts';
import {
  describirMedida,
  type FilaSerie,
  type GrupoSeries,
} from '../../dominio/serie/filasSeries.ts';
import { validarSerie } from '../../dominio/serie/serie.ts';

interface Props {
  grupos: GrupoSeries[];
  /** Sin esta función la lista es de solo lectura (entrenamiento abandonado, RN-ENT-20). */
  registrar?: (registro: RegistroSerie) => Promise<boolean>;
}

export function ListaSeries({ grupos, registrar }: Props) {
  return (
    <>
      {grupos.map((grupo) => (
        <section key={grupo.orden}>
          <h3>{grupo.titulo}</h3>
          <ul>
            {grupo.filas.map((fila) => (
              <li key={fila.clave} role="group" aria-label={`${fila.titulo} de ${fila.nombre}`}>
                <strong>
                  {fila.titulo} · {fila.nombre}
                </strong>
                <p>Prescripto: {describirMedida(fila.prescripta)}</p>
                {fila.registrada && <p>Registrada: {describirMedida(fila.registrada)}</p>}
                {registrar && <FormularioSerie fila={fila} registrar={registrar} />}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

/** RN-UI-ENT-01: los campos vienen con lo prescripto (o lo ya registrado) y se confirma con un clic. */
function FormularioSerie(props: {
  fila: FilaSerie;
  registrar: (registro: RegistroSerie) => Promise<boolean>;
}) {
  const { fila } = props;
  const base = fila.registrada ?? fila.prescripta;
  const medida = fila.prescripta.repeticiones !== null ? 'repeticiones' : 'segundos';
  const conPeso = fila.prescripta.pesoKg !== null;
  const [valor, setValor] = useState(String(base[medida] ?? ''));
  const [peso, setPeso] = useState(conPeso ? String(base.pesoKg ?? '') : '');
  const [error, setError] = useState<{ campo: 'medida' | 'peso'; mensaje: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const id = useId();

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const validacion = validarSerie({ medida, valor, peso });
    if (!validacion.valida) {
      setError(validacion);
      return;
    }
    setError(null);
    setEnviando(true);
    const { orden, numero, posicion } = fila;
    await props.registrar({
      orden,
      numero,
      ...(posicion !== null && { posicion }),
      ...validacion.cuerpo,
    });
    setEnviando(false);
  }

  const errorDe = (campo: 'medida' | 'peso') => (error?.campo === campo ? error.mensaje : null);

  return (
    <form noValidate onSubmit={(evento) => void enviar(evento)}>
      <Campo
        id={`${id}-medida`}
        etiqueta={medida === 'repeticiones' ? 'Repeticiones' : 'Segundos'}
        valor={valor}
        alCambiar={setValor}
        error={errorDe('medida')}
      />
      {conPeso && (
        <Campo
          id={`${id}-peso`}
          etiqueta="Peso (kg)"
          valor={peso}
          alCambiar={setPeso}
          error={errorDe('peso')}
        />
      )}
      <button type="submit" disabled={enviando}>
        Registrar
      </button>
    </form>
  );
}

function Campo(props: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  error: string | null;
}) {
  return (
    <>
      <label htmlFor={props.id}>{props.etiqueta}</label>
      <input
        id={props.id}
        inputMode="decimal"
        value={props.valor}
        onChange={(evento) => props.alCambiar(evento.target.value)}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
      />
      {props.error && <span id={`${props.id}-error`}>{props.error}</span>}
    </>
  );
}
