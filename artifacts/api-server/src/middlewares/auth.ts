import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth";

export type AuthenticatedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const { sub } = verifyToken(token);
    (req as AuthenticatedRequest).userId = sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}