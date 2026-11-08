import { pedir } from '../../../compartido/infraestructura/clienteHttp.ts';
import type { Ejercicio } from '../dominio/ejercicio.ts';

export function listarEjercicios(): Promise<Ejercicio[]> {
  return pedir<Ejercicio[]>('/catalogo/ejercicios');
}
