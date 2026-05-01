'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=''>
      <div className=''>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='site-logo'>
            <div>Little Bar</div>
            <div>Inventory Management</div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2'
            aria-label='Toggle menu'>
            ☰
          </button>

          <ul
            className={`md:flex gap-6 ${isOpen ? 'block' : 'hidden'} absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0`}>
            <li>
              <Link
                href='/orders'
                className='text-gray-700 hover:text-gray-900'>
                Orders
              </Link>
            </li>
            <li>
              <Link
                href='/bulk-manage'
                className='text-gray-700 hover:text-gray-900'>
                Bulk Manage
              </Link>
            </li>
            <li>
              <Link
                href='/settings'
                className='text-gray-700 hover:text-gray-900'>
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
