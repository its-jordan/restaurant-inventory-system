'use client';

import React from 'react';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  par: number;
  unit: string;
  category: string;
  location: string;
  lastUpdated: Date;
}

interface MapZone {
  id: string;
  name: string;
  color: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ItemPlacement {
  itemId: number;
  zoneId: string;
  x: number;
  y: number;
}

const API_PATH = '/api/inventory';
const ZONES_API_PATH = '/api/zones';
const PLACEMENTS_KEY = 'itemPlacements';

const defaultZones: MapZone[] = [];

export default function MapPage() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [zones, setZones] = React.useState<MapZone[]>(defaultZones);
  const [placements, setPlacements] = React.useState<ItemPlacement[]>([]);
  const [draggedItem, setDraggedItem] = React.useState<InventoryItem | null>(
    null,
  );

  React.useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(API_PATH);
        const data = (await response.json()) as Array<
          Omit<InventoryItem, 'lastUpdated'> & { lastUpdated: string }
        >;

        setItems(
          data.map((item) => ({
            ...item,
            lastUpdated: new Date(item.lastUpdated),
          })),
        );
      } catch (error) {
        console.error('Failed to load inventory:', error);
      }
    }

    loadItems();
  }, []);

  React.useEffect(() => {
    async function loadZones() {
      try {
        const response = await fetch(ZONES_API_PATH);
        const data = (await response.json()) as MapZone[];
        setZones(data);
      } catch (error) {
        console.error('Failed to load zones:', error);
      }
    }

    loadZones();
  }, []);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(PLACEMENTS_KEY);
    if (saved) {
      try {
        setPlacements(JSON.parse(saved));
      } catch {
        setPlacements([]);
      }
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  }, [placements]);

  const getItemsInZone = (zoneId: string) => {
    return placements
      .filter((p) => p.zoneId === zoneId)
      .map((p) => items.find((i) => i.id === p.itemId))
      .filter(Boolean) as InventoryItem[];
  };

  const handleDragStart = (item: InventoryItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnZone = (zoneId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove existing placement for this item
    setPlacements((current) =>
      current.filter((p) => p.itemId !== draggedItem.id),
    );

    // Add new placement
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setPlacements((current) => [
        ...current,
        {
          itemId: draggedItem.id,
          zoneId,
          x: Math.max(0, Math.min(x, rect.width - 50)),
          y: Math.max(0, Math.min(y, rect.height - 40)),
        },
      ]);
    }

    setDraggedItem(null);
  };

  const handleRemoveFromZone = (itemId: number) => {
    setPlacements((current) => current.filter((p) => p.itemId !== itemId));
  };

  const unplacedItems = items.filter(
    (item) => !placements.find((p) => p.itemId === item.id),
  );

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-2'>Kitchen Map</h1>
      <p className='mb-6 text-sm text-gray-500'>
        Drag items from the list below onto the map to place them in zones.
      </p>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Map */}
        <div className='lg:col-span-3'>
          <div
            className='relative w-full bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden'
            style={{ aspectRatio: '16/9' }}>
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute border-2 border-gray-400 rounded overflow-hidden ${zone.color} transition-opacity hover:opacity-80`}
                style={{
                  top: `${zone.top}%`,
                  left: `${zone.left}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnZone(zone.id, e)}>
                <div className='absolute top-0 left-0 p-2 z-10'>
                  <div className='font-semibold text-sm text-gray-700'>
                    {zone.name}
                  </div>
                </div>
                <div className='relative w-full h-full'>
                  {getItemsInZone(zone.id).map((item) => {
                    const placement = placements.find(
                      (p) => p.itemId === item.id,
                    );
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item)}
                        className='absolute bg-white border border-gray-300 rounded px-2 py-1 text-xs flex items-center justify-between gap-2 cursor-move hover:shadow-md'
                        style={{
                          left: `${placement?.x ?? 0}px`,
                          top: `${placement?.y ?? 0}px`,
                          width: 'auto',
                          whiteSpace: 'nowrap',
                        }}>
                        <span className='font-medium truncate max-w-xs'>
                          {item.name}
                        </span>
                        <button
                          onClick={() => handleRemoveFromZone(item.id)}
                          className='text-red-500 hover:text-red-700 text-xs font-bold ml-1 shrink-0'>
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className='lg:col-span-1'>
          <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-h-screen overflow-y-auto'>
            <h2 className='font-bold text-lg mb-3'>Items to Place</h2>
            <p className='text-xs text-gray-500 mb-4'>
              Drag items to zones on the left
            </p>
            <div className='space-y-2'>
              {unplacedItems.length === 0 ? (
                <p className='text-sm text-gray-500 italic'>
                  All items placed! Drag to reposition.
                </p>
              ) : (
                unplacedItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className='bg-gray-50 border border-gray-300 rounded p-3 cursor-move hover:shadow-md transition-shadow'>
                    <div className='font-semibold text-sm'>{item.name}</div>
                    <div className='text-xs text-gray-600'>
                      {item.quantity} {item.unit}
                    </div>
                    <div className='text-xs text-gray-500'>{item.category}</div>
                  </div>
                ))
              )}
            </div>

            <hr className='my-4' />

            <h3 className='font-semibold text-sm mb-2'>Placed Items</h3>
            <div className='space-y-1'>
              {placements.length === 0 ? (
                <p className='text-xs text-gray-500 italic'>
                  No items placed yet
                </p>
              ) : (
                placements.map((placement) => {
                  const item = items.find((i) => i.id === placement.itemId);
                  const zone = zones.find((z) => z.id === placement.zoneId);
                  if (!item || !zone) return null;

                  return (
                    <div
                      key={placement.itemId}
                      className='bg-blue-50 border border-blue-200 rounded p-2'>
                      <div className='font-semibold text-xs'>{item.name}</div>
                      <div className='text-xs text-gray-600'>{zone.name}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
