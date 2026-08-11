import type { Request, Response } from "express";
import { LogInBody, LogInResponse, GetCurrentUserResponse, SignUpBody, SignUpResponse } from "@workspace/api-zod";
import { User } from "../models/User";
import { createToken } from "../lib/auth";
import { toPublicUser } from "../lib/user";
import type { AuthenticatedRequest } from "../middlewares/auth";

export async function signUp(req: Request, res: Response): Promise<void> {
  const parsed = SignUpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const user = await User.create({
      ...parsed.data,
      email: parsed.data.email.trim().toLowerCase(),
    });
    const response = SignUpResponse.parse({ token: createToken(user), user: toPublicUser(user) });
    res.status(201).json(response);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }
    throw error;
  }
}

export async function logIn(req: Request, res: Response): Promise<void> {
  const parsed = LogInBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = await User.findOne({ email: parsed.data.email.trim().toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(parsed.data.password))) {
    res.status(401).json({ error: "Email or password is incorrect" });
    return;
  }

  const response = LogInResponse.parse({ token: createToken(user), user: toPublicUser(user) });
  res.json(response);
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthenticatedRequest).userId;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ error: "User account no longer exists" });
    return;
  }

  res.json(GetCurrentUserResponse.parse(toPublicUser(user)));
}