import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';
<<<<<<< HEAD

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
=======

const GaugeBar = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span style={{ color: '#c2c6d8' }}>{label}</span>
            <span style={{ color }}>{value}%</span>
        </div>
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
        </div>
    </div>
);

export default function ClientDashboard() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.clientId) return;
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

    return (
        <MainLayout pageTitle={`Halo, ${user?.nama || 'User'} 👋`}>
            <div className="space-y-8">
>>>>>>> farhan
                {error && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                    </div>
                )}

<<<<<<< HEAD
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
=======
                {/* Hero Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Instance Cards */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card p-6 border-l-4" style={{ borderLeftColor: '#4cd6ff' }}>
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4cd6ff' }}>Instansi Aktif</span>
                                <span className="material-symbols-outlined text-[20px]" style={{ color: '#4cd6ff', opacity: 0.4 }}>memory</span>
                            </div>
                            <h3 className="font-display text-xl font-extrabold mb-1" style={{ color: '#dae2fd' }}>H100 Research Cluster</h3>
                            <p className="text-xs mb-6" style={{ color: '#8c90a1' }}>Node Klaster: US-EAST-01</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {['H1', 'H2', 'H3'].map((n, i) => (
                                        <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                                            style={{ background: 'rgba(76,214,255,0.15)', border: '2px solid #171f33', color: '#4cd6ff' }}>{n}</div>
                                    ))}
                                </div>
                                <button className="text-xs font-bold flex items-center gap-1" style={{ color: '#4cd6ff' }}>
                                    Kelola Node <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div className="card p-6 border-l-4" style={{ borderLeftColor: '#cdbdff' }}>
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#cdbdff' }}>Sesuai Permintaan</span>
                                <span className="material-symbols-outlined text-[20px]" style={{ color: '#cdbdff', opacity: 0.4 }}>bolt</span>
                            </div>
                            <h3 className="font-display text-xl font-extrabold mb-1" style={{ color: '#dae2fd' }}>Instansi RTX 4090</h3>
                            <p className="text-xs mb-6" style={{ color: '#8c90a1' }}>Rendering Farm: EU-WEST-04</p>
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-1 rounded-md text-[10px] font-bold"
                                    style={{ background: 'rgba(205,189,255,0.15)', color: '#cdbdff' }}>BERJALAN</span>
                                <button className="text-xs font-bold flex items-center gap-1" style={{ color: '#cdbdff' }}>
                                    Akses CLI <span className="material-symbols-outlined text-sm">terminal</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Billing Summary */}
                    <div className="lg:col-span-4 card p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-[20px]" style={{ color: '#8c90a1' }}>account_balance_wallet</span>
                                <span className="text-sm font-medium" style={{ color: '#8c90a1' }}>Ringkasan Penagihan</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest" style={{ color: '#4a4f62' }}>Tagihan Bulan Ini</p>
                                    <p className="font-display text-3xl font-extrabold" style={{ color: '#dae2fd' }}>Rp 45.000.000</p>
                                </div>
                                <div className="h-px" style={{ background: 'rgba(66,70,86,0.15)' }} />
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest" style={{ color: '#4a4f62' }}>Faktur Berikutnya</p>
                                        <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>12 Okt 2024</p>
                                    </div>
                                    <span className="material-symbols-outlined" style={{ color: '#4a4f62' }}>calendar_today</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/client/transaksi" className="btn-primary w-full mt-6 text-center">
                            Bayar Faktur
>>>>>>> farhan
                        </Link>
                    </div>
                </div>

<<<<<<< HEAD
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

