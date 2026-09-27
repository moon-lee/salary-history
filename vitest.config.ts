import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      finance: fileURLToPath(new URL('./src/finance.d.ts', import.meta.url)),
      'finance-logger': fileURLToPath(new URL('./src/vendor/logger.ts', import.meta.url))
    }
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environmentMatchGlobs: [['tests/unit/**/ui/**', 'happy-dom']]
  }
});
