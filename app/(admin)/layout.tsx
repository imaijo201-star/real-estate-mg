import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="app-wrap">
            <Header />
            <Sidebar />
            <main className="app-content">
                <div className="container-fluid p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