=======
                {/* Monitoring */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-9 card p-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="font-display text-2xl font-black" style={{ color: '#dae2fd' }}>Utilisasi Klaster GPU</h2>
                                <p className="text-sm mt-1" style={{ color: '#8c90a1' }}>Telemetri langsung — Node US-EAST-01</p>
                            </div>
                            <div className="flex gap-2">
                                {['1J', '6J', '24J'].map((t, i) => (
                                    <button key={t} className="px-3 py-1 rounded-full text-[10px] font-bold transition-all"
                                        style={i === 1
                                            ? { background: 'rgba(76,214,255,0.1)', color: '#4cd6ff', border: '1px solid rgba(76,214,255,0.2)' }
                                            : { border: '1px solid rgba(66,70,86,0.3)', color: '#8c90a1' }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-52 w-full relative">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#4cd6ff" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#4cd6ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M0,160 Q100,140 200,120 T400,80 T600,50 T800,30 L800,200 L0,200 Z" fill="url(#grad)" />
                                <path d="M0,160 Q100,140 200,120 T400,80 T600,50 T800,30" fill="none" stroke="#4cd6ff" strokeWidth="2.5" />
                                <circle cx="600" cy="50" fill="#4cd6ff" r="4" />
                                <circle cx="800" cy="30" fill="#4cd6ff" r="4" />
                            </svg>
                            <div className="absolute top-4 left-[72%] glass px-3 py-2 rounded-xl pointer-events-none">
                                <p className="text-[10px] font-bold" style={{ color: '#4cd6ff' }}>PUNCAK SAAT INI</p>
                                <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>94.2% Utilisasi</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-5" style={{ borderTop: '1px solid rgba(66,70,86,0.15)' }}>
                            {[['Beban Puncak', '98.2%'], ['Suhu Rata-rata', '64°C'], ['Memori VRAM', '42.1 GB'], ['Waktu Aktif', '14j 02m']].map(([k, v]) => (
                                <div key={k}>
                                    <p className="text-[10px] uppercase tracking-widest" style={{ color: '#4a4f62' }}>{k}</p>
                                    <p className="font-bold text-lg mt-1" style={{ color: '#dae2fd' }}>{v}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <div className="card p-5">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c2c6d8' }}>Denyut Sumber Daya</h4>
                                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />
                            </div>
                            <div className="space-y-5">
                                <GaugeBar label="GPU Compute" value={82} color="#4cd6ff" />
                                <GaugeBar label="CPU Cores" value={14} color="#8c90a1" />
                                <GaugeBar label="VRAM" value={65} color="#cdbdff" />
                            </div>
                        </div>
                        <div className="card p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(82,3,213,0.15),rgba(34,42,61,0.8))' }}>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <span className="material-symbols-outlined text-8xl icon-fill">rocket_launch</span>
                            </div>
                            <h3 className="font-display font-bold text-base mb-2" style={{ color: '#dae2fd' }}>Butuh tenaga ekstra?</h3>
                            <p className="text-xs mb-4 leading-relaxed" style={{ color: '#8c90a1' }}>
                                Tingkatkan klaster atau terapkan instansi A100 baru.
                            </p>
                            <Link to="/client/katalog" className="btn-primary text-sm px-4 py-2">
                                Katalog Layanan <span className="material-symbols-outlined text-sm">grid_view</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Deployments + Contract Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Penerapan Terbaru</h3>
                        <div className="space-y-3">
                            {[
                                { icon: 'cloud_done', color: '#4cd6ff', title: 'LLM Training Cluster v2', sub: 'Berhasil • 2 jam yang lalu' },
                                { icon: 'data_object', color: '#cdbdff', title: 'Pipa Deteksi Objek', sub: 'Dihentikan • 5 jam yang lalu' },
                            ].map(({ icon, color, title, sub }, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/5">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: `${color}18` }}>
                                        <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: '#dae2fd' }}>{title}</p>
                                        <p className="text-[10px]" style={{ color: '#8c90a1' }}>{sub}</p>
                                    </div>
                                    <span className="material-symbols-outlined ml-auto" style={{ color: '#4a4f62' }}>more_vert</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Status Kontrak</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'H100 Research Agreement', status: 'Berakhir dalam 124 hari', color: '#4cd6ff' },
                                { title: 'Enterprise SLA Tier 1', status: 'Aktif', color: '#8c90a1' },
                            ].map(({ title, status, color }, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined" style={{ color: '#4a4f62' }}>verified</span>
                                            <span className="text-sm font-medium" style={{ color: '#c2c6d8' }}>{title}</span>
                                        </div>
                                        <span className="text-xs font-bold" style={{ color }}>{status}</span>
                                    </div>
                                    {i < 1 && <div className="h-px mt-4" style={{ background: 'rgba(66,70,86,0.15)' }} />}
                                </div>
                            ))}
                            <Link to="/client/kontrak" className="block text-center text-xs font-bold pt-2 hover:underline" style={{ color: '#4a4f62' }}>
                                Lihat semua dokumen hukum
                            </Link>
                        </div>
                    </div>
                </div>
>>>>>>> farhan
            </div>
        </MainLayout>
    );
}