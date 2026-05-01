'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const htmlElement = document.documentElement;

    // Always clean up both classes first
    htmlElement.classList.remove('dark');
    htmlElement.classList.remove('light');

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (theme === 'light') {
      htmlElement.classList.add('light');
    } else if (theme === 'system') {
      // Use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.add('light');
      }
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
