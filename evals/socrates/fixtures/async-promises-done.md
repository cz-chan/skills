---
status: done
domain: code
topic: Por qué getUser imprime Promise { <pending> }
concepts: [async, promises, await]
updated: 2026-10-14
---

# Por qué getUser imprime Promise { <pending> } — 2026-10-14

## Conclusions you reached

- Una función `async` siempre envuelve lo que devuelves en una promesa.
- Sin `await`, `user` es la promesa pendiente y `console.log` la imprime antes de que llegue la respuesta.
- Para obtener el valor: `await getUser(1)` dentro de otra función `async`, o `.then`.

## Questions that got you there

1. Si `async function f() { return 5 }`, ¿qué imprime `console.log(f())`? → "5?" (luego viste `Promise { 5 }`)
2. ¿Qué contiene `user` justo después de la línea 6? → una promesa pendiente

## Thinking errors and how you fixed them

- **Suponías:** que una función `async` devuelve directamente el valor del `return` → **Te diste cuenta:** al ver `Promise { 5 }` en vez de `5`.

## To explore next and why

- Si `await` necesita estar dentro de otra función `async`, ¿qué devuelve *esa* función a quien la llama?
