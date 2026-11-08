// Regla local: las reglas de los hooks de React aplicadas también a los hooks en español.
//
// `react-hooks/rules-of-hooks` solo reconoce hooks que empiezan con `use`. En este proyecto los
// hooks propios se llaman `usar<Accion>` (CLAUDE.md, idioma), así que esa regla está apagada en
// `aplicacion/` y no controla las llamadas a `usar*` en ningún lado. Esta regla cubre las dos
// formas (`use*` y `usar*`) con los mismos dos controles:
//
//   1. Un hook solo se llama dentro de un componente (nombre en PascalCase) o de otro hook.
//   2. Un hook se llama siempre, en el mismo orden: nunca dentro de un if, un ternario, el lado
//      derecho de && / || / ??, un switch o un bucle, ni en una función anidada (callback).
//
// Es más simple que la de React (no analiza returns anticipados): si hace falta ese control,
// se agrega acá.

const ES_HOOK = /^(use|usar)[A-Z0-9]/;
const ES_COMPONENTE = /^[A-Z]/;

const FUNCIONES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);
const BUCLES = new Set([
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
]);

function nombreLlamado(callee) {
  if (callee.type === 'Identifier') return callee.name;
  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier'
  ) {
    return callee.property.name;
  }
  return null;
}

/** Nombre de la función: `function X`, `const X = () => {}` o `const X = function () {}`. */
function nombreFuncion(funcion) {
  if (funcion.id) return funcion.id.name;
  const padre = funcion.parent;
  if (padre?.type === 'VariableDeclarator' && padre.id.type === 'Identifier') return padre.id.name;
  return null;
}

/** ¿El nodo `hijo` se evalúa solo a veces dentro de `ancestro`? */
function esCondicional(ancestro, hijo) {
  switch (ancestro.type) {
    case 'IfStatement':
      return ancestro.test !== hijo;
    case 'ConditionalExpression':
      return ancestro.test !== hijo;
    case 'LogicalExpression':
      return ancestro.right === hijo;
    case 'SwitchCase':
      return true;
    default:
      return BUCLES.has(ancestro.type);
  }
}

export const reglaDeHooks = {
  meta: {
    type: 'problem',
    docs: { description: 'Reglas de los hooks de React, también para los hooks usar<Accion>' },
    messages: {
      fueraDeComponente:
        'El hook {{hook}} solo se llama dentro de un componente o de otro hook (use*/usar*).',
      condicional:
        'El hook {{hook}} se llama de forma condicional o en un bucle: los hooks se llaman siempre y en el mismo orden.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(nodo) {
        const hook = nombreLlamado(nodo.callee);
        if (!hook || !ES_HOOK.test(hook)) return;

        const ancestros = context.sourceCode.getAncestors(nodo);
        let hijo = nodo;
        for (let i = ancestros.length - 1; i >= 0; i -= 1) {
          const ancestro = ancestros[i];
          if (FUNCIONES.has(ancestro.type)) {
            const nombre = nombreFuncion(ancestro);
            if (!nombre || !(ES_COMPONENTE.test(nombre) || ES_HOOK.test(nombre))) {
              context.report({ node: nodo, messageId: 'fueraDeComponente', data: { hook } });
            }
            return;
          }
          if (esCondicional(ancestro, hijo)) {
            context.report({ node: nodo, messageId: 'condicional', data: { hook } });
            return;
          }
          hijo = ancestro;
        }
        // Llamado a nivel de módulo.
        context.report({ node: nodo, messageId: 'fueraDeComponente', data: { hook } });
      },
    };
  },
};

export default {
  meta: { name: 'cwgym-hooks' },
  rules: { 'reglas-de-hooks': reglaDeHooks },
};
