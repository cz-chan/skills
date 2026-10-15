---
status: in-progress
domain: code
topic: async-promises
concepts: [async, promise, pending, await]
updated: 2026-10-15
---

## Where you left off

Querías entender por qué `src/user.js` imprime `Promise { <pending> }` en vez del usuario.
Ya descubriste que `async` mete lo que devuelves en una promesa, así que `user` (línea 6) es una `Promise`.
Queda abierto: ¿qué no ha terminado todavía cuando se ejecuta la línea 7? ¿Y cómo sacarías el usuario de esa promesa?

## Target

Explicar por qué `user` es una promesa pendiente en la línea 7 y conseguir imprimir el usuario real.

## Conclusions you reached

- "async mete lo que devuelves en una promesa" (con mini-ejemplo `cinco()` y opciones).

## Thinking errors and how you fixed them

- **Assumed:** `async` no cambia nada, la función devuelve lo que pones en el `return` → **Realized:** con `async function cinco() { return 5 }` el resultado es `Promise { 5 }`, no `5`.
