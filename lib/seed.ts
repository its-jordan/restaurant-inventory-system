import { db } from './db';
import { inventoryTable } from './schema';
import { sql } from 'drizzle-orm';

// Create tables if they don't exist
async function createTables() {
  try {
    // Clear existing
    console.log('📋 Creating tables...');

    // Create inventory table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        par INTEGER NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        last_updated TEXT NOT NULL
      )
    `);

    // Create zones table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS zones (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        top REAL NOT NULL,
        left REAL NOT NULL,
        width REAL NOT NULL,
        height REAL NOT NULL
      )
    `);

    console.log('✅ Tables created or already exist');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('⚠️  Could not create tables:', errorMessage);
    // Continue anyway - tables might already exist
  }
}

// Seed inventory data
const inventoryData = [
  {
    id: 1,
    name: 'Olive Oil',
    quantity: 5,
    par: 10,
    unit: 'bottles',
    category: 'Pantry',
    location: 'Dry Storage',
    lastUpdated: '2026-04-20',
  },
  {
    id: 2,
    name: 'Iodized Salt',
    quantity: 2,
    par: 10,
    unit: 'kg',
    category: 'Spices',
    location: 'Dry Storage',
    lastUpdated: '2026-04-22',
  },
  {
    id: 3,
    name: 'Garlic',
    quantity: 12,
    par: 10,
    unit: 'cloves',
    category: 'Produce',
    location: 'Walk In',
    lastUpdated: '2026-04-24',
  },
  {
    id: 4,
    name: 'Penne Pasta',
    quantity: 8,
    par: 10,
    unit: 'boxes',
    category: 'Pantry',
    location: 'Dry Storage',
    lastUpdated: '2026-04-23',
  },
  {
    id: 5,
    name: 'Tomatoes',
    quantity: 15,
    par: 10,
    unit: 'cans',
    category: 'Produce',
    location: 'Walk In',
    lastUpdated: '2026-04-18',
  },
  {
    id: 6,
    name: 'Fresh Basil',
    quantity: 1,
    par: 10,
    unit: 'bunch',
    category: 'Herbs',
    location: 'Walk In',
    lastUpdated: '2026-04-21',
  },
];

// Clear existing data and seed database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create tables first
    await createTables();

    // Clear existing data
    try {
      await db.delete(inventoryTable);
      console.log('🗑️  Cleared existing data');
    } catch (error) {
      console.log('ℹ️  No existing data to clear');
    }

    // Insert inventory data
    for (const item of inventoryData) {
      await db.insert(inventoryTable).values(item);
    }
    console.log(`✅ Seeded ${inventoryData.length} inventory items`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error seeding database:', errorMessage);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
