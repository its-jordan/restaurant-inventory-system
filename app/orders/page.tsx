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

const API_PATH = '/api/inventory';

export default function OrdersPage() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);

  React.useEffect(() => {
    async function loadInventory() {
      try {
        const response = await fetch(API_PATH);
        const data = (await response.json()) as Array<
          Omit<InventoryItem, 'lastUpdated'> & { lastUpdated: string }
        >;

        setInventory(
          data.map((item) => ({
            ...item,
            lastUpdated: new Date(item.lastUpdated),
          })),
        );
      } catch (error) {
        console.error('Failed to load order inventory:', error);
      }
    }

    loadInventory();
  }, []);

  const orderItems = inventory.filter((item) => item.quantity < item.par);

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-4'>Orders</h1>
      <p className='mb-6 text-sm text-gray-500'>
        Items that need to be reordered because current quantity is below par.
      </p>

      {orderItems.length === 0 ? (
        <div className='rounded-lg border border-green-200 bg-green-50 p-6 text-green-800'>
          All items are at or above par.
        </div>
      ) : (
        <div className='reorder-grid'>
          {orderItems.map((item) => (
            <div key={item.id} className='reorder-item-card'>
              <div className='reorder-item-header'>
                <div>
                  <h2 className='text-lg font-semibold'>
                    {item.name
                      .replaceAll('-', ' ')
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </h2>
                  <p className='text-sm text-gray-500'>
                    {item.category
                      .replaceAll('-', ' ')
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </p>
                </div>
                <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700'>
                  Reorder
                </span>
              </div>

              <div className='space-y-2 text-sm text-gray-700'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Quantity</span>
                  <span>
                    {item.quantity}{' '}
                    {item.unit
                      .replaceAll('-', ' ')
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Par</span>
                  <span>{item.par}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Need to order</span>
                  <span>{item.par - item.quantity}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>Location</span>
                  <span>
                    {item.location
                      .replaceAll('-', ' ')
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ')}
                  </span>
                </div>
                <div className='text-xs text-gray-400'>
                  Last updated: {item.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
