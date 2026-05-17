import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─────────────────────────────────────────────────────────
// SidebarConfig — OOP class untuk konfigurasi navigasi
// ─────────────────────────────────────────────────────────
export class SidebarConfig {
    static getAdminLinks() {
        return [
            { name: 'Dashboard',  path: '/admin/dashboard', icon: 'dashboard' },
            { name: 'Clients',    path: '/admin/clients',   icon: 'group' },
            { name: 'Packages',   path: '/admin/paket',     icon: 'inventory_2' },
            { name: 'Contracts',  path: '/admin/kontrak',   icon: 'description' },
            { name: 'Billing',    path: '/admin/invoice',   icon: 'payments' },
            { name: 'Reports',    path: '/admin/laporan',   icon: 'assessment' },
        ];
    }

    static getClientLinks() {
        return [
            { name: 'Dasbor',       path: '/client/dashboard',   icon: 'dashboard' },
            { name: 'Katalog',      path: '/client/katalog',     icon: 'grid_view' },
            { name: 'Kontrak',      path: '/client/kontrak',     icon: 'description' },
            { name: 'Tagihan',      path: '/client/transaksi',   icon: 'payments' },
<<<<<<< HEAD
=======
            { name: 'Monitoring',   path: '/client/monitoring',  icon: 'monitoring' },
>>>>>>> farhan
        ];
    }
}

// ─────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────
export function Sidebar({ role }) {
    const location = useLocation();
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const isAdmin = role === 'ADMIN';
    const links = isAdmin ? SidebarConfig.getAdminLinks() : SidebarConfig.getClientLinks();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 z-30"
            style={{ background: '#060e20', borderRight: '1px solid rgba(66,70,86,0.2)' }}>

            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
                    <span className="material-symbols-outlined icon-fill text-xl" style={{ color: '#003543' }}>memory</span>
                </div>
                <div>
                    <p className="font-display font-bold text-base leading-none" style={{ color: '#4cd6ff' }}>
                        {isAdmin ? 'Admin Console' : 'TensorLease'}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: '#4a4f62' }}>
                        {isAdmin ? 'HPC Management' : 'Portal Penyewa'}
                    </p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {links.map(link => {
                    const active = location.pathname === link.path
                        || location.pathname.startsWith(link.path + '/');
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link${active ? ' active' : ''}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: 'rgba(66,70,86,0.2)' }}>
                <Link to="/profile" className="nav-link">
                    <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    <span>Profil</span>
                </Link>
                <button onClick={handleLogout} className="nav-link w-full text-left" style={{ color: '#ffb4ab' }}>
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>{isAdmin ? 'Sign Out' : 'Keluar'}</span>
                </button>
            </div>
        </aside>
    );
}

// ─────────────────────────────────────────────────────────
// Topbar
// ─────────────────────────────────────────────────────────
export function Topbar({ user, pageTitle }) {
    const [open, setOpen] = useState(false);
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN';

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 md:px-8 shrink-0"
            style={{ background: 'rgba(11,19,38,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(66,70,86,0.15)' }}>

            {/* Left */}
            <div className="flex items-center gap-4">
                {isAdmin ? (
                    <span className="font-display font-black text-xl tracking-widest" style={{ color: '#4cd6ff' }}>
                        TensorLease
                    </span>
                ) : (
                    <h1 className="font-display font-bold text-lg text-white">{pageTitle}</h1>
                )}
                {/* Search bar */}
                <div className="hidden lg:flex items-center gap-2 rounded-xl px-4 py-2"
                    style={{ background: '#131b2e', border: '1px solid rgba(66,70,86,0.3)', minWidth: 260 }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: '#4a4f62' }}>search</span>
                    <input
                        type="text"
                        placeholder={isAdmin ? 'Search clusters, users...' : 'Cari klaster...'}
                        style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.8125rem', color: '#dae2fd', width: '100%' }}
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: '#8c90a1' }}>
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: '#8c90a1' }}>
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>

                {/* Avatar dropdown */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 pl-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold leading-none" style={{ color: '#dae2fd' }}>
                                {user?.nama || user?.username || 'User'}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#4cd6ff' }}>
                                {isAdmin ? 'Administrator' : 'Client'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg,rgba(76,214,255,0.2),rgba(0,124,152,0.2))', border: '1px solid rgba(76,214,255,0.3)', color: '#4cd6ff' }}>
                            {(user?.nama || user?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {open && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                            <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl z-50 py-1 fade-in"
                                style={{ background: '#171f33', border: '1px solid rgba(66,70,86,0.4)' }}>
                                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(66,70,86,0.2)' }}>
                                    <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>
                                        {user?.nama || user?.username}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: '#8c90a1' }}>{user?.email}</p>
                                </div>
                                <Link to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/5"
                                    style={{ color: '#c2c6d8' }}>
                                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                                    Profil Saya
                                </Link>
                                <button onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-white/5"
                                    style={{ color: '#ffb4ab' }}>
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    {isAdmin ? 'Sign Out' : 'Keluar'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// ─────────────────────────────────────────────────────────
// MainLayout
// ─────────────────────────────────────────────────────────
export function MainLayout({ children, pageTitle }) {
    const { user } = useAuth();
    return (
        <div className="min-h-screen flex" style={{ background: '#0b1326' }}>
            <Sidebar role={user?.role} />
            <div className="flex-1 flex flex-col min-h-screen md:ml-64 relative">
                {user?.role !== 'ADMIN' && (
                    <div className="absolute inset-0 grid-bg pointer-events-none opacity-20 z-0" />
                )}
                <Topbar user={user} pageTitle={pageTitle} />
                <main className="flex-1 p-6 md:p-8 relative z-10 fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
