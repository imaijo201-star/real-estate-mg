'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Icon } from '../ui/Icon';
import { ProfileDropdown } from '../ProfileDropdown';

interface HeaderProps {
    session: any;
}

export function Header({ session }: HeaderProps) {
    const { theme, setTheme } = useTheme();

    return (
        <header className="app-header">
            <div className="d-flex flex-grow-1 w-100 me-auto align-items-center">
                {/* Logo */}
                <Link href="/" className="app-logo flex-shrink-0">
                    <svg className="custom-logo">
                        <use href="/img/app-logo.svg#custom-logo" />
                    </svg>
                </Link>

                {/* Mobile Menu Icon */}
                <button
                    className="mobile-menu-icon me-2 d-flex d-sm-flex d-md-flex d-lg-none flex-shrink-0"
                    data-action="toggle-swap"
                    data-toggleclass="app-mobile-menu-open"
                >
                    <Icon name="menu" />
                </button>

                {/* Collapse Icon */}
                <button
                    type="button"
                    className="collapse-icon me-3 d-none d-lg-inline-flex d-xl-inline-flex d-xxl-inline-flex"
                    data-action="toggle"
                    data-class="set-nav-minified"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 8">
                        <polygon fill="#878787" points="4.5,1 3.8,0.2 0,4 3.8,7.8 4.5,7 1.5,4" />
                    </svg>
                </button>

                {/* Search */}
                <form className="app-search" role="search" autoComplete="off">
                    <input type="text" className="form-control" placeholder="Search for anything" />
                </form>
            </div>

            {/* Settings */}
            <button type="button" className="btn btn-system hidden-mobile" data-action="toggle-swap" data-toggleclass="open" data-target="aside.js-drawer-settings">
                <Icon name="settings" size="2x" />
            </button>

            {/* Theme Toggle */}
            <button
                type="button"
                className="btn btn-system"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                <Icon name={theme === 'dark' ? 'moon' : 'sun'} size="2x" />
            </button>

            {/* Fullscreen */}
            <button type="button" className="btn btn-system d-none d-sm-block d-sm-none d-md-none d-lg-block" onClick={() => document.documentElement.requestFullscreen()}>
                <Icon name="maximize" size="2x" />
            </button>

            {/* Notifications */}
            <button type="button" className="btn btn-system dropdown-toggle no-arrow" data-bs-toggle="dropdown">
                <span className="badge badge-icon pos-top pos-end">5</span>
                <Icon name="bell" size="2x" />
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown session={session} />
        </header>
    );
}
