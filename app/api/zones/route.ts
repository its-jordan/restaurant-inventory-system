import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'zones.json');
    const data = await readFile(filePath, 'utf-8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read zones:', error);
    return Response.json({ error: 'Failed to load zones' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const zones = await request.json();
    const filePath = join(process.cwd(), 'data', 'zones.json');
    await writeFile(filePath, JSON.stringify(zones, null, 2));
    return Response.json(zones);
  } catch (error) {
    console.error('Failed to update zones:', error);
    return Response.json({ error: 'Failed to update zones' }, { status: 500 });
  }
}
