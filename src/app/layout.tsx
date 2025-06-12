import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import './globals.css';
// FullCalendar CSS might be included automatically by its components
import AuthProvider from '@/components/AuthProvider'; // Import the provider

const inter = Urbanist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorkDashboard',
  description: 'Work Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          {' '}
          {/* Wrap children with the provider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
