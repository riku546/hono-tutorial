import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { MemoRepository, UserRepository } from "./repository.js";
import { sign } from "hono/jwt";
import dotenv from "dotenv";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

const app = new Hono<{ Variables: JwtVariables }>();

dotenv.config();

const memoRepository = new MemoRepository();
const userRepository = new UserRepository();

const jwtSecret = process.env.JWT_SECRET || "";

app.use(
  "/api/*",
  jwt({
    secret: jwtSecret,
  })
);

app.get("/", (c) => {
  return c.text("Hello World");
});

// 現在時刻 + 7日間
const jwtExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

app.post("/register", async (c) => {
  const { name, email, password } = await c.req.json();
  const user = await userRepository.createUser(name, email, password);
  const payload = {
    userId: user.id,
    exp: jwtExp,
  };

  const token = await sign(payload, jwtSecret);
  return c.json({ token }, 201);
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const isValid = await userRepository.checkValid(email, password);

  if (!isValid) {
    return c.json({ error: "Invalid email or password" }, 422);
  }

  //型アサーションを使用しているのは、checkValid関数でユーザーの存在は確認しているため。
  //そのため、userInfoByEmail関数の戻り値は必ず{ id: string }となる。
  const user = (await userRepository.userInfoByEmail(email)) as {
    id: string;
  };

  const payload = {
    userId: user.id,
    exp: jwtExp,
  };

  const token = await sign(payload, jwtSecret);
  return c.json({ token }, 201);
});

app.get("/api/memo", async (c) => {
  const userId: string = c.get("jwtPayload").userId;

  try {
    const memos = await memoRepository.fetchMemos(userId);

    return c.json({ memos }, 200);
  } catch (error) {
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.post("/api/memo", async (c) => {
  const userId: string = c.get("jwtPayload").userId;
  const { title, content } = await c.req.json();

  try {
    const memo = await memoRepository.createMemo(userId, title, content);

    return c.json({ memo }, 201);
  } catch (error) {
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.put("/api/memo", async (c) => {
  const userId: string = c.get("jwtPayload").userId;
  const { title, content, createdAt } = await c.req.json();

  try {
    const memo = await memoRepository.updateMemo(
      userId,
      createdAt,
      title,
      content
    );

    return c.json({ memo }, 200);
  } catch (error) {
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.delete("/api/memo", async (c) => {
  const userId: string = c.get("jwtPayload").userId;
  const { createdAt } = await c.req.json();

  try {
    await memoRepository.deleteMemo(userId, createdAt);

    return c.json(204);
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
