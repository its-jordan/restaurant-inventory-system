import { integer, text, real, sqliteTable } from 'drizzle-orm/sqlite-core';

export const inventoryTable = sqliteTable('inventory', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  par: integer('par').notNull(),
  unit: text('unit').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  lastUpdated: text('last_updated').notNull(),
});

export const zonesTable = sqliteTable('zones', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  top: real('top').notNull(),
  left: real('left').notNull(),
  width: real('width').notNull(),
  height: real('height').notNull(),
});

export type InventoryItem = typeof inventoryTable.$inferSelect;
export type InsertInventoryItem = typeof inventoryTable.$inferInsert;
export type MapZone = typeof zonesTable.$inferSelect;
export type InsertMapZone = typeof zonesTable.$inferInsert;
