import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Real Estate Manager',
    description: 'Professional Real Estate Management System',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                {/* SmartAdmin CSS */}
                <link rel="stylesheet" href="/plugins/waves/waves.min.css" />
                <link rel="stylesheet" href="/css/smartapp.min.css" />
                <link rel="stylesheet" href="/webfonts/smartadmin/sa-icons.css" />
                <link rel="stylesheet" href="/webfonts/fontawesome/fontawesome.css" />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
