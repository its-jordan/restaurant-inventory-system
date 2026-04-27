import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'inventory.json');

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  par: number;
  unit: string;
  category: string;
  location: string;
  lastUpdated: string;
};

async function readInventory(): Promise<InventoryItem[]> {
  const file = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(file) as InventoryItem[];
}

async function writeInventory(items: InventoryItem[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function GET() {
  const items = await readInventory();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const items = await readInventory();

  const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
  const newItem: InventoryItem = {
    id: nextId,
    name: body.name ?? '',
    quantity: Number(body.quantity) || 0,
    par: Number(body.par) || 0,
    unit: body.unit ?? '',
    category: body.category ?? '',
    location: body.location ?? '',
    lastUpdated: new Date().toISOString(),
  };

  items.unshift(newItem);
  await writeInventory(items);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const items = await readInventory();
  const index = items.findIndex((item) => item.id === Number(body.id));

  if (index === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const updatedItem: InventoryItem = {
    ...items[index],
    ...body,
    quantity: Number(body.quantity) || 0,
    par: Number(body.par) || 0,
    lastUpdated: new Date().toISOString(),
  };

  items[index] = updatedItem;
  await writeInventory(items);
  return NextResponse.json(updatedItem);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const items = await readInventory();
  const filtered = items.filter((item) => item.id !== Number(body.id));

  if (filtered.length === items.length) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  await writeInventory(filtered);
  return NextResponse.json({ success: true });
}
