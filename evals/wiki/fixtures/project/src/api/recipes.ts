import { Hono } from "hono";
import { sql } from "../db";

export const recipes = new Hono();

recipes.get("/:id", async (c) => {
  const rows = await sql`select * from recipes where id = ${c.req.param("id")}`;
  return c.json(rows[0]);
});
