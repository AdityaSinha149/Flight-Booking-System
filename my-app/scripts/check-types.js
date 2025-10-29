import postgres from 'postgres';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envLocalPath = join(__dirname, '..', '.env.local');
const envPath = join(__dirname, '..', '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

console.log('\nflight_instances schema:');
const fi = await sql`
  SELECT column_name, data_type, character_maximum_length 
  FROM information_schema.columns 
  WHERE table_name = 'flight_instances'
  ORDER BY ordinal_position
`;
console.table(fi);

console.log('\ndeleted_flight_instances schema:');
const dfi = await sql`
  SELECT column_name, data_type, character_maximum_length 
  FROM information_schema.columns 
  WHERE table_name = 'deleted_flight_instances'
  ORDER BY ordinal_position
`;
console.table(dfi);

await sql.end();
