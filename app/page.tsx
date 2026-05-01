'use client';

import React from 'react';
import { ItemCard } from '@/components/item';

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

export default function Home() {
  const [items, setItems] = React.useState<InventoryItem[]>([]);

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

  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [locationFilter, setLocationFilter] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = React.useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const locations = React.useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.location)))],
    [items],
  );

  const filteredItems = React.useMemo(
    () =>
      items.filter((item) => {
        const categoryMatch =
          categoryFilter === 'All' || item.category === categoryFilter;
        const locationMatch =
          locationFilter === 'All' || item.location === locationFilter;
        const searchMatch =
          searchQuery === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && locationMatch && searchMatch;
      }),
    [items, categoryFilter, locationFilter, searchQuery],
  );

  const handleEdit = async (updatedItem: InventoryItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
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

      if (response.ok) {
        const saved = await response.json();
        setItems((current) =>
          current.map((item) =>
            item.id === saved.id
              ? { ...saved, lastUpdated: new Date(saved.lastUpdated) }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
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

  const [newItem, setNewItem] = React.useState<Partial<InventoryItem>>({
    name: '',
    quantity: 0,
    par: 0,
    unit: '',
    category: '',
    location: '',
  });

  const handleNewItemChange = (
    field: keyof Omit<InventoryItem, 'id' | 'lastUpdated'>,
    value: string,
  ) => {
    setNewItem((current) => ({
      ...current,
      [field]: field === 'quantity' || field === 'par' ? Number(value) : value,
    }));
  };

  const handleAddNewItem = async () => {
    if (
      !newItem.name ||
      !newItem.unit ||
      !newItem.category ||
      !newItem.location ||
      newItem.quantity === undefined ||
      newItem.par === undefined
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

  return (
    <div className='page-content'>
      <h1 className='page-header'>Inventory</h1>
      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div className='flex-1'>
          <p className='text-sm text-gray-500'>
            Search and filter by category and location
          </p>
          <div className='mt-2 flex flex-col gap-3'>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <label className='flex flex-col gap-1 text-sm'>
                Category
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className='rounded border px-3 py-2 text-sm'>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category
                        .replaceAll('-', ' ')
                        .toLowerCase()
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className='flex flex-col gap-1 text-sm'>
                Location
                <select
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  className='rounded border px-3 py-2 text-sm'>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location
                        .replaceAll('-', ' ')
                        .toLowerCase()
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className='flex flex-col gap-1 text-sm w-full mt-5'>
                <input
                  type='text'
                  placeholder='Search items by name...'
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className='rounded border px-3 py-2 text-sm w-full'
                />
              </label>
            </div>
          </div>
        </div>

        <div className='rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700'>
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='grid col-span-1 md:col-span-2 lg:col-span-3'>
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
                onChange={(event) =>
                  handleNewItemChange('par', event.target.value)
                }
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
                onClick={handleAddNewItem}
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
        </div>

        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
