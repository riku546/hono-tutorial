import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { MemoRepository } from "./repository.js";

const app = new Hono();

const memoRepository = new MemoRepository();

app.get("/", (c) => {
  return c.text("Hello World");
});

app.get("/api/memo", async (c) => {
  const userId: string = "";
  try {
    const memos = await memoRepository.fetchMemos(userId);
    return c.json({ memos }, 200);
  } catch (error) {
    return c.json({ error: "Internal Server Error" }, 500);
  }
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
