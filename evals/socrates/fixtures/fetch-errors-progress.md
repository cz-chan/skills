---
status: in-progress
domain: code
topic: Why fetch does not fail on a 404
concepts: [fetch, http-errors, res-ok]
updated: 2026-10-13
---

## Where you left off

Querías entender por qué `getUser(9999)` no lanza ningún error aunque el usuario no existe. Ya descubriste que `fetch` solo rechaza la promesa si falla la red, y que con un 404 `res.ok` es `false`. Queda abierto: ¿qué tendría que hacer `getUser` para que quien la llama se entere de que el usuario no existe?

## Target

Explicar por qué `fetch` no falla con un 404 y cambiar `getUser` para que falle cuando la respuesta no es correcta.

## Conclusions you reached

- `fetch` solo rechaza la promesa con errores de red (sin conexión, DNS…).
- Un 404 es una respuesta válida: la promesa se resuelve y `res.ok` es `false`.

## Thinking errors and how you fixed them

- **Assumed:** cualquier código de error HTTP hace que `fetch` lance → **Realized:** al ver que `getUser(9999)` devolvía `{}` sin error.
