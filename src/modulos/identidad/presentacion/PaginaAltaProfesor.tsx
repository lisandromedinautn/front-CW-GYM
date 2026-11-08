import { useState, type FormEvent } from 'react';
import { usarDarAltaProfesor } from '../aplicacion/usarDarAltaProfesor.ts';

const TIPOS_DOCUMENTO = ['DNI', 'LC', 'LE', 'Pasaporte'];

const VACIO = {
  nombre: '',
  apellido: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  legajo: '',
  email: '',
  contrasenia: '',
};

type Campo = keyof typeof VACIO;

const CAMPOS_TEXTO: { campo: Exclude<Campo, 'tipoDocumento'>; etiqueta: string; tipo?: string }[] =
  [
    { campo: 'nombre', etiqueta: 'Nombre' },
    { campo: 'apellido', etiqueta: 'Apellido' },
    { campo: 'numeroDocumento', etiqueta: 'Número de documento' },
    { campo: 'legajo', etiqueta: 'Legajo' },
    { campo: 'email', etiqueta: 'Email', tipo: 'email' },
    { campo: 'contrasenia', etiqueta: 'Contraseña inicial', tipo: 'password' },
  ];

export function PaginaAltaProfesor() {
  const { darDeAlta, error, exito, enviando } = usarDarAltaProfesor();
  const [datos, setDatos] = useState(VACIO);
  const [faltantes, setFaltantes] = useState<Campo[]>([]);

  function cambiar(campo: Campo, valor: string) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    setFaltantes((anterior) => anterior.filter((c) => c !== campo));
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const vacios = (Object.keys(datos) as Campo[]).filter((c) => datos[c].trim() === '');
    setFaltantes(vacios);
    if (vacios.length > 0) return;
    if (await darDeAlta(datos)) setDatos(VACIO);
  }

  return (
    <section className="pagina">
      <h1>Alta de profesor</h1>
      <form className="formulario" onSubmit={(e) => void enviar(e)} noValidate>
        {CAMPOS_TEXTO.slice(0, 2).map((c) => (
          <CampoTexto
            key={c.campo}
            {...c}
            valor={datos[c.campo]}
            faltante={faltantes.includes(c.campo)}
            alCambiar={cambiar}
          />
        ))}
        <label>
          Tipo de documento
          <select
            value={datos.tipoDocumento}
            onChange={(e) => cambiar('tipoDocumento', e.target.value)}
          >
            {TIPOS_DOCUMENTO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        {CAMPOS_TEXTO.slice(2).map((c) => (
          <CampoTexto
            key={c.campo}
            {...c}
            valor={datos[c.campo]}
            faltante={faltantes.includes(c.campo)}
            alCambiar={cambiar}
          />
        ))}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {exito && (
          <p role="status" className="exito">
            {exito}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          Dar de alta
        </button>
      </form>
    </section>
  );
}

function CampoTexto(props: {
  campo: Campo;
  etiqueta: string;
  tipo?: string;
  valor: string;
  faltante: boolean;
  alCambiar: (campo: Campo, valor: string) => void;
}) {
  const idError = `error-${props.campo}`;
  return (
    <div className="campo">
      <label>
        {props.etiqueta}
        <input
          type={props.tipo ?? 'text'}
          value={props.valor}
          onChange={(e) => props.alCambiar(props.campo, e.target.value)}
          aria-invalid={props.faltante}
          aria-describedby={props.faltante ? idError : undefined}
        />
      </label>
      {props.faltante && (
        <span id={idError} className="error-campo">
          Completá este campo
        </span>
      )}
    </div>
  );
}
