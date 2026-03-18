import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().optional(),
    SERVER_PORT: z.coerce.number().int().positive().optional(),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
  })
  .transform((env) => ({
    ...env,
    PORT: env.PORT ?? env.SERVER_PORT ?? 3000,
  }));

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const flattened = parsedEnv.error.flatten().fieldErrors;
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(flattened)}`,
  );
}

export const env = parsedEnv.data;
