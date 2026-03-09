/**
 * Multi-Database Configuration
 *
 * Like Moodle, this LMS supports multiple database backends.
 * Users choose their database during setup, and the system
 * configures Prisma accordingly.
 */

import { DatabaseProvider } from '@/types';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// Default ports for each database provider
export const DEFAULT_PORTS: Record<DatabaseProvider, number> = {
  postgresql: 5432,
  mysql: 3306,
  mariadb: 3306,
  sqlite: 0,
  sqlserver: 1433,
};

// Provider display names
export const PROVIDER_NAMES: Record<DatabaseProvider, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  sqlite: 'SQLite',
  sqlserver: 'Microsoft SQL Server',
};

// Provider descriptions for setup wizard
export const PROVIDER_DESCRIPTIONS: Record<DatabaseProvider, string> = {
  postgresql: 'Recommended. Full-featured, reliable open-source database.',
  mysql: 'Popular open-source database. Widely supported.',
  mariadb: 'Community-developed fork of MySQL. Fully compatible.',
  sqlite: 'File-based database. Best for development/small deployments.',
  sqlserver: 'Microsoft SQL Server. Enterprise-grade database.',
};

/**
 * Build a Prisma-compatible DATABASE_URL from config
 */
export function buildDatabaseUrl(config: DatabaseConfig): string {
  const { provider, host, port, database, username, password, ssl } = config;

  switch (provider) {
    case 'postgresql':
      return `postgresql://${username}:${password}@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`;
    case 'mysql':
    case 'mariadb':
      return `mysql://${username}:${password}@${host}:${port}/${database}`;
    case 'sqlite':
      return `file:./${database}.db`;
    case 'sqlserver':
      return `sqlserver://${host}:${port};database=${database};user=${username};password=${password};encrypt=true`;
    default:
      throw new Error(`Unsupported database provider: ${provider}`);
  }
}

/**
 * Get Prisma provider name from our provider type
 */
export function getPrismaProvider(provider: DatabaseProvider): string {
  switch (provider) {
    case 'postgresql':
      return 'postgresql';
    case 'mysql':
    case 'mariadb':
      return 'mysql';
    case 'sqlite':
      return 'sqlite';
    case 'sqlserver':
      return 'sqlserver';
    default:
      return 'postgresql';
  }
}
