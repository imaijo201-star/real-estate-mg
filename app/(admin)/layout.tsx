import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { auth } from '@/auth';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    return (
        <div className="app-wrap">
            <Header session={session} />
            <Sidebar />
            <main className="app-content">
                <div className="container-fluid p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
