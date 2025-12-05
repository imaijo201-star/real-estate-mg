'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function Sidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');
    const scrollbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add data-simplebar attribute on client side only to avoid hydration error
        if (scrollbarRef.current) {
            scrollbarRef.current.setAttribute('data-simplebar', '');
        }
    }, []);

    return (
        <div className="sidenav-menu">
            {/* Brand Logo */}
            <Link href="/admin" className="logo">
                <span className="logo logo-light">
                    <span className="logo-lg">
                        <span className="fw-bold fs-4">Real Estate</span>
                    </span>
                    <span className="logo-sm">RE</span>
                </span>
                <span className="logo logo-dark">
                    <span className="logo-lg">
                        <span className="fw-bold fs-4">Real Estate</span>
                    </span>
                    <span className="logo-sm">RE</span>
                </span>
            </Link>

            {/* Sidebar Hover Menu Toggle Button */}
            <button className="button-on-hover">
                <i className="ti ti-menu-4 fs-22 align-middle"></i>
            </button>

            {/* Full Sidebar Menu Close Button */}
            <button className="button-close-offcanvas">
                <i className="ti ti-x align-middle"></i>
            </button>

            <div ref={scrollbarRef} className="scrollbar">
                {/* Sidenav Menu */}
                <ul className="side-nav">
                    <li className="side-nav-title">메인</li>

                    <li className={`side-nav-item ${isActive('/admin') && !pathname?.includes('/properties') ? 'active' : ''}`}>
                        <Link href="/admin" className="side-nav-link">
                            <span className="menu-icon"><i className="ti ti-layout-dashboard"></i></span>
                            <span className="menu-text">대시보드</span>
                        </Link>
                    </li>

                    <li className="side-nav-title mt-2">매물 관리</li>

                    <li className={`side-nav-item ${pathname?.includes('/properties') ? 'active' : ''}`}>
                        <Link href="/admin/properties" className="side-nav-link">
                            <span className="menu-icon"><i className="ti ti-home"></i></span>
                            <span className="menu-text">전체 매물</span>
                        </Link>
                    </li>

                    <li className="side-nav-title mt-2">관리</li>

                    <li className={`side-nav-item ${pathname?.includes('/users') ? 'active' : ''}`}>
                        <Link href="/admin/users" className="side-nav-link">
                            <span className="menu-icon"><i className="ti ti-users"></i></span>
                            <span className="menu-text">사용자</span>
                        </Link>
                    </li>

                    <li className={`side-nav-item ${pathname?.includes('/settings') ? 'active' : ''}`}>
                        <Link href="/admin/settings" className="side-nav-link">
                            <span className="menu-icon"><i className="ti ti-settings"></i></span>
                            <span className="menu-text">설정</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
