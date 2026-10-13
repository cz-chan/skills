import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('c12z'))

// TODO: /api/likes

export default app
