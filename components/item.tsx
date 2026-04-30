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

interface ItemCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<InventoryItem>(item);

  React.useEffect(() => {
    setDraft(item);
  }, [item]);

  const startEditing = () => {
    setDraft(item);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(item);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!onEdit) return;

    onEdit({
      ...draft,
      lastUpdated: new Date(),
    });
    setIsEditing(false);
  };

  const updateDraft = (
    field: 'name' | 'unit' | 'category' | 'location' | 'quantity' | 'par',
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: field === 'quantity' || field === 'par' ? Number(value) : value,
    }));
  };

  return (
    <div
      className={
        'item-card' + (item.location !== null ? ' ' + item.location : '')
      }>
      <div className='flex justify-between items-start mb-3'>
        <div className='space-y-1'>
          {isEditing ? (
            <input
              value={draft.name}
              onChange={(event) =>
                updateDraft(
                  'name',
                  event.target.value.replaceAll(' ', '-').toLowerCase(),
                )
              }
              className='w-full rounded border px-2 py-1 text-lg font-semibold'
            />
          ) : (
            <h3 className='font-semibold text-lg'>
              {item.name
                .replaceAll('-', ' ')
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h3>
          )}
          {isEditing ? (
            <input
              value={draft.category}
              onChange={(event) => updateDraft('category', event.target.value)}
              className='w-full rounded border px-2 py-1 text-sm text-gray-700'
            />
          ) : (
            <span className='text-sm text-gray-500'>{item.category}</span>
          )}
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold flex flex-row flex-nowrap gap-2 w-max'>
            {isEditing ? (
              <>
                <input
                  type='number'
                  min='0'
                  value={draft.quantity}
                  onChange={(event) =>
                    updateDraft('quantity', event.target.value)
                  }
                  className='w-16 rounded border px-2 py-1 text-right text-xl'
                />
                <div className='opacity-25'>/</div>
                <input
                  type='number'
                  min='0'
                  value={draft.par}
                  onChange={(event) => updateDraft('par', event.target.value)}
                  className='w-16 rounded border px-2 py-1 text-right text-xl'
                />
              </>
            ) : (
              <>
                <div>{item.quantity}</div>
                <div className='opacity-25'>/</div>
                <div
                  className={
                    item.quantity < item.par ? 'text-red-500' : 'text-green-500'
                  }>
                  {item.par}
                </div>
              </>
            )}
          </div>
          {isEditing ? (
            <input
              value={draft.unit}
              onChange={(event) =>
                updateDraft(
                  'unit',
                  event.target.value.replaceAll(' ', '-').toLowerCase(),
                )
              }
              className='mt-2 w-full rounded border px-2 py-1 text-sm text-gray-700'
            />
          ) : (
            <div className='text-sm text-gray-600'>
              {item.unit
                .replaceAll('-', ' ')
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </div>
          )}
        </div>
      </div>

      <div className='space-y-2 mb-3'>
        <div className='flex items-center justify-between text-xs text-gray-400'>
          <div>Updated: {item.lastUpdated.toLocaleDateString()}</div>
          {isEditing ? (
            <input
              value={draft.location}
              onChange={(event) =>
                updateDraft(
                  'location',
                  event.target.value.replaceAll(' ', '-').toLowerCase(),
                )
              }
              className='w-full rounded border px-2 py-1 text-sm text-gray-700'
            />
          ) : (
            <div className='flex flex-row flex-nowrap justify-start'>
              <div className='text-xs text-gray-400'>
                {item.location
                  .replaceAll('-', ' ')
                  .toLowerCase()
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='flex gap-2'>
        {isEditing ? (
          <>
            <button
              onClick={saveChanges}
              className='flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600'>
              Save
            </button>
            <button
              onClick={cancelEditing}
              className='flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300'>
              Cancel
            </button>
          </>
        ) : (
          <>
            {onEdit && (
              <button
                onClick={startEditing}
                className='flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'>
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                className='flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600'>
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
