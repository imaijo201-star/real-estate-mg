'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../ui/Icon';

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="app-aside">
            <div className="app-aside-nav-scrollable">
                <nav className="app-aside-nav">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link
                                href="/admin"
                                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                            >
                                <Icon name="home" />
                                <span className="nav-link-text">대시보드</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href="/admin/properties"
                                className={`nav-link ${pathname?.startsWith('/admin/properties') ? 'active' : ''}`}
                            >
                                <Icon name="home" />
                                <span className="nav-link-text">매물 관리</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href="/admin/users"
                                className={`nav-link ${pathname?.startsWith('/admin/users') ? 'active' : ''}`}
                            >
                                <Icon name="users" />
                                <span className="nav-link-text">사용자 관리</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                href="/admin/settings"
                                className={`nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                            >
                                <Icon name="settings" />
                                <span className="nav-link-text">설정</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
