import { useId, useState, type FormEvent } from 'react';
import type { RegistroSerie } from '../../dominio/entrenamiento/entrenamiento.ts';
import type { FilaSerie } from '../../dominio/serie/filasSeries.ts';
import { validarSerie } from '../../dominio/serie/serie.ts';

/** RN-UI-ENT-01: los campos vienen con lo prescripto (o lo ya registrado) y se confirma con un clic. */
export function FormularioSerie(props: {
  fila: FilaSerie;
  registrar: (registro: RegistroSerie) => Promise<boolean>;
  alRegistrar: () => void;
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
    const registrada = await props.registrar({
      orden,
      numero,
      ...(posicion !== null && { posicion }),
      ...validacion.cuerpo,
    });
    setEnviando(false);
    if (registrada) props.alRegistrar();
  }

  const errorDe = (campo: 'medida' | 'peso') => (error?.campo === campo ? error.mensaje : null);

  return (
    <form noValidate onSubmit={(evento) => void enviar(evento)} className="formulario-serie">
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
      <button type="submit" className="accion-principal" disabled={enviando}>
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
    <div className="campo-serie">
      <label htmlFor={props.id}>{props.etiqueta}</label>
      <input
        id={props.id}
        inputMode="decimal"
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
