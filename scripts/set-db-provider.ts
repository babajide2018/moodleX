/**
 * Database Provider Switcher
 *
 * Usage: npx tsx scripts/set-db-provider.ts <provider>
 * Supported providers: postgresql, mysql, sqlite, sqlserver
 *
 * This script updates the Prisma schema to use the specified database provider,
 * similar to how Moodle lets you choose your database during installation.
 *
 * After running this script, run:
 *   npx prisma generate
 *   npx prisma db push (or npx prisma migrate dev)
 */

import * as fs from 'fs';
import * as path from 'path';

const VALID_PROVIDERS = ['postgresql', 'mysql', 'sqlite', 'sqlserver'] as const;
type Provider = typeof VALID_PROVIDERS[number];

const provider = process.argv[2] as Provider;

if (!provider || !VALID_PROVIDERS.includes(provider)) {
  console.error(`Usage: npx tsx scripts/set-db-provider.ts <provider>`);
  console.error(`Supported providers: ${VALID_PROVIDERS.join(', ')}`);
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Replace the provider line
schema = schema.replace(
  /provider\s*=\s*"(postgresql|mysql|sqlite|sqlserver)"/,
  `provider = "${provider}"`
);

// Handle @db.Text - SQLite doesn't support it
if (provider === 'sqlite') {
  schema = schema.replace(/@db\.Text/g, '');
  console.log('Note: Removed @db.Text annotations (not supported by SQLite)');
}

fs.writeFileSync(schemaPath, schema, 'utf-8');
console.log(`✅ Prisma schema updated to use ${provider}`);
console.log('');
console.log('Next steps:');
console.log('  1. Update DATABASE_URL in .env');
console.log('  2. Run: npx prisma generate');
console.log('  3. Run: npx prisma db push');
