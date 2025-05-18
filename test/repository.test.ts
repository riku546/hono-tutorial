import { describe, expect, test, vi } from "vitest";
import prisma from "../lib/__mocks__/prisma.js";
import { MemoRepository, UserRepository } from "../src/repository.js";

vi.mock("../lib/prisma.js");

describe("memo repository", () => {
  test("fetchMemos func", async () => {
    //memosのcreatedAtは降順に並んでいる
    const memos = [
      {
        title: "test1",
        content: "test content1",
        createdAt: new Date("2023-11-01T10:00:00"),
      },
      {
        title: "test2",
        content: "test content2",
        createdAt: new Date("2023-11-02T10:00:00"),
      },
      {
        title: "test3",
        content: "test content3",
        createdAt: new Date("2023-11-03T10:00:00"),
      },
    ];

    const userId = "testUserId";

    prisma.memo.findMany.mockResolvedValue(memos as any);
    const result = await MemoRepository.fetchMemos(userId);
    expect(result).toEqual(memos);
  });

  test("createMemo func", async () => {
    const newMemo = {
      userId: "test userId",
      title: "test title",
      content: "test content",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.memo.create.mockResolvedValue(newMemo);
    const result = await MemoRepository.createMemo(
      newMemo.userId,
      newMemo.title,
      newMemo.content
    );
    expect(result).toEqual(newMemo);
  });

  test("updateMemo func", async () => {
    const updatedMemo = {
      title: "updated title",
      content: "updated content",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "test userId",
    };

    prisma.memo.update.mockResolvedValue(updatedMemo);
    const result = await MemoRepository.updateMemo(
      updatedMemo.userId,
      updatedMemo.title,
      updatedMemo.content,
      updatedMemo.createdAt
    );
    expect(result).toBe(updatedMemo);
  });

  test("deleteMemo func", async () => {
    const deletedMemo = {
      title: "test title",
      content: "test content",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "test userId",
    };

    prisma.memo.delete.mockResolvedValueOnce(deletedMemo);
    const result = await MemoRepository.deleteMemo(
      deletedMemo.userId,
      deletedMemo.createdAt
    );
    expect(result).toBe(deletedMemo);
  });
});

describe("user repository", () => {
  test("createUser func", async () => {
    const newUser = {
      id: "test userId",
      name: "test userName",
      email: "test@test.com",
      password: "test password",
    };

    prisma.user.create.mockResolvedValue(newUser);
    const result = await UserRepository.createUser(
      newUser.name,
      newUser.email,
      newUser.password
    );
    expect(result).toBe(newUser);
  });

  test("userInfoById func exist user", async () => {
    const userInfo = {
      id: "test userId",
      name: "test userName",
      email: "test@test.com",
    };

    prisma.user.findUnique.mockResolvedValue(userInfo as any);
    const result = await UserRepository.userInfoById(userInfo.id);
    expect(result).toBe(userInfo);
  });

  test("userInfoById func undefined user", async () => {
    const userId = "test userId";

    prisma.user.findUnique.mockResolvedValue(null);
    const result = await UserRepository.userInfoById(userId);
    expect(result).toBe(null);
  });

  test("userInfoByEmail func exist user", async () => {
    const email = "test@test.com";
    const userInfo = { id: "test userId", password: "test password" };

    prisma.user.findUnique.mockResolvedValue(userInfo as any);
    const result = await UserRepository.userInfoByEmail(email);
    expect(result).toBe(userInfo);
  });

  test("userInfoByEmail func  undefined user", async () => {
    const email = "test@test.com";

    prisma.user.findUnique.mockResolvedValue(null);
    const result = await UserRepository.userInfoByEmail(email);
    expect(result).toBe(null);
  });
});
