import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { inventoryTable, zonesTable } from './schema';

const sqlite = new Database('inventory.db');
const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    par INTEGER NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    last_updated TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    top REAL NOT NULL,
    left REAL NOT NULL,
    width REAL NOT NULL,
    height REAL NOT NULL
  );
`);

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

// Seed zones data
const zonesData = [
  {
    id: 'dry-storage-l',
    name: 'Dry Storage Left',
    color: 'bg-yellow-100',
    top: 10,
    left: 10,
    width: 30,
    height: 35,
  },
  {
    id: 'dry-storage-r',
    name: 'Dry Storage Right',
    color: 'bg-yellow-100',
    top: 10,
    left: 10,
    width: 30,
    height: 35,
  },
  {
    id: 'janitorial-spices',
    name: 'Janitorial & Spices',
    color: 'bg-yellow-100',
    top: 10,
    left: 10,
    width: 30,
    height: 35,
  },
  {
    id: 'walk-in-left',
    name: 'Walk In Left',
    color: 'bg-blue-100',
    top: 10,
    left: 50,
    width: 40,
    height: 35,
  },
  {
    id: 'walk-in-right',
    name: 'Walk In Right',
    color: 'bg-green-100',
    top: 10,
    left: 50,
    width: 40,
    height: 35,
  },
  {
    id: 'fish-cooler',
    name: 'Fish Cooler',
    color: 'bg-green-100',
    top: 10,
    left: 50,
    width: 40,
    height: 35,
  },
  {
    id: 'freezer',
    name: 'Freezer',
    color: 'bg-cyan-100',
    top: 50,
    left: 50,
    width: 40,
    height: 35,
  },
];

// Clear existing data
sqlite.exec('DELETE FROM inventory; DELETE FROM zones;');

// Insert inventory data
const inventoryInsert = sqlite.prepare(`
  INSERT INTO inventory (id, name, quantity, par, unit, category, location, last_updated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const item of inventoryData) {
  inventoryInsert.run(
    item.id,
    item.name,
    item.quantity,
    item.par,
    item.unit,
    item.category,
    item.location,
    item.lastUpdated,
  );
}

// Insert zones data
const zonesInsert = sqlite.prepare(`
  INSERT INTO zones (id, name, color, top, left, width, height)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const zone of zonesData) {
  zonesInsert.run(
    zone.id,
    zone.name,
    zone.color,
    zone.top,
    zone.left,
    zone.width,
    zone.height,
  );
}

console.log('✅ Database seeded successfully!');
sqlite.close();
