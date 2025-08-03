//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import * as z from 'zod';

// Load environment variables from .env files
import { Environment } from '../data/feature';

const createEnv = () => {
  const EnvSchema = z.object({
    PORT: z
      .string()
      .regex(/^\d+$/, 'PORT must be a valid number')
      .transform(Number)
      .refine((port) => ['3000', '4000', '5000'].includes(port.toString()), {
        message:
          'PORT must be a valid port number among ["3000", "4000", "5000"]',
      })
      .default('3000'),
    API_URL: z.string().default('http://localhost:9000'),
    SECRET_KEY: z.string().default('secret-key'),
    ENVIRONMENT: z.nativeEnum(Environment).default(Environment.DEV),
    ALLOWED_HOSTS: z.string().optional(),
    DEPLOYED: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional()
      .default('false'),
    // Mock API settings
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),
  });
  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided. The following variables are missing or invalid: ${Object.entries(
        parsedEnv.error.flatten().fieldErrors,
      )
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}`,
    );
  }

  const env = parsedEnv.data;

  // console.log('Environment Variables:', env.DEPLOYED, typeof env.DEPLOYED);

  return env;
};

export const env = createEnv();
