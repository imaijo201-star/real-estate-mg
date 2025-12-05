import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { auth } from '@/auth';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="content-page">
                <Header session={session} />
                <div className="content">
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
