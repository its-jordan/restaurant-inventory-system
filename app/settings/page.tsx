import React from 'react';

export default function SettingsPage() {
  return (
    <main className='min-h-screen bg-slate-50 p-8'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <header>
          <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>
            Settings
          </p>
          <h1 className='mt-2 text-3xl font-semibold text-slate-900'>
            Application Preferences
          </h1>
          <p className='mt-2 text-slate-600'>
            Configure inventory, notifications, and account preferences.
          </p>
        </header>

        <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-medium text-slate-900'>General</h2>
          <form className='mt-6 space-y-5'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='space-y-2'>
                <span className='text-sm font-medium text-slate-700'>
                  Theme
                </span>
                <select className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2'>
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </label>

              <label className='space-y-2'>
                <span className='text-sm font-medium text-slate-700'>
                  Default view
                </span>
                <select className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2'>
                  <option>Inventory</option>
                  <option>Orders</option>
                  <option>Reports</option>
                </select>
              </label>
            </div>

            <label className='space-y-2'>
              <span className='text-sm font-medium text-slate-700'>
                Notification email
              </span>
              <input
                type='email'
                placeholder='you@example.com'
                className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2'
              />
            </label>

            <button
              type='button'
              className='inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800'>
              Save changes
            </button>
          </form>
        </section>

        <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
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
                Little Bar Kitchen
              </p>
            </div>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50'>
              Manage account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
