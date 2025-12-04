'use client';

import { useState, useRef, useEffect } from 'react';
import { logout } from '@/actions/auth';

interface ProfileDropdownProps {
    session: any;
}

export function ProfileDropdown({ session }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return '총괄 매니저';
            case 'SENIOR_MANAGER': return '수석 매니저';
            case 'MANAGER': return '매니저';
            default: return role;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-danger';
            case 'SENIOR_MANAGER': return 'bg-warning';
            case 'MANAGER': return 'bg-info';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="position-relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                type="button"
                className="btn btn-system bg-transparent d-flex align-items-center justify-content-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="d-flex align-items-center gap-2">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary-600"
                        style={{ width: '32px', height: '32px' }}
                    >
                        <svg className="sa-icon text-white" width="18" height="18">
                            <use href="/icons/sprite.svg#user" />
                        </svg>
                    </div>
                    {session?.user?.name && (
                        <span className="d-none d-lg-inline text-truncate" style={{ maxWidth: '100px' }}>
                            {session.user.name}
                        </span>
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="position-absolute bg-white border rounded shadow-lg"
                    style={{
                        right: 0,
                        top: '100%',
                        marginTop: '0.5rem',
                        minWidth: '280px',
                        zIndex: 1050
                    }}
                >
                    {/* User Info Header */}
                    <div className="notification-header rounded-top mb-2 bg-primary text-white">
                        <div className="d-flex flex-row align-items-center p-3">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle bg-white me-3"
                                style={{ width: '48px', height: '48px' }}
                            >
                                <svg className="sa-icon text-primary" width="24" height="24">
                                    <use href="/icons/sprite.svg#user" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="fw-500 mb-1">
                                    {session?.user?.name || 'Admin'}
                                </div>
                                <div className="opacity-80 fs-sm mb-2">
                                    {session?.user?.email}
                                </div>
                                <span className={`badge ${getRoleBadge(session?.user?.role)} fs-xs`}>
                                    {getRoleLabel(session?.user?.role)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="dropdown-divider m-0" />

                    {/* Menu Links */}
                    <a href="/admin/profile" className="dropdown-item px-3 py-2 d-block">
                        <svg className="sa-icon me-2" width="16" height="16">
                            <use href="/icons/sprite.svg#user" />
                        </svg>
                        내 프로필
                    </a>
                    <a href="/admin/settings" className="dropdown-item px-3 py-2 d-block">
                        <svg className="sa-icon me-2" width="16" height="16">
                            <use href="/icons/sprite.svg#settings" />
                        </svg>
                        설정
                    </a>

                    <div className="dropdown-divider m-0" />

                    {/* Logout */}
                    <form action={logout} className="m-0">
                        <button
                            type="submit"
                            className="dropdown-item text-danger d-flex align-items-center px-3 py-3 fw-500 w-100 text-start border-0 bg-transparent"
                        >
                            <svg className="sa-icon me-2" width="16" height="16">
                                <use href="/icons/sprite.svg#log-out" />
                            </svg>
                            로그아웃
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
