import { expect, request, type APIRequestContext } from '@playwright/test';

// Preparación de datos para los e2e (T15). Lo que no es parte del flujo que se prueba se arma por
// la API real, para que cada archivo sea independiente. Necesita la base de test recién levantada
// y sembrada: cada alumno se vincula una sola vez (RN-IDE-10), tiene un plan vigente
// (RN-PLAN-14) y entrena una vez por día (RN-ENT-01). Ver docs/TESTING.md, "e2e de navegador".

export const URL_API = process.env.E2E_URL_API ?? 'http://localhost:3000';

/** Contraseña de los usuarios de la semilla de test del back (back-CW-GYM/.env.test). */
export const CONTRASENIA_SEMILLA = process.env.E2E_CONTRASENIA_SEMILLA ?? 'clave-de-semilla';

/** Fecha de hoy según el back: el día del plan y del entrenamiento es la fecha UTC. */
export function hoyUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Rutina de prueba: un bloque de lever chest press, 2 series de 10 repeticiones con 30 kg. */
export const RUTINA_PRESS = { series: 2, repeticiones: 10, pesoKg: 30 } as const;

export class ApiPrueba {
  private constructor(private readonly http: APIRequestContext) {}

  static async crear(): Promise<ApiPrueba> {
    return new ApiPrueba(await request.newContext({ baseURL: URL_API }));
  }

  async cerrar(): Promise<void> {
    await this.http.dispose();
  }

  async token(email: string): Promise<string> {
    const respuesta = await this.http.post('/identidad/ingreso', {
      data: { email, contrasenia: CONTRASENIA_SEMILLA },
    });
    expect(respuesta.status(), `ingreso de ${email}`).toBe(200);
    return ((await respuesta.json()) as { token: string }).token;
  }

  /** Vincula al alumno con el profesor (genera un código nuevo) y devuelve el id del alumno. */
  async vincular(emailProfesor: string, emailAlumno: string): Promise<string> {
    const profesor = await this.token(emailProfesor);
    const alumno = await this.token(emailAlumno);
    const alumnosDelProfesor = async () =>
      ((await this.pedir('get', '/identidad/alumnos', profesor)) as { id: string }[]).map(
        (a) => a.id,
      );
    const antes = new Set(await alumnosDelProfesor());
    const { codigo } = (await this.pedir('post', '/identidad/profesores/codigo', profesor)) as {
      codigo: string;
    };
    await this.pedir('post', '/identidad/alumnos/vinculo', alumno, { codigo });
    // El id del alumno (no el del usuario) es el que aparece nuevo en la lista del profesor.
    const nuevo = (await alumnosDelProfesor()).find((id) => !antes.has(id));
    if (!nuevo) throw new Error(`No se encontró a ${emailAlumno} entre los alumnos del profesor`);
    return nuevo;
  }

  /** Crea la rutina de prueba (RUTINA_PRESS) y devuelve su id. */
  async crearRutinaPress(emailProfesor: string, nombre: string): Promise<string> {
    const profesor = await this.token(emailProfesor);
    const ejercicios = (await this.pedir('get', '/catalogo/ejercicios', profesor)) as {
      id: string;
      nombre: string;
    }[];
    const press = ejercicios.find((e) => e.nombre === 'lever chest press');
    if (!press) throw new Error('El catálogo no tiene lever chest press: falta `yarn seed`');
    const rutina = (await this.pedir('post', '/planificacion/rutinas', profesor, {
      nombre,
      bloques: [
        {
          ejercicioId: press.id,
          orden: 1,
          series: RUTINA_PRESS.series,
          repeticiones: RUTINA_PRESS.repeticiones,
          pesoKg: RUTINA_PRESS.pesoKg,
          micropausaSegundos: 60,
          macropausaSegundos: 120,
        },
      ],
    })) as { id: string };
    return rutina.id;
  }

  /** Plan de 28 días que empieza hoy, con la rutina todos los días. */
  async crearPlanDeHoy(emailProfesor: string, rutinaId: string, alumnoIds: string[]) {
    const profesor = await this.token(emailProfesor);
    await this.pedir('post', '/planificacion/planes', profesor, {
      fechaInicio: hoyUtc(),
      alumnos: alumnoIds,
      dias: Array.from({ length: 28 }, (_, i) => ({ numero: i + 1, rutinaId })),
    });
  }

  /** Inicia el entrenamiento de hoy del alumno y devuelve su id. */
  async iniciarEntrenamiento(emailAlumno: string): Promise<string> {
    const alumno = await this.token(emailAlumno);
    const entrenamiento = (await this.pedir('post', '/entrenamiento/entrenamientos', alumno)) as {
      id: string;
    };
    return entrenamiento.id;
  }

  async registrarSerie(emailAlumno: string, entrenamientoId: string, serie: object) {
    const alumno = await this.token(emailAlumno);
    await this.pedir(
      'post',
      `/entrenamiento/entrenamientos/${entrenamientoId}/series`,
      alumno,
      serie,
    );
  }

  private async pedir(metodo: 'get' | 'post', ruta: string, token: string, data?: object) {
    const respuesta = await this.http[metodo](ruta, {
      headers: { Authorization: `Bearer ${token}` },
      ...(data ? { data } : {}),
    });
    expect(respuesta.ok(), `${metodo.toUpperCase()} ${ruta}: ${await respuesta.text()}`).toBe(true);
    const texto = await respuesta.text();
    return texto ? (JSON.parse(texto) as unknown) : undefined;
  }
}
