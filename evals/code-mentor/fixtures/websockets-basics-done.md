---
status: done
topic: Qué son los WebSockets
concepts: [websockets, http, handshake, full-duplex]
level: trainee
mode: explain
updated: 2026-10-12
---

## Summary

Diferencia entre HTTP (petición → respuesta) y WebSocket (canal abierto en
los dos sentidos). Practicó en consola con `websocat` contra un servidor
echo. Pregunta final tipo test: acertó.

## Log

### 1. WebSockets básicos — 2026-10-12

- Did: abrió una conexión con `websocat`, envió mensajes y vio el eco.
- Stuck on: pensaba que el servidor solo puede responder, no enviar por su
  cuenta.
- Solved by: se le mostró un servidor que envía la hora cada segundo sin
  que el cliente pida nada.
- Lesson: en HTTP el servidor solo habla cuando el cliente pregunta. Un
  WebSocket empieza como una petición HTTP (el handshake) y luego se queda
  abierto: los dos lados pueden enviar cuando quieran. Por eso sirve para
  chats o notificaciones en tiempo real. Si necesitas que el servidor avise
  al cliente sin que este pregunte, HTTP normal no basta.

## Assets

- MDN — WebSockets API: <url> (official)
- websocat README: <url> (unofficial)
