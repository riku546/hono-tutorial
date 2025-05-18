import { jwtExp, jwtSecret } from "./jwtEnv.js";
import { MemoRepository, UserRepository } from "./repository.js";
import { sign } from "hono/jwt";
import bcrypt from "bcrypt";

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.createUser(
      username,
      email,
      hashedPassword
    );
    const payload = AuthService.payload(user.id);

    const token = await sign(payload, jwtSecret);

    return token;
  }

  static async login(email: string, password: string): Promise<string | false> {
    const user = await UserRepository.userInfoByEmail(email);

    if (!user) {
      return false;
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return false;
    }

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
