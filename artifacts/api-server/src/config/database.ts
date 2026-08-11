import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../lib/logger";

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("error", (error) => {
    logger.error({ err: error }, "MongoDB connection error");
  });

  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
}