import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export class MemoRepository {
  static fetchMemos = async (userId: string) => {
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

  static createMemo = async (
    userId: string,
    title: string,
    content: string
  ) => {
    return prisma.memo.create({
      data: {
        userId,
        title,
        content,
      },
    });
  };

  static updateMemo = async (
    userId: string,
    title: string,
    content: string,
    createdAt: Date
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

  static deleteMemo = async (userId: string, createdAt: Date) => {
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
  static createUser = async (name: string, email: string, password: string) => {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return user;
  };

  static userInfoById = async (id: string) => {
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

  static userInfoByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    return user;
  };
}
