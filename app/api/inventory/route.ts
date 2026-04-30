import { db } from '@/lib/db';
import { inventoryTable, type InventoryItem } from '@/lib/schema';
import { eq, max } from 'drizzle-orm';

export async function GET() {
  try {
    const items = await db.select().from(inventoryTable);
    return Response.json(items);
  } catch (error) {
    console.error('Failed to load inventory:', error);
    return Response.json(
      { error: 'Failed to load inventory' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<
      InventoryItem,
      'id' | 'lastUpdated'
    > & { lastUpdated?: string };

    // Get the next ID

    const maxIdResult = await db
      .select({
        value: max(inventoryTable.id),
      })
      .from(inventoryTable);

    const nextId = (maxIdResult[0]?.value ?? 0) + 1;

    const now = new Date().toISOString().split('T')[0];

    const newItem: InventoryItem = {
      id: nextId,
      name: body.name,
      quantity: body.quantity,
      par: body.par,
      unit: body.unit,
      category: body.category,
      location: body.location,
      lastUpdated: body.lastUpdated || now,
    };

    await db.insert(inventoryTable).values(newItem);
    return Response.json(newItem, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to create inventory item:', errorMessage);
    console.error('TURSO_CONNECTION_URL:', process.env.TURSO_CONNECTION_URL);
    return Response.json(
      {
        error: 'Failed to create inventory item',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as InventoryItem;
    const now = new Date().toISOString().split('T')[0];

    const updatedItem: InventoryItem = {
      ...body,
      lastUpdated: now,
    };

    await db
      .update(inventoryTable)
      .set(updatedItem)
      .where(eq(inventoryTable.id, body.id));

    return Response.json(updatedItem);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to update inventory item:', errorMessage);
    return Response.json(
      {
        error: 'Failed to update inventory item',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID required' }, { status: 400 });
    }

    await db.delete(inventoryTable).where(eq(inventoryTable.id, parseInt(id)));

    return Response.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to delete inventory item:', errorMessage);
    return Response.json(
      {
        error: 'Failed to delete inventory item',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
