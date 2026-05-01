// export default function AddItem() {
//   return (
//     <div className='grid col-span-1 md:col-span-2 lg:col-span-3'>
//       <div className='mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
//         <div className='grid gap-3 lg:grid-cols-7'>
//           <input
//             value={newItem.name}
//             onChange={(event) =>
//               handleNewItemChange(
//                 'name',
//                 event.target.value.replaceAll(' ', '-').toLowerCase(),
//               )
//             }
//             placeholder='Name'
//             className='bulk-item-input'
//           />
//           <input
//             type='number'
//             min='0'
//             value={newItem.quantity}
//             onChange={(event) =>
//               handleNewItemChange('quantity', event.target.value)
//             }
//             placeholder='Qty'
//             className='bulk-item-input'
//           />
//           <input
//             type='number'
//             min='0'
//             value={newItem.par}
//             onChange={(event) => handleNewItemChange('par', event.target.value)}
//             placeholder='Par'
//             className='bulk-item-input'
//           />
//           <input
//             value={newItem.unit}
//             onChange={(event) =>
//               handleNewItemChange(
//                 'unit',
//                 event.target.value.replaceAll(' ', '-').toLowerCase(),
//               )
//             }
//             placeholder='Unit'
//             className='bulk-item-input'
//           />
//           <input
//             value={newItem.category}
//             onChange={(event) =>
//               handleNewItemChange(
//                 'category',
//                 event.target.value.replaceAll(' ', '-').toLowerCase(),
//               )
//             }
//             placeholder='Category'
//             className='bulk-item-input'
//           />
//           <input
//             value={newItem.location}
//             onChange={(event) =>
//               handleNewItemChange(
//                 'location',
//                 event.target.value.replaceAll(' ', '-').toLowerCase(),
//               )
//             }
//             placeholder='Location'
//             className='bulk-item-input'
//           />
//           <button
//             type='button'
//             onClick={handleAddNewItem}
//             disabled={
//               !newItem.name ||
//               !newItem.unit ||
//               !newItem.category ||
//               !newItem.location
//             }
//             className='add-item-bulk'>
//             Add Item
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
