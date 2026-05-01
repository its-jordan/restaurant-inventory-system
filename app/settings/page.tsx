'use client';

import React, { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState<string>('system');
  const [defaultView, setDefaultView] = useState<string>('Inventory');
  const [email, setEmail] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preferences from localStorage
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedView = localStorage.getItem('defaultView') || 'Inventory';
    const savedEmail = localStorage.getItem('email') || '';

    setTheme(savedTheme);
    setDefaultView(savedView);
    setEmail(savedEmail);
  }, []);

  const applyTheme = (newTheme: string) => {
    const htmlElement = document.documentElement;

    // Always clean up both classes first
    htmlElement.classList.remove('dark');
    htmlElement.classList.remove('light');

    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (newTheme === 'light') {
      htmlElement.classList.add('light');
    } else if (newTheme === 'system') {
      // Use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.add('light');
      }
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = e.target.value;
    setDefaultView(newView);
    localStorage.setItem('defaultView', newView);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSaveChanges = () => {
    localStorage.setItem('email', email);
    // You can add a success notification here if desired
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className='page-content'>
      <h1 className='page-header'>Settings</h1>
      <p className='mb-6 text-sm text-gray-500'>
        Configure inventory, notifications, and account preferences.
      </p>
      <div className=''>
        <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-medium'>General</h2>
          <form className='mt-6 space-y-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2'>
                <span className='text-sm font-medium '>Theme</span>
                <select
                  value={theme}
                  onChange={handleThemeChange}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2'>
                  <option value='light'>Light</option>
                  <option value='dark'>Dark</option>
                  <option value='system'>System</option>
                </select>
              </label>

              <label className='space-y-2'>
                <span className='text-sm font-medium '>Default view</span>
                <select
                  value={defaultView}
                  onChange={handleViewChange}
                  className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2'>
                  <option>Inventory</option>
                  <option>Orders</option>
                  <option>Reports</option>
                </select>
              </label>
            </div>
          </form>
        </section>

        {/* <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-medium text-slate-900'>Account</h2>
          <div className='mt-6 space-y-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-slate-700'>
                Username
              </span>
              <p className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700'>
                inventory.manager
              </p>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-sm font-medium text-slate-700'>
                Company
              </span>
              <p className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700'>
                Little Bar Restaurant
              </p>
            </div>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50'>
              Manage account
            </button>
          </div>
        </section> */}
      </div>
    </main>
  );
}
