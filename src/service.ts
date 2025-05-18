import { jwtExp, jwtSecret } from "./jwtEnv.js";
import { MemoRepository, UserRepository } from "./repository.js";
import { sign } from "hono/jwt";

export class AuthService {
  static payload = (userId: string) => {
    return {
      userId: userId,
      exp: jwtExp,
    };
  };

  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<string> {
    const user = await UserRepository.createUser(username, email, password);

    const token = await sign(this.payload(user.id), jwtSecret);

    return token;
  }

  static async login(
    email: string,
    password: string
  ): Promise<string | undefined> {
    const isExists = await UserRepository.checkAlreadyExists(email, password);

    if (isExists === undefined) {
      return undefined;
    }

    //型アサーションを使用しているのは、checkAlreadyExists関数でユーザーの存在は確認しているため。
    //そのため、userInfoByEmail関数の戻り値は必ず{ id: string }となる。
    const user = (await UserRepository.userInfoByEmail(email)) as {
      id: string;
    };

    const payload = AuthService.payload(user.id);

    const token = await sign(payload, jwtSecret);

    return token;
  }
}

export class MemoService {
  static async fetchMemos(userId: string) {
    const memos = await MemoRepository.fetchMemos(userId);

    return memos;
  }

  static async createMemo(userId: string, title: string, content: string) {
    const memo = await MemoRepository.createMemo(userId, title, content);

    return memo;
  }

  static async updateMemo(
    userId: string,
    title: string,
    content: string,
    createdAt: Date
  ) {
    const memo = await MemoRepository.updateMemo(
      userId,
      title,
      content,
      createdAt
    );

    return memo;
  }

  static async deleteMemo(userId: string, createdAt: Date): Promise<void> {
    await MemoRepository.deleteMemo(userId, createdAt);
  }
}
