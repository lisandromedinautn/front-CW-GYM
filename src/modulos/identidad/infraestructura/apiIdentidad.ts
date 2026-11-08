import { pedir } from '../../../compartido/infraestructura/clienteHttp.ts';
import type { Sesion } from '../../../compartido/dominio/sesion.ts';

export function ingresar(email: string, contrasenia: string): Promise<Sesion> {
  return pedir<Sesion>('/identidad/ingreso', { metodo: 'POST', cuerpo: { email, contrasenia } });
}
