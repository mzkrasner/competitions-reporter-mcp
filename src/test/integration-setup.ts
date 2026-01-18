/**
 * Integration test setup
 * 
 * Integration tests require:
 * - COMPETITIONS_API_KEY for API access
 * 
 * Tests use describe.skipIf() to handle missing env vars gracefully.
 */
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, afterAll } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load test environment variables
const envTestPath = path.resolve(__dirname, '../../.env.test');
config({ path: envTestPath, override: true });

// Fallback to regular .env if .env.test doesn't exist
config({ path: path.resolve(__dirname, '../../.env') });

beforeAll(async () => {
  // Verify API key is available
  if (!process.env.COMPETITIONS_API_KEY) {
    console.warn('⚠️ COMPETITIONS_API_KEY not set - integration tests will be skipped');
  } else {
    console.log('✅ API key configured for integration tests');
  }
});

afterAll(async () => {
  // Cleanup if needed
});