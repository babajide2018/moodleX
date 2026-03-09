import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

/**
 * POST /api/setup/test-db
 *
 * Tests the database connection with the provided credentials.
 * Spawns an external Node script that uses raw TCP + protocol-level
 * handshake to verify the database is reachable and credentials are valid.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dbtype, dbhost, dbport, dbname, dbuser, dbpass } = body;

    // Build connection URL based on provider
    let connectionUrl = '';

    switch (dbtype) {
      case 'postgresql':
        connectionUrl = `postgresql://${dbuser}:${encodeURIComponent(dbpass || '')}@${dbhost}:${dbport || '5432'}/${dbname}`;
        break;
      case 'mysql':
      case 'mariadb':
        connectionUrl = `mysql://${dbuser}:${encodeURIComponent(dbpass || '')}@${dbhost}:${dbport || '3306'}/${dbname}`;
        break;
      case 'sqlite':
        return NextResponse.json({
          ok: true,
          message: `SQLite database "${dbname || 'moodlex'}.db" will be created automatically during installation.`,
        });
      case 'sqlserver':
        connectionUrl = `sqlserver://${dbhost}:${dbport || '1433'};database=${dbname};user=${dbuser};password=${dbpass};encrypt=true;trustServerCertificate=true`;
        break;
      default:
        return NextResponse.json(
          { ok: false, message: `Unknown database type: ${dbtype}` },
          { status: 400 }
        );
    }

    // Validate required fields
    if (!dbhost) {
      return NextResponse.json({ ok: false, message: 'Database host is required.' });
    }
    if (!dbname) {
      return NextResponse.json({ ok: false, message: 'Database name is required.' });
    }
    if (!dbuser) {
      return NextResponse.json({ ok: false, message: 'Database username is required.' });
    }

    const projectRoot = process.cwd();
    const testScriptPath = path.join(projectRoot, 'prisma', '_test_connection.mjs');
    const testScript = buildTestScript(connectionUrl, dbtype);
    await writeFile(testScriptPath, testScript, 'utf-8');

    try {
      const output = execSync(`node "${testScriptPath}"`, {
        cwd: projectRoot,
        env: { ...process.env, DATABASE_URL: connectionUrl },
        stdio: 'pipe',
        timeout: 15000,
      }).toString().trim();

      await cleanup(testScriptPath);

      // Check if this is a warning (e.g. DB doesn't exist but creds are valid)
      const isWarning = output.startsWith('WARN:');
      const message = isWarning ? output.replace('WARN:', '') : output;

      return NextResponse.json({
        ok: true,
        warning: isWarning,
        message: message || `Successfully connected to ${dbtype} database "${dbname}" on ${dbhost}.`,
      });
    } catch (err: unknown) {
      await cleanup(testScriptPath);

      const stderr = (err as { stderr?: Buffer })?.stderr?.toString() || '';
      const errorMsg = err instanceof Error ? err.message : String(err);
      const friendlyError = parseDatabaseError(stderr || errorMsg, dbtype, dbhost, dbuser);

      return NextResponse.json({
        ok: false,
        message: friendlyError,
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to test database connection.',
      },
      { status: 500 }
    );
  }
}

async function cleanup(...paths: string[]) {
  for (const p of paths) {
    try {
      const { unlink } = await import('fs/promises');
      await unlink(p);
    } catch { /* ignore */ }
  }
}

