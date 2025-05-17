import type { Context } from "hono";
import { MemoRepository, UserRepository } from "./repository.js";
import { sign } from "hono/jwt";
import { jwtExp, jwtSecret } from "./jwtEnv.js";

export class AuthController {
  static async register(c: Context) {
    const { username, email, password } = await c.req.json();

    const user = await UserRepository.createUser(username, email, password);

    const payload = {
      userId: user.id,
      exp: jwtExp,
    };

    const token = await sign(payload, jwtSecret);
    return c.json({ token }, 201);
  }

  static async login(c: Context) {
    const { email, password } = await c.req.json();
    const isExists = await UserRepository.checkAlreadyExists(email, password);

    if (isExists === undefined) {
      return c.json({ error: "email or password is incorrect" }, 404);
    }

    //型アサーションを使用しているのは、checkAlreadyExists関数でユーザーの存在は確認しているため。
    //そのため、userInfoByEmail関数の戻り値は必ず{ id: string }となる。
    const user = (await UserRepository.userInfoByEmail(email)) as {
      id: string;
    };

    const payload = {
      userId: user.id,
      exp: jwtExp,
    };

    const token = await sign(payload, jwtSecret);
    return c.json({ token }, 201);
  }
}

export class MemoController {
  static async fetchMemos(c: Context) {
    const userId: string = c.get("jwtPayload").userId;

    try {
      const memos = await MemoRepository.fetchMemos(userId);

      return c.json({ memos }, 200);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async createMemo(c: Context) {
    const userId: string = c.get("jwtPayload").userId;
    const { title, content } = await c.req.json();

    try {
      const memo = await MemoRepository.createMemo(userId, title, content);

      return c.json({ memo }, 201);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }

  static async updateMemo(c: Context) {
    const userId: string = c.get("jwtPayload").userId;
    const { title, content, createdAt } = await c.req.json();

    try {
      const memo = await MemoRepository.updateMemo(
        userId,
        createdAt,
        title,
        content
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
      await MemoRepository.deleteMemo(userId, createdAt);

      return c.json(204);
    } catch (error) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
}
