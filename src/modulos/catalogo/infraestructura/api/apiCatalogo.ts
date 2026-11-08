import { pedir } from '../../../../compartido/infraestructura/cliente-http/clienteHttp.ts';
import type { Ejercicio } from '../../dominio/ejercicio/ejercicio.ts';

export function listarEjercicios(): Promise<Ejercicio[]> {
  return pedir<Ejercicio[]>('/catalogo/ejercicios');
}
