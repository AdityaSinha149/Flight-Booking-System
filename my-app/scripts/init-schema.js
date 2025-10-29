import postgres from 'postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
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

console.log('🔄 Initializing database schema...\n');

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10
});

async function initializeSchema() {
  try {
    console.log('⚠️  Note: This will only create tables that don\'t exist.');
    console.log('⚠️  Existing tables will NOT be modified or dropped.\n');
    
    // Create users table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          user_id BIGSERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          contact_no VARCHAR(20)
        )
      `;
      console.log('✅ users table ready');
    } catch (e) {
      console.log('⚠️  users table: ' + e.message);
    }

    // Create airlines table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS airlines (
          airline_id BIGSERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          code VARCHAR(10) NOT NULL UNIQUE
        )
      `;
      console.log('✅ airlines table ready');
    } catch (e) {
      console.log('⚠️  airlines table: ' + e.message);
    }

    // Create airports table - check if exists first
    const airportsExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'airports'
      ) as exists
    `;
    
    if (!airportsExists[0].exists) {
      try {
        await sql`
          CREATE TABLE airports (
            airport_id BIGSERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            city VARCHAR(50) NOT NULL,
            country VARCHAR(50) NOT NULL,
            iata_code VARCHAR(3) NOT NULL UNIQUE,
            timezone VARCHAR(50)
          )
        `;
        console.log('✅ airports table ready');
      } catch (e) {
        console.log('⚠️  airports table: ' + e.message);
      }
    } else {
      console.log('✅ airports table exists (keeping existing schema)');
    }

    // Create routes table - check if exists first
    const routesExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'routes'
      ) as exists
    `;
    
    if (!routesExists[0].exists) {
      try {
        await sql`
          CREATE TABLE routes (
            route_id BIGSERIAL PRIMARY KEY,
            departure_airport_id VARCHAR(10) NOT NULL,
            arrival_airport_id VARCHAR(10) NOT NULL,
            distance_km INT,
            UNIQUE(departure_airport_id, arrival_airport_id)
          )
        `;
        console.log('✅ routes table ready');
      } catch (e) {
        console.log('⚠️  routes table: ' + e.message);
      }
    } else {
      console.log('✅ routes table exists (keeping existing schema)');
    }

    // Create flights table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS flights (
          flight_id BIGSERIAL PRIMARY KEY,
          flight_number VARCHAR(20) NOT NULL UNIQUE,
          airline_id BIGINT NOT NULL,
          route_id BIGINT NOT NULL,
          total_seats INT NOT NULL,
          base_price DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (airline_id) REFERENCES airlines(airline_id) ON DELETE CASCADE,
          FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE
        )
      `;
      console.log('✅ flights table ready');
    } catch (e) {
      console.log('⚠️  flights table: ' + e.message);
    }

    // Create instances table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS instances (
          instance_id BIGSERIAL PRIMARY KEY,
          flight_id BIGINT NOT NULL,
          departure_time TIMESTAMPTZ NOT NULL,
          arrival_time TIMESTAMPTZ NOT NULL,
          available_seats INT NOT NULL,
          status VARCHAR(20) DEFAULT 'Scheduled',
          FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE
        )
      `;
      console.log('✅ instances table ready');
    } catch (e) {
      console.log('⚠️  instances table: ' + e.message);
    }

    // Create tickets table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS tickets (
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
      console.log('✅ tickets table ready');
    } catch (e) {
      console.log('⚠️  tickets table: ' + e.message);
    }

    // Create admins table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admins (
          admin_id BIGSERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ admins table ready');
    } catch (e) {
      console.log('⚠️  admins table: ' + e.message);
    }

    // Create super_admins table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS super_admins (
          super_admin_id BIGSERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ super_admins table ready');
    } catch (e) {
      console.log('⚠️  super_admins table: ' + e.message);
    }

    // Create deleted_tickets table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS deleted_tickets (
          ticket_id BIGINT PRIMARY KEY,
          seat_number VARCHAR(10) NOT NULL,
          user_id BIGINT NOT NULL,
          instance_id BIGINT NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone_no VARCHAR(20) NOT NULL,
          booking_time TIMESTAMPTZ,
          deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ deleted_tickets table ready');
    } catch (e) {
      console.log('⚠️  deleted_tickets table: ' + e.message);
    }

    // Create deleted_flight_instances table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS deleted_flight_instances (
          instance_id BIGINT PRIMARY KEY,
          flight_no VARCHAR(20) NOT NULL,
          airline_name VARCHAR(255) NOT NULL,
          route_id BIGINT NOT NULL,
          departure_time TIMESTAMPTZ NOT NULL,
          arrival_time TIMESTAMPTZ NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ deleted_flight_instances table ready');
    } catch (e) {
      console.log('⚠️  deleted_flight_instances table: ' + e.message);
    }

    // Create deleted_flight_routes table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS deleted_flight_routes (
          route_id BIGINT PRIMARY KEY,
          departure_airport_id VARCHAR(10) NOT NULL,
          arrival_airport_id VARCHAR(10) NOT NULL,
          deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ deleted_flight_routes table ready');
    } catch (e) {
      console.log('⚠️  deleted_flight_routes table: ' + e.message);
    }

    // Create deleted_flights table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS deleted_flights (
          flight_no INTEGER NOT NULL,
          airline_name VARCHAR(255) NOT NULL,
          max_seat INTEGER NOT NULL,
          deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (flight_no, airline_name)
        )
      `;
      console.log('✅ deleted_flights table ready');
    } catch (e) {
      console.log('⚠️  deleted_flights table: ' + e.message);
    }

    // Create deleted_airlines table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS deleted_airlines (
          airline_name VARCHAR(255) PRIMARY KEY,
          deleted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ deleted_airlines table ready');
    } catch (e) {
      console.log('⚠️  deleted_airlines table: ' + e.message);
    }

    console.log('\n✅ Schema initialization completed!\n');
  } catch (error) {
    console.error('❌ Schema initialization failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run schema initialization
initializeSchema().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
