'use client';

import React from 'react';
import { RiDeleteBin7Line } from 'react-icons/ri';

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

export default function BulkManagePage() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = React.useState<
    Omit<InventoryItem, 'id' | 'lastUpdated'>
  >({
    name: '',
    quantity: 0,
    par: 0,
    unit: '',
    category: '',
    location: '',
  });
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{
    field: keyof InventoryItem | null;
    direction: 'asc' | 'desc' | null;
  }>({ field: null, direction: null });

  const SORT_KEY = 'bulkManageSortConfig';

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
      } finally {
        setIsLoaded(true);
      }
    }

    loadItems();
  }, []);

  React.useEffect(() => {
    const savedSort = window.localStorage.getItem(SORT_KEY);
    if (savedSort) {
      try {
        const parsed = JSON.parse(savedSort);
        if (
          parsed &&
          typeof parsed === 'object' &&
          (parsed.field === null ||
            [
              'name',
              'quantity',
              'par',
              'unit',
              'category',
              'location',
              'lastUpdated',
            ].includes(parsed.field)) &&
          (parsed.direction === null ||
            parsed.direction === 'asc' ||
            parsed.direction === 'desc')
        ) {
          setSortConfig(parsed);
        }
      } catch {
        // Ignore invalid saved sort config
      }
    }
  }, []);

  const setItemValue = async (
    id: number,
    field: keyof Omit<InventoryItem, 'id' | 'lastUpdated'>,
    value: string,
  ) => {
    const existingItem = items.find((item) => item.id === id);
    if (!existingItem) return;

    const updatedItem: InventoryItem = {
      ...existingItem,
      [field]: field === 'quantity' || field === 'par' ? Number(value) : value,
      lastUpdated: new Date(),
    };

    setItems((current) =>
      current.map((item) => (item.id === id ? updatedItem : item)),
    );

    try {
      const response = await fetch(API_PATH, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedItem,
          lastUpdated: updatedItem.lastUpdated.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }
    } catch (error) {
      console.error('Failed to save inventory change:', error);
    }
  };

  const handleNewItemChange = (
    field: keyof Omit<InventoryItem, 'id' | 'lastUpdated'>,
    value: string,
  ) => {
    setNewItem((current) => ({
      ...current,
      [field]: field === 'quantity' || field === 'par' ? Number(value) : value,
    }));
  };

  const handleDelete = async (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));

    try {
      await fetch(`${API_PATH}?id=${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.unit ||
      !newItem.category ||
      !newItem.location
    ) {
      return;
    }

    try {
      const response = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          quantity: newItem.quantity,
          par: newItem.par,
          unit: newItem.unit,
          category: newItem.category,
          location: newItem.location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const saved = await response.json();
      setItems((current) => [
        { ...saved, lastUpdated: new Date(saved.lastUpdated) },
        ...current,
      ]);
      setNewItem({
        name: '',
        quantity: 0,
        par: 0,
        unit: '',
        category: '',
        location: '',
      });
    } catch (error) {
      console.error('Failed to add new item:', error);
    }
  };

  const handleSort = (field: keyof InventoryItem) => {
    setSortConfig((current) => {
      let direction: 'asc' | 'desc' = 'asc';

      if (current.field === field) {
        if (current.direction === 'asc') {
          direction = 'desc';
        } else if (current.direction === 'desc') {
          direction = 'asc';
        }
      }

      const newConfig = { field, direction };
      window.localStorage.setItem(SORT_KEY, JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const sortedItems = React.useMemo(() => {
    if (!sortConfig.field || !sortConfig.direction) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.field!];
      const bValue = b[sortConfig.field!];

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sortConfig]);

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-2'>Bulk Manage</h1>
      <p className='mb-6 text-sm text-gray-500'>
        Edit inventory in a compact table and add new entries quickly.
      </p>

      <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='grid gap-3 lg:grid-cols-7'>
          <input
            value={newItem.name}
            onChange={(event) =>
              handleNewItemChange(
                'name',
                event.target.value.replaceAll(' ', '-').toLowerCase(),
              )
            }
            placeholder='Name'
            className='bulk-item-input'
          />
          <input
            type='number'
            min='0'
            value={newItem.quantity}
            onChange={(event) =>
              handleNewItemChange('quantity', event.target.value)
            }
            placeholder='Qty'
            className='bulk-item-input'
          />
          <input
            type='number'
            min='0'
            value={newItem.par}
            onChange={(event) => handleNewItemChange('par', event.target.value)}
            placeholder='Par'
            className='bulk-item-input'
          />
          <input
            value={newItem.unit}
            onChange={(event) =>
              handleNewItemChange(
                'unit',
                event.target.value.replaceAll(' ', '-').toLowerCase(),
              )
            }
            placeholder='Unit'
            className='bulk-item-input'
          />
          <input
            value={newItem.category}
            onChange={(event) =>
              handleNewItemChange(
                'category',
                event.target.value.replaceAll(' ', '-').toLowerCase(),
              )
            }
            placeholder='Category'
            className='bulk-item-input'
          />
          <input
            value={newItem.location}
            onChange={(event) =>
              handleNewItemChange(
                'location',
                event.target.value.replaceAll(' ', '-').toLowerCase(),
              )
            }
            placeholder='Location'
            className='bulk-item-input'
          />
          <button
            type='button'
            onClick={handleAddItem}
            disabled={
              !newItem.name ||
              !newItem.unit ||
              !newItem.category ||
              !newItem.location
            }
            className='add-item-bulk'>
            Add Item
          </button>
        </div>
      </div>

      <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-600'>
            <tr>
              <th className='table-header' onClick={() => handleSort('name')}>
                Name{' '}
                {sortConfig.field === 'name' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th
                className='table-header'
                onClick={() => handleSort('quantity')}>
                Quantity{' '}
                {sortConfig.field === 'quantity' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th className='table-header' onClick={() => handleSort('par')}>
                Par{' '}
                {sortConfig.field === 'par' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th className='table-header' onClick={() => handleSort('unit')}>
                Unit{' '}
                {sortConfig.field === 'unit' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th
                className='table-header'
                onClick={() => handleSort('category')}>
                Category{' '}
                {sortConfig.field === 'category' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th
                className='table-header'
                onClick={() => handleSort('location')}>
                Location{' '}
                {sortConfig.field === 'location' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th
                className='table-header'
                onClick={() => handleSort('lastUpdated')}>
                Updated{' '}
                {sortConfig.field === 'lastUpdated' &&
                  (sortConfig.direction === 'asc'
                    ? '↑'
                    : sortConfig.direction === 'desc'
                      ? '↓'
                      : '')}
              </th>
              <th className='table-header'></th>
            </tr>
          </thead>
          <tbody className=''>
            {sortedItems.map((item) => (
              <tr className='table-item' key={item.id}>
                <td className='bulk-item'>
                  <input
                    value={item.name}
                    onChange={(event) =>
                      setItemValue(
                        item.id,
                        'name',
                        event.target.value.replaceAll(' ', '-').toLowerCase(),
                      )
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='bulk-item'>
                  <input
                    type='number'
                    min='0'
                    value={item.quantity}
                    onChange={(event) =>
                      setItemValue(item.id, 'quantity', event.target.value)
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='bulk-item'>
                  <input
                    type='number'
                    min='0'
                    value={item.par}
                    onChange={(event) =>
                      setItemValue(item.id, 'par', event.target.value)
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='bulk-item'>
                  <input
                    value={item.unit}
                    onChange={(event) =>
                      setItemValue(
                        item.id,
                        'unit',
                        event.target.value.replaceAll(' ', '-').toLowerCase(),
                      )
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='bulk-item'>
                  <input
                    value={item.category}
                    onChange={(event) =>
                      setItemValue(
                        item.id,
                        'category',
                        event.target.value.replaceAll(' ', '-').toLowerCase(),
                      )
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='bulk-item'>
                  <input
                    value={item.location}
                    onChange={(event) =>
                      setItemValue(
                        item.id,
                        'location',
                        event.target.value.replaceAll(' ', '-').toLowerCase(),
                      )
                    }
                    className='bulk-item-input'
                  />
                </td>
                <td className='whitespace-nowrap bulk-item last-updated'>
                  {item.lastUpdated.toLocaleDateString()}
                </td>
                <td className='bulk-item text-right'>
                  <button
                    onClick={() => handleDelete(item.id)}
                    type='button'
                    className='bin-icon'>
                    <RiDeleteBin7Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
