import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// メモ一覧取得
app.get("/api/memo", async (c) => {
  return c.json({ message: "Hello, hono!" });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
