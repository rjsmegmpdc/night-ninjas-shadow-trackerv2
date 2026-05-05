import type { Config } from 'drizzle-kit';
import { resolveDataDir } from './lib/db/data-dir';
import path from 'node:path';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: path.join(resolveDataDir(), 'shadow-tracker.db'),
  },
  verbose: true,
  strict: true,
} satisfies Config;
