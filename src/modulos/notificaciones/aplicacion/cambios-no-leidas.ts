// Aviso interno del módulo: cuando cambia la cantidad de no leídas (p. ej. al marcar una como leída),
// el contador del menú vuelve a consultar sin esperar al intervalo de 60 s (RN-UI-NOT-01).

type Escucha = () => void;

const escuchas = new Set<Escucha>();

export function avisarCambioNoLeidas(): void {
  escuchas.forEach((escucha) => escucha());
}

export function escucharCambioNoLeidas(escucha: Escucha): () => void {
  escuchas.add(escucha);
  return () => {
    escuchas.delete(escucha);
  };
}
