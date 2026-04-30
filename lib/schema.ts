import { integer, text, real, pgTable, serial } from 'drizzle-orm/pg-core';

export const inventoryTable = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  par: integer('par').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  lastUpdated: text('last_updated').notNull(),
});

export type InventoryItem = typeof inventoryTable.$inferSelect;
export type InsertInventoryItem = typeof inventoryTable.$inferInsert;
