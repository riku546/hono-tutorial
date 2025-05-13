import { callbackify } from "util";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export class MemoRepository {
  fetchMemos = async (userId: string) => {
    return prisma.memo.findMany({
      where: { userId },
      select: {
        title: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  };

  createMemo = async (userId: string, title: string, content: string) => {
    return prisma.memo.create({
      data: {
        userId,
        title,
        content,
      },
    });
  };

  updateMemo = async (
    userId: string,
    createdAt: Date,
    title: string,
    content: string
  ) => {
    return prisma.memo.update({
      where: {
        userId_createdAt: {
          userId,
          createdAt,
        },
      },
      data: {
        title,
        content,
      },
    });
  };

  deleteMemo = async (userId: string, createdAt: Date) => {
    return prisma.memo.delete({
      where: {
        userId_createdAt: {
          userId,
          createdAt,
        },
      },
    });
  };
}

export class UserRepository {
  createUser = async (name: string, email: string, password: string) => {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password,
      },
    });
    return user;
  };

  userInfoById = async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return user;
  };

  userInfoByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user;
  };

  checkValid = async (
    email: string,
    password: string
  ): Promise<boolean | undefined> => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) {
      return undefined;
    }

    return password === user.password;
  };
}
