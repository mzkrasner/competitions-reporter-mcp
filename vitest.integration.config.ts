/**
 * Integration test configuration
 * 
 * Integration tests require:
 * - COMPETITIONS_API_KEY for API access
 * 
 * Run with: npm run test:integration
 */
import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

// Load test environment variables
config({ path: '.env.test' });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/integration-setup.ts'],
    // Only include integration tests
    include: ['src/**/*.integration.test.ts'],
    // Integration tests run sequentially - they share external API state
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
    testTimeout: 30000,
  },
});