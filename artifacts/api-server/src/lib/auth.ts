import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserDoc } from "../models/User";
import { env } from "../config/env";

export type AuthTokenPayload = { sub: string };

export function createToken(user: UserDoc): string {
  return jwt.sign({ sub: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return { sub: decoded.sub };
}