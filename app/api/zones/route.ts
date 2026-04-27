import { db } from '@/lib/db';
import { zonesTable, type MapZone } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const zones = await db.select().from(zonesTable);
    return Response.json(zones);
  } catch (error) {
    console.error('Failed to load zones:', error);
    return Response.json({ error: 'Failed to load zones' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const zones = (await request.json()) as MapZone[];

    // Update all zones
    for (const zone of zones) {
      await db.update(zonesTable).set(zone).where(eq(zonesTable.id, zone.id));
    }

    return Response.json(zones);
  } catch (error) {
    console.error('Failed to update zones:', error);
    return Response.json({ error: 'Failed to update zones' }, { status: 500 });
  }
}
