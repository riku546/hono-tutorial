import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "secret";
// 現在時刻 + 7日間
export const jwtExp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
