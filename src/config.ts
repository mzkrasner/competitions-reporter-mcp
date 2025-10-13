import chalk from 'chalk';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Define types for configuration variables
interface Config {
  COMPETITIONS_API_KEY?: string;
  COMPETITIONS_API_URL?: string;
  DEBUG?: boolean;
}

// Custom logger implementation
export const logger = {
  error: (...args: unknown[]) =>
    process.stderr.write(`${chalk.red('[ERROR]')} ${args.join(' ')}\n`),
  warn: (...args: unknown[]) =>
    process.stderr.write(`${chalk.yellow('[WARN]')} ${args.join(' ')}\n`),
  info: (...args: unknown[]) => 
    process.stderr.write(`${chalk.blue('[INFO]')} ${args.join(' ')}\n`),
  debug: (...args: unknown[]) => {
    if (process.env.DEBUG === 'true') {
      process.stderr.write(`${chalk.gray('[DEBUG]')} ${args.join(' ')}\n`);
    }
  },
};

// Determine file paths for .env loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENV_FILE_PATH: string = resolve(__dirname, '..', '.env');
let envLoaded: boolean = false;

// Load environment variables with external priority
const loadEnv = (): void => {
  if (envLoaded) return;

  // Check if required environment variables are already set externally
  const requiredExternalVars = ['COMPETITIONS_API_KEY'];

  const hasExternalConfig = requiredExternalVars.some(varName => process.env[varName]);
  
  if (hasExternalConfig) {
    logger.info('Using environment variables from external environment (system/container/CI).');
    envLoaded = true;
    return;
  }

  // Fallback to .env file if no external variables found
  try {
    const envContent: string = readFileSync(ENV_FILE_PATH, 'utf8');
    const envVars: Record<string, string> = envContent.split('\n').reduce((acc, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('='); // Handle values with = in them
        if (key && value) {
          acc[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
        }
      }
      return acc;
    }, {} as Record<string, string>);

    // Set environment variables if not already set
    Object.entries(envVars).forEach(([key, value]) => {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });

    logger.info('Loaded environment variables from .env file');
  } catch (error: unknown) {
    const message: string = error instanceof Error ? error.message : String(error);
    logger.warn(`No valid .env file found: ${message}. Using external environment variables or defaults.`);
  }

  envLoaded = true;
};

// Initialize environment loading
loadEnv();

// Export configuration object
export const config: Config = {
  COMPETITIONS_API_KEY: process.env.COMPETITIONS_API_KEY,
  COMPETITIONS_API_URL: process.env.COMPETITIONS_API_URL || 'https://api.competitions.recall.network',
  DEBUG: process.env.DEBUG === 'true',
};

// Validate environment
export function validateEnv(): void {
  const requiredVars: (keyof Config)[] = ['COMPETITIONS_API_KEY'];
  const optionalVars: (keyof Config)[] = ['COMPETITIONS_API_URL', 'DEBUG'];

  const missingRequired = requiredVars.filter((v) => !config[v]);
  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(', ')}. Please set COMPETITIONS_API_KEY.`
    );
  }

  const missingOptional = optionalVars.filter((v) => !config[v]);
  if (missingOptional.length > 0) {
    logger.info(`Optional variables not set: ${missingOptional.join(', ')}. Using defaults.`);
  }

  logger.info(`API URL: ${config.COMPETITIONS_API_URL}`);
}

// Debug startup message
if (config.DEBUG) {
  logger.info('Starting Competitions MCP with debug mode enabled');
}