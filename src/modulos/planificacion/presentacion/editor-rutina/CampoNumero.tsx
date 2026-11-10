/** Campo numérico del editor, con su error enlazado por aria-describedby. */
export function CampoNumero(props: {
  id: string;
  etiqueta: string;
  valor: string;
  minimo: number;
  error?: string;
  alCambiar: (valor: string) => void;
}) {
  const idError = `error-${props.id}`;
  return (
    <div className="campo">
      <label>
        {props.etiqueta}
        <input
          type="number"
          min={props.minimo}
          value={props.valor}
          onChange={(e) => props.alCambiar(e.target.value)}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? idError : undefined}
        />
      </label>
      {props.error && (
        <span id={idError} className="error-campo">
          {props.error}
        </span>
      )}
    </div>
  );
}
