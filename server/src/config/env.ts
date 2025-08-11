import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('8000'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().optional(),
    JWT_EXPIRES_IN: z.string().default('7d'),
});

const env = envSchema.parse(process.env);

export default env;
