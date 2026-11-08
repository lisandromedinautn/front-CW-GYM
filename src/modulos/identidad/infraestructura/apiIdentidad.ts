import { pedir } from '../../../compartido/infraestructura/clienteHttp.ts';
import type { Sesion } from '../../../compartido/dominio/sesion.ts';

export function ingresar(email: string, contrasenia: string): Promise<Sesion> {
  return pedir<Sesion>('/identidad/ingreso', { metodo: 'POST', cuerpo: { email, contrasenia } });
}

export interface DatosAltaProfesor {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  numeroDocumento: string;
  legajo: string;
  email: string;
  contrasenia: string;
}

export function darAltaProfesor(datos: DatosAltaProfesor): Promise<{ id: string; legajo: string }> {
  return pedir('/identidad/profesores', { metodo: 'POST', cuerpo: datos });
}

export function obtenerCodigoProfesor(): Promise<{ codigo: string | null }> {
  return pedir('/identidad/profesores/codigo');
}

export function generarCodigoProfesor(): Promise<{ codigo: string }> {
  return pedir('/identidad/profesores/codigo', { metodo: 'POST' });
}