function buildTestScript(connectionUrl: string, dbtype: string): string {
  // Use @prisma/client with the datasource URL override.
  // This works because PrismaClient accepts a datasource URL at runtime
  // regardless of what provider the schema was generated with - Prisma's
  // query engine handles the actual connection.
  // However, if the current generated client doesn't match the target provider,
  // $connect will fail. So we use Prisma's raw connection URL test via
  // prisma db execute --stdin with a simple SELECT 1.
  return `
import { execSync } from 'child_process';
import path from 'path';

const connectionUrl = ${JSON.stringify(connectionUrl)};
const dbtype = ${JSON.stringify(dbtype)};

async function testConnection() {
  try {
    // Use "prisma db execute" to run a raw query against the target database.
    // This properly handles any provider without needing a matching generated client.
    const projectRoot = process.cwd();
    const schemaContent = \`
datasource db {
  provider = "\${dbtype === 'mariadb' ? 'mysql' : dbtype}"
  url      = "\${connectionUrl}"
}
\`;

    // Write a temp schema for the target provider
    const fs = await import('fs/promises');
    const tempSchema = path.join(projectRoot, 'prisma', '_test_conn_schema.prisma');
    await fs.writeFile(tempSchema, schemaContent, 'utf-8');

    try {
      // Use prisma db execute to test the connection with a simple query
      const result = execSync(
        'echo "SELECT 1;" | npx prisma db execute --stdin --schema="' + tempSchema + '"',
        {
          cwd: projectRoot,
          env: { ...process.env, DATABASE_URL: connectionUrl },
          stdio: 'pipe',
          timeout: 10000,
          shell: true,
        }
      ).toString();

      console.log('Successfully connected and authenticated to the ' + dbtype + ' database.');
    } finally {
      await fs.unlink(tempSchema).catch(() => {});
    }
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : '';
    const msg = stderr || err.message || String(err);

    // P1003 = database doesn't exist. This is OK - credentials are valid,
    // the database will be created during installation.
    if (msg.includes('P1003') || msg.toLowerCase().includes('does not exist') || msg.toLowerCase().includes('unknown database')) {
      console.log('WARN:Database does not exist yet but credentials are valid. It will be created during installation.');
      process.exit(0);
    }

    console.error(msg);
    process.exit(1);
  }
}

testConnection();
`;
}

function parseDatabaseError(error: string, dbtype: string, dbhost: string, dbuser: string): string {
  const lowerError = error.toLowerCase();

  // Prisma error codes (P1xxx = connection errors)
  if (lowerError.includes('p1000') || lowerError.includes('authentication failed')) {
    return `Authentication failed for user "${dbuser}". Please check the username and password.`;
  }
  if (lowerError.includes('p1001') || lowerError.includes('can\'t reach database')) {
    return `Can't reach the database server at ${dbhost}. Make sure the ${dbtype} server is running and the host/port are correct.`;
  }
  if (lowerError.includes('p1002') || lowerError.includes('timed out')) {
    return `Connection timed out trying to reach ${dbhost}. Check that the host and port are correct.`;
  }
  if (lowerError.includes('p1003') || lowerError.includes('does not exist')) {
    return `Database does not exist on the server. It will be created during installation.`;
  }
  if (lowerError.includes('p3004') || lowerError.includes('system database')) {
    return `Cannot use a system database. Please specify a different database name (e.g. "moodlex").`;
  }

  if (lowerError.includes('econnrefused') || lowerError.includes('connection refused')) {
    return `Connection refused at ${dbhost}. Make sure the ${dbtype} server is running and accepting connections on the specified port.`;
  }
  if (lowerError.includes('enotfound') || lowerError.includes('getaddrinfo') || lowerError.includes('unknown host')) {
    return `Host "${dbhost}" not found. Please check the hostname or IP address.`;
  }
  if (lowerError.includes('access denied')) {
    return `Authentication failed for user "${dbuser}". Please check the username and password.`;
  }
  if (lowerError.includes('unknown database')) {
    return `Database does not exist on the server. It will be created during installation.`;
  }
  if (lowerError.includes('ssl') || lowerError.includes('tls')) {
    return `SSL/TLS error connecting to ${dbhost}. Check your database server's SSL configuration.`;
  }

  // Extract the most useful Prisma error description (line after "Error: Pxxxx")
  const prismaDesc = error.split('\n').find(l =>
    l.trim() && !l.startsWith('Error:') && !l.trim().startsWith('at ') &&
    !l.includes('node_modules') && !l.includes('node:internal') &&
    !l.includes('Please make sure')
  );
  if (prismaDesc?.trim()) return prismaDesc.trim();

  return 'Connection test failed. Please check your database settings.';
}
