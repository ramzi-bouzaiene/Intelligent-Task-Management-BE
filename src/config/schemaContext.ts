import * as fs from 'fs';
import * as path from 'path';

function buildSchemaFromMigrations(): string {
  const migrationsPath = path.join(process.cwd(), 'src', 'migrations');

  if (!fs.existsSync(migrationsPath)) {
    console.warn('[Schema] Migrations folder not found at:', migrationsPath);
    return '';
  }

  const files = fs.readdirSync(migrationsPath).sort();
  const schemas: string[] = [];

  for (const file of files) {
    const fullPath = path.join(migrationsPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    const matches = content.match(/CREATE\s+TABLE[\s\S]*?;/gi);
    if (matches) {
      schemas.push(...matches);
    }
  }

  if (schemas.length === 0) {
    console.warn('[Schema] No CREATE TABLE statements found in migrations');
  }

  return schemas.join('\n\n');
}

export const DB_SCHEMA = buildSchemaFromMigrations();
