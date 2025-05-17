import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";
import { AuthController, MemoController } from "./controller.js";
import { jwtSecret } from "./jwtEnv.js";

const app = new Hono<{ Variables: JwtVariables }>();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    allowHeaders: ["*"],
    allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  })
);

app.use(
  "/api/*",
  jwt({
    secret: jwtSecret,
  })
);

app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

app.get("/api/memo", MemoController.fetchMemos);
app.post("/api/memo", MemoController.createMemo);
app.put("/api/memo", MemoController.updateMemo);
app.delete("/api/memo", MemoController.deleteMemo);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
