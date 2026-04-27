# Kitchen Inventory System

A Next.js-based kitchen inventory management system with Drizzle ORM database integration.

## Database Setup

This project uses **Drizzle ORM** with **SQLite** for data persistence.

### First-time Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Seed the database** with initial inventory and zone data:

   ```bash
   npm run seed
   ```

   This will create the SQLite database (`inventory.db`) and populate it with:
   - 6 default inventory items
   - 7 default kitchen zones

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Database Files

- `inventory.db` - SQLite database (auto-created, excluded from git)
- `lib/schema.ts` - Drizzle schema definitions
- `lib/db.ts` - Database client configuration
- `lib/seed.ts` - Database seeding script

### API Endpoints

#### Inventory

- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create a new item
- `PUT /api/inventory` - Update an item
- `DELETE /api/inventory?id={id}` - Delete an item by ID

#### Zones

- `GET /api/zones` - Get all zones
- `PUT /api/zones` - Update zones (bulk update)

### Data Migration

The project was migrated from JSON files (`data/inventory.json`, `data/zones.json`) to a SQLite database using Drizzle ORM. All data is now persisted in the database.

To re-seed the database at any time, run:

```bash
npm run seed
```

## Features

- ✅ Inventory management with CRUD operations
- ✅ Kitchen zone mapping with drag-drop support
- ✅ Zone resizing and renaming
- ✅ Bulk inventory management
- ✅ Order tracking (items below par)
- ✅ Dark mode styling
- ✅ Persistent data storage with Drizzle ORM
