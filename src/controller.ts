import type { Context } from "hono";
import { AuthService, MemoService } from "./service.js";

export class AuthController {
  static async register(c: Context) {
    const { username, email, password } = await c.req.json();

    try {
      const token = await AuthService.register(username, email, password);
      return c.json({ token }, 201);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async login(c: Context) {
    const { email, password } = await c.req.json();

    try {
      const token = await AuthService.login(email, password);

      if (token === undefined) {
        return c.json({ error: "email or password is incorrect" }, 404);
      }

      return c.json({ token }, 201);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}

export class MemoController {
  static async fetchMemos(c: Context) {
    const userId: string = c.get("jwtPayload").userId;

    try {
      const memos = await MemoService.fetchMemos(userId);

      return c.json({ memos }, 200);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async createMemo(c: Context) {
    const userId: string = c.get("jwtPayload").userId;
    const { title, content } = await c.req.json();

    try {
      const memo = await MemoService.createMemo(userId, title, content);

      return c.json({ memo }, 201);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async updateMemo(c: Context) {
    const userId: string = c.get("jwtPayload").userId;
    const { title, content, createdAt } = await c.req.json();

    try {
      const memo = await MemoService.updateMemo(
        userId,
        title,
        content,
        createdAt
      );

      return c.json({ memo }, 200);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async deleteMemo(c: Context) {
    const userId: string = c.get("jwtPayload").userId;
    const { createdAt } = await c.req.json();

    try {
      await MemoService.deleteMemo(userId, createdAt);

      return c.json(204);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}
