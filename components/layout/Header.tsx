'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function Header({ session }: { session: Session | null }) {
    const notificationScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add data-simplebar attribute on client side only to avoid hydration error
        if (notificationScrollRef.current) {
            notificationScrollRef.current.setAttribute('data-simplebar', '');
        }
    }, []);

    const handleToggleSidebar = () => {
        document.body.classList.toggle('sidenav-toggled');
    };

    return (
        <header className="app-topbar m-0">
            <div className="container-fluid topbar-menu d-flex justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    {/* Sidebar Toggle Button */}
                    <button className="sidenav-toggle-button btn btn-primary btn-icon" onClick={handleToggleSidebar}>
                        <i className="ti ti-menu-4 fs-22"></i>
                    </button>

                    {/* Search */}
                    <div className="app-search d-none d-xl-flex">
                        <input type="search" className="form-control topbar-search" name="search" placeholder="Search for something..." />
                        <i className="ti ti-search app-search-icon text-muted"></i>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {/* Notifications */}
                    <div className="topbar-item">
                        <div className="dropdown">
                            <button className="topbar-link dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,22" type="button" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
                                <i className="ti ti-bell fs-22"></i>
                                <span className="badge text-bg-danger badge-circle topbar-badge">3</span>
                            </button>

                            <div className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg">
                                <div className="px-3 py-2 border-bottom">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="m-0 fs-md fw-semibold">알림</h6>
                                        </div>
                                        <div className="col-auto">
                                            <span className="badge text-bg-light fs-13">3개</span>
                                        </div>
                                    </div>
                                </div>

                                <div ref={notificationScrollRef} style={{ maxHeight: '230px' }}>
                                    <div className="text-center p-4">
                                        <p className="text-muted mb-0">새로운 알림이 없습니다</p>
                                    </div>
                                </div>

                                <a href="javascript:void(0);" className="dropdown-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">
                                    모든 알림 보기
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Light/Dark Mode Button */}
                    <div className="topbar-item d-none d-sm-flex">
                        <button className="topbar-link" id="light-dark-mode" type="button">
                            <i className="ti ti-moon fs-22 mode-light-moon"></i>
                            <i className="ti ti-sun fs-22 mode-light-sun"></i>
                        </button>
                    </div>

                    {/* User Dropdown */}
                    {session?.user && (
                        <div className="topbar-item nav-user">
                            <div className="dropdown">
                                <a className="topbar-link dropdown-toggle drop-arrow-none px-2" data-bs-toggle="dropdown" data-bs-offset="0,16" href="#!" aria-haspopup="false" aria-expanded="false">
                                    <img src="/inspinia/images/users/user-2.jpg" width="32" className="rounded-circle me-lg-2 d-flex" alt="user-image" />
                                    <div className="d-lg-flex align-items-center gap-1 d-none">
                                        <h5 className="my-0">{session.user.name || '사용자'}</h5>
                                        <i className="ti ti-chevron-down align-middle"></i>
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    {/* Header */}
                                    <div className="dropdown-header noti-title">
                                        <h6 className="text-overflow m-0">환영합니다!</h6>
                                    </div>

                                    {/* Profile */}
                                    <a href="#" className="dropdown-item">
                                        <i className="ti ti-user-circle me-2 fs-17 align-middle"></i>
                                        <span className="align-middle">프로필</span>
                                    </a>

                                    {/* Settings */}
                                    <a href="#" className="dropdown-item">
                                        <i className="ti ti-settings-2 me-2 fs-17 align-middle"></i>
                                        <span className="align-middle">설정</span>
                                    </a>

                                    <div className="dropdown-divider"></div>

                                    {/* Logout */}
                                    <a href="javascript:void(0);" className="dropdown-item text-danger fw-semibold" onClick={() => signOut({ redirect: true, redirectTo: '/login' })}>
                                        <i className="ti ti-logout-2 me-2 fs-17 align-middle"></i>
                                        <span className="align-middle">로그아웃</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
