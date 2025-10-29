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

console.log('Fixing deleted_flight_instances table schema...\n');

try {
  // Alter the flight_no column type
  await sql.unsafe(`
    ALTER TABLE deleted_flight_instances 
    ALTER COLUMN flight_no TYPE VARCHAR(20)
  `);
  console.log('✅ Changed flight_no from INTEGER to VARCHAR(20)');
  
  // Also fix instance_id and route_id if needed
  await sql.unsafe(`
    ALTER TABLE deleted_flight_instances 
    ALTER COLUMN instance_id TYPE INTEGER
  `);
  console.log('✅ Changed instance_id from BIGINT to INTEGER');
  
  await sql.unsafe(`
    ALTER TABLE deleted_flight_instances 
    ALTER COLUMN route_id TYPE INTEGER
  `);
  console.log('✅ Changed route_id from BIGINT to INTEGER');
  
  console.log('\n✅ Schema fix completed!');
} catch (error) {
  console.error('❌ Error:', error.message);
}

await sql.end();
