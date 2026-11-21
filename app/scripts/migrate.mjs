// Applies database changes in ../supabase/migrations that haven't run yet.
// Runs before each Vercel build. Each file runs once, in name order, inside a transaction.
// Connection details come from the Vercel Supabase integration (never committed).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', '..', 'supabase', 'migrations');
const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!raw) {
  console.log('[migrate] No database configured, skipping.');
  process.exit(0);
}
if (!existsSync(dir)) {
  console.error(`[migrate] Migrations folder not found at ${dir}`);
  process.exit(1);
}

// Supabase uses its own certificate authority; encrypt the connection without pinning it.
const url = new URL(raw);
url.searchParams.delete('sslmode');
url.searchParams.delete('supa');
const client = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });

const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

try {
  await client.connect();
  // Bookkeeping lives outside the public schema, so the app's API can't see it.
  await client.query('create schema if not exists app_meta');
  await client.query(
    'create table if not exists app_meta.migrations (name text primary key, applied_at timestamptz not null default now())',
  );
  const { rows } = await client.query('select name from app_meta.migrations');
  const done = new Set(rows.map((r) => r.name));

  for (const f of files) {
    if (done.has(f)) continue;
    console.log(`[migrate] Applying ${f}`);
    await client.query('begin');
    try {
      await client.query(readFileSync(join(dir, f), 'utf8'));
      await client.query('insert into app_meta.migrations (name) values ($1)', [f]);
      await client.query('commit');
    } catch (err) {
      await client.query('rollback');
      throw new Error(`${f}: ${err.message}`);
    }
  }
  console.log(`[migrate] Up to date (${files.length} migration${files.length === 1 ? '' : 's'}).`);
} catch (err) {
  console.error(`[migrate] Failed: ${err.message}`);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
