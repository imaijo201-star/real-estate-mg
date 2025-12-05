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
        <html lang="ko" data-bs-theme="light" className="set-nav-dark" data-sidenav-color="dark" suppressHydrationWarning>
            <head>
                {/* Inspinia CSS */}
                <link rel="stylesheet" href="/inspinia/css/vendors.min.css" />
                <link rel="stylesheet" href="/inspinia/css/app.min.css" />
            </head>
            <body>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
                <script src="/inspinia/js/vendors.min.js"></script>
                <script src="/inspinia/js/config.js"></script>
                <script src="/inspinia/js/app.js"></script>
            </body>
        </html>
    );
}
