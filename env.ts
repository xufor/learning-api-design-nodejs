import { env } from 'custom-env';
import { z } from 'zod';
import { NODE_ENVIRONMENTS } from './constants.ts';
import { getNodeEnv } from './helpers.ts';

const nodeEnv = getNodeEnv();

// Load .env file
switch (nodeEnv) {
  case NODE_ENVIRONMENTS.DEV:
    env(nodeEnv);
  case NODE_ENVIRONMENTS.TEST:
    env(nodeEnv);
}

// Define the schema with environment-specific requirements
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(Object.values(NODE_ENVIRONMENTS))
    .default(NODE_ENVIRONMENTS.DEV),

  // Server
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),

  // Database
  DATABASE_URL: z.string().startsWith('postgresql://'),
  DATABASE_POOL_MIN: z.coerce.number().min(0).default(2),
  DATABASE_POOL_MAX: z.coerce.number().positive().default(10),

  // JWT & Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // Security
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),

  // CORS
  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .transform((val) => {
      if (typeof val === 'string') {
        return val.split(',').map((origin) => origin.trim());
      }
      return val;
    })
    .default([]),

  // Logging
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug', 'trace'])
    .default(NODE_ENVIRONMENTS.PROD ? 'info' : 'debug'),
});

// Parse and validate environment variables
let ENV: z.infer<typeof envSchema>;

try {
  ENV = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(z.treeifyError(error), null, 2));

    // More detailed error messages
    error.issues.forEach((err) => {
      const path = err.path.join('.');
      console.error(`${path}: ${err.message}`);
    });

    process.exit(1);
  }
  throw error;
}

// Export the validated environment object
export { ENV };
