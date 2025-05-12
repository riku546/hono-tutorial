import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export class MemoRepository {
  getMemosByUser = async (userId: string) => {
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
