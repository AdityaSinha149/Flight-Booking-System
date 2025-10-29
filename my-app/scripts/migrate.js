import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables - try .env.local first, then .env
const envLocalPath = join(__dirname, '..', '.env.local');
const envPath = join(__dirname, '..', '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

console.log('🔄 Starting database migration...\n');

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

async function checkColumnExists(tableName, columnName) {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = ${tableName} 
        AND column_name = ${columnName}
      ) as exists
    `;
    return result[0].exists;
  } catch (error) {
    console.error(`Error checking column ${columnName}:`, error.message);
    return false;
  }
}

async function checkTableExists(tableName) {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = ${tableName}
      ) as exists
    `;
    return result[0].exists;
  } catch (error) {
    console.error(`Error checking table ${tableName}:`, error.message);
    return false;
  }
}

async function migrateTicketsTable() {
  console.log('📋 Checking tickets table...');
  
  const tableExists = await checkTableExists('tickets');
  
  if (!tableExists) {
    console.log('⚠️  tickets table does not exist, creating it...');
    try {
      await sql`
        CREATE TABLE tickets (
          ticket_id BIGSERIAL PRIMARY KEY,
          seat_number VARCHAR(10) NOT NULL,
          user_id BIGINT NOT NULL,
          instance_id BIGINT NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone_no VARCHAR(20) NOT NULL,
          booking_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (instance_id) REFERENCES instances(instance_id) ON DELETE CASCADE
        )
      `;
      console.log('✅ tickets table created successfully\n');
      return;
    } catch (error) {
      console.error('❌ Error creating tickets table:', error.message);
      return;
    }
  }

  // Check and add missing columns
  const requiredColumns = [
    { name: 'first_name', type: 'VARCHAR(50) NOT NULL DEFAULT \'\'' },
    { name: 'last_name', type: 'VARCHAR(50) NOT NULL DEFAULT \'\'' },
    { name: 'email', type: 'VARCHAR(255) NOT NULL DEFAULT \'\'' },
    { name: 'phone_no', type: 'VARCHAR(20) NOT NULL DEFAULT \'\'' },
    { name: 'booking_time', type: 'TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP' }
  ];

  for (const column of requiredColumns) {
    const exists = await checkColumnExists('tickets', column.name);
    
    if (!exists) {
      console.log(`  ➕ Adding column: ${column.name}`);
      try {
        await sql.unsafe(`
          ALTER TABLE tickets 
          ADD COLUMN ${column.name} ${column.type}
        `);
        console.log(`  ✅ Added ${column.name}`);
      } catch (error) {
        console.error(`  ❌ Error adding ${column.name}:`, error.message);
      }
    } else {
      console.log(`  ✓ Column ${column.name} exists`);
    }
  }
  
  console.log('✅ tickets table migration complete\n');
}

async function migrateAllTables() {
  try {
    // Check if essential tables exist
    const tables = ['users', 'airlines', 'airports', 'flights'];
    let missingTables = [];
    
    for (const table of tables) {
      const exists = await checkTableExists(table);
      if (!exists) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      console.log(`⚠️  Missing essential tables: ${missingTables.join(', ')}`);
      console.log('⚠️  Please run: npm run init-schema\n');
      process.exit(1);
    }
    
    // Migrate tickets table (most critical for booking)
    await migrateTicketsTable();
    
    console.log('✅ All migrations completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migrations
migrateAllTables().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
