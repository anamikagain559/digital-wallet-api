import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: 'development' | 'production';
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ['PORT', 'DB_URL', 'NODE_ENV'];

  const missingVars: string[] = requiredEnvVariables.filter(
    (key) => !process.env[key]
  );

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const { PORT, DB_URL, NODE_ENV } = process.env;

  // We are sure here that all required vars are present, so we can safely cast
  return {
    PORT: PORT as string,
    DB_URL: DB_URL as string,
    NODE_ENV: NODE_ENV as 'development' | 'production',
  };
};

export const envVars = loadEnvVariables();
