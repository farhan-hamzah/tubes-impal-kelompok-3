import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';

// ── Helper ────────────────────────────────────────────────
const fmt = (n) =>
    n != null
        ? `Rp ${Number(n).toLocaleString('id-ID')}`
        : 'Rp -';

const statusBadge = (status) => {
    const map = {
        AKTIF:      { bg: 'rgba(0,200,150,0.15)', color: '#00c896', label: 'Aktif' },
        SELESAI:    { bg: 'rgba(76,214,255,0.1)',  color: '#4cd6ff', label: 'Selesai' },
        MENUNGGU:   { bg: 'rgba(255,196,0,0.15)',  color: '#ffc400', label: 'Menunggu' },
        LUNAS:      { bg: 'rgba(0,200,150,0.15)',  color: '#00c896', label: 'Lunas' },
        BELUM_LUNAS:{ bg: 'rgba(255,100,60,0.15)', color: '#ff643c', label: 'Belum Lunas' },
    };
    const s = map[status] || { bg: 'rgba(140,144,161,0.15)', color: '#8c90a1', label: status || '-' };
    return (
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
            style={{ background: s.bg, color: s.color }}>
            {s.label}
        </span>
    );
};

// ── KPI Card ─────────────────────────────────────────────
const KpiCard = ({ label, value, icon, accent, sub }) => (
    <div className="kpi-card">
        <div className="absolute top-4 right-4 opacity-10">
            <span className="material-symbols-outlined text-5xl" style={{ color: accent }}>{icon}</span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{value}</h3>
        </div>
        {sub && <p className="text-xs mt-1" style={{ color: '#8c90a1' }}>{sub}</p>}
        <div className="progress-bar mt-4">
            <div className="progress-fill" style={{ width: '60%' }} />
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────
export default function ClientDashboard() {
    const { user } = useAuth();
    const [invoices, setInvoices]   = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');

    useEffect(() => {
        if (!user?.clientId) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const [inv, kon] = await Promise.all([
                    invoiceService.getInvoiceByClient(user.clientId),
                    kontrakService.getKontrakByClient(user.clientId),
                ]);
                setInvoices(Array.isArray(inv) ? inv : []);
                setContracts(Array.isArray(kon) ? kon : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.clientId]);

    // Computed stats (null-safe)
    const activeContracts  = contracts.filter(c => c.status === 'AKTIF').length;
    const unpaidInvoices   = invoices.filter(i => i.statusPembayaran === 'BELUM_LUNAS').length;
    const totalTagihan     = invoices.reduce((s, i) => s + (i.jumlahTagihan || 0), 0);

    // 3 kontrak & 5 invoice terbaru
    const recentContracts  = contracts.slice(0, 3);
    const recentInvoices   = invoices.slice(0, 5);

    return (
        <MainLayout pageTitle={`Halo, ${user?.nama || 'User'} 👋`}>
            <div className="space-y-8">

                {/* Error Banner */}
                {error && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>
                            Dashboard / Overview
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl font-black" style={{ color: '#dae2fd' }}>
                            {user?.nama || 'Client'}
                        </h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Pantau kontrak aktif, tagihan, dan sumber daya HPC Anda secara real-time.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/client/katalog" className="btn-primary">
                            <span className="material-symbols-outlined text-[18px]">grid_view</span> Lihat Katalog
                        </Link>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        label="Kontrak Aktif"
                        value={loading ? '…' : activeContracts}
                        icon="description"
                        accent="#4cd6ff"
                    />
                    <KpiCard
                        label="Total Kontrak"
                        value={loading ? '…' : contracts.length}
                        icon="folder_open"
                        accent="#cdbdff"
                    />
                    <KpiCard
                        label="Tagihan Belum Lunas"
                        value={loading ? '…' : unpaidInvoices}
                        icon="receipt_long"
                        accent="#ffb59d"
                    />
                    <KpiCard
                        label="Total Tagihan"
                        value={loading ? '…' : fmt(totalTagihan)}
                        icon="payments"
                        accent="#4cd6ff"
                    />
                </div>

                {/* Kontrak Terbaru & Tagihan Terbaru */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Kontrak Terbaru */}
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>Kontrak Terbaru</p>
                            <Link to="/client/kontrak"
                                className="text-xs font-semibold hover:underline"
                                style={{ color: '#4cd6ff' }}>
                                Lihat Semua
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <span className="material-symbols-outlined animate-spin text-3xl" style={{ color: '#4cd6ff' }}>progress_activity</span>
                            </div>
                        ) : recentContracts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <span className="material-symbols-outlined text-4xl" style={{ color: '#4a4f62' }}>folder_open</span>
                                <p className="text-sm" style={{ color: '#8c90a1' }}>Belum ada kontrak</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentContracts.map((k, i) => (
                                    <div key={k.id ?? i}
                                        className="flex items-center justify-between p-3 rounded-xl"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(66,70,86,0.2)' }}>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>
                                                {k.nomorKontrak || k.id || '-'}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: '#8c90a1' }}>
                                                {k.tanggalMulai || '-'} → {k.tanggalSelesai || '-'}
                                            </p>
                                        </div>
                                        {statusBadge(k.status)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tagihan Terbaru */}
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>Tagihan Terbaru</p>
                            <Link to="/client/transaksi"
                                className="text-xs font-semibold hover:underline"
                                style={{ color: '#4cd6ff' }}>
                                Lihat Semua
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <span className="material-symbols-outlined animate-spin text-3xl" style={{ color: '#4cd6ff' }}>progress_activity</span>
                            </div>
                        ) : recentInvoices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <span className="material-symbols-outlined text-4xl" style={{ color: '#4a4f62' }}>receipt_long</span>
                                <p className="text-sm" style={{ color: '#8c90a1' }}>Belum ada tagihan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentInvoices.map((inv, i) => (
                                    <div key={inv.id ?? i}
                                        className="flex items-center justify-between p-3 rounded-xl"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(66,70,86,0.2)' }}>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>
                                                {inv.nomorInvoice || inv.id || '-'}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: '#8c90a1' }}>
                                                {fmt(inv.jumlahTagihan)}
                                            </p>
                                        </div>
                                        {statusBadge(inv.statusPembayaran)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card">
                    <p className="text-sm font-bold mb-4" style={{ color: '#dae2fd' }}>Aksi Cepat</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Katalog Paket', icon: 'grid_view',    to: '/client/katalog' },
                            { label: 'Kontrak Saya',  icon: 'description',  to: '/client/kontrak' },
                            { label: 'Tagihan',        icon: 'payments',     to: '/client/transaksi' },
                            { label: 'Profil Saya',    icon: 'manage_accounts', to: '/profile' },
                        ].map(a => (
                            <Link key={a.to} to={a.to}
                                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
                                style={{ background: 'rgba(76,214,255,0.05)', border: '1px solid rgba(76,214,255,0.15)' }}>
                                <span className="material-symbols-outlined text-2xl" style={{ color: '#4cd6ff' }}>{a.icon}</span>
                                <span className="text-xs font-semibold text-center" style={{ color: '#c2c6d8' }}>{a.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}