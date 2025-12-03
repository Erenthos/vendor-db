import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'IT Vendor Database',
  description: 'Vendor Development Management System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

