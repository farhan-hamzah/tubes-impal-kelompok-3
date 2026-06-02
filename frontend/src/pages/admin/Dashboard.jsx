import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';
import userService from '../../services/UserService';
import PaketService from '../../services/PaketService';


// ── Reusable sub-components ──────────────────────────────
const KpiCard = ({ label, value, delta, icon, accent }) => (
    <div className="kpi-card">
        <div className="absolute top-4 right-4 opacity-10">
            <span className="material-symbols-outlined text-5xl" style={{ color: accent }}>{icon}</span>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{value}</h3>
            {delta && <span className="text-xs font-semibold" style={{ color: accent }}>{delta}</span>}
        </div>
        <div className="progress-bar mt-4">
            <div className="progress-fill" style={{ width: '70%' }} />
        </div>
    </div>
);

const ResourceBar = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span style={{ color: '#c2c6d8' }}>{label}</span>
            <span style={{ color: color }}>{value}%</span>
        </div>
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
        </div>
        <p className="text-[9px] uppercase tracking-wider" style={{ color: '#4a4f62' }}>Simulated</p>
    </div>
);

// ── Main Component ───────────────────────────────────────
export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ invoices: '-', contracts: '-', clients: '-', gpuUnits: '-' });
    const [recentKontraks, setRecentKontraks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [invoices, contracts, clients, pakets] = await Promise.all([
                    invoiceService.getAllInvoice(),
                    kontrakService.getAllKontrak(),
                    userService.getAllClients(),
                    PaketService.getAllPaket(),
                ]);
                const totalGpu = Array.isArray(pakets)
                    ? pakets.filter(p => p.status === 'AKTIF').reduce((s, p) => s + (p.jumlahUnit || 0), 0)
                    : 0;
                setStats({
                    invoices: Array.isArray(invoices) ? invoices.length : '-',
                    contracts: Array.isArray(contracts) ? contracts.length : '-',
                    clients: Array.isArray(clients) ? clients.length : '-',
                    gpuUnits: totalGpu,
                });

                setRecentKontraks(Array.isArray(contracts) ? contracts.slice(-3).reverse() : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat data dashboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <MainLayout pageTitle="System Pulse">
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>
                            Dasbor / Ikhtisar
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl font-black" style={{ color: '#dae2fd' }}>Sistem Terpusat</h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Telemetri real-time dan orkestrasi sumber daya untuk klaster HPC Anda.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/admin/paket" className="btn-primary">
                            <span className="material-symbols-outlined text-[18px]">add</span> Klaster Baru
                        </Link>
                    </div>
                </div>

                {/* KPI Grid */}
                {error && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                    </div>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Klien" value={loading ? '…' : stats.clients} icon="groups" accent="#4cd6ff" />
                    <KpiCard label="Kontrak Aktif" value={loading ? '…' : stats.contracts} icon="description" accent="#cdbdff" />
                    <KpiCard label="Total Invoice" value={loading ? '…' : stats.invoices} icon="payments" accent="#4cd6ff" />
                    <div className="kpi-card" style={{ border: '1px solid rgba(76,214,255,0.2)' }}>
                        <div className="absolute top-4 right-4 opacity-15">
                            <span className="material-symbols-outlined text-5xl" style={{ color: '#4cd6ff' }}>memory</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>Unit GPU Tersedia</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>
                                {loading ? '…' : stats.gpuUnits}
                            </h3>
                        </div>
                        <div className="progress-bar mt-4">
                            <div className="progress-fill" style={{ width: stats.gpuUnits === '-' || stats.gpuUnits === 0 ? '0%' : '100%' }} />
                        </div>
                    </div>
                </div>

                {/* GPU Fleet Status + Deployment Stream */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* GPU Fleet Status */}
                    <div className="card p-6 flex flex-col items-center justify-center text-center">
                        <h4 className="font-display text-lg font-bold mb-1" style={{ color: '#dae2fd' }}>GPU Fleet Status</h4>
                        <p className="text-xs mb-6" style={{ color: '#8c90a1' }}>Real-time resource allocation</p>
                        {(() => {
                            const gpuTotal = typeof stats.gpuUnits === 'number' && stats.gpuUnits > 0 ? stats.gpuUnits : 0;
                            const occupied = typeof stats.contracts === 'number' ? Math.min(stats.contracts, gpuTotal) : 0;
                            const idle     = Math.max(gpuTotal - occupied, 0);
                            const pct      = gpuTotal > 0 ? Math.round((occupied / gpuTotal) * 100) : 0;
                            const circumference = 2 * Math.PI * 64;
                            const dashOffset = circumference - (pct / 100) * circumference;
                            return (
                                <>
                                    <div className="relative w-40 h-40 mb-6">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="64" fill="transparent" stroke="#222a3d" strokeWidth="12" />
                                            <circle cx="80" cy="80" r="64" fill="transparent" stroke="#4cd6ff" strokeWidth="12"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={loading ? circumference : dashOffset}
                                                strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="font-display text-3xl font-black" style={{ color: '#dae2fd' }}>
                                                {loading ? '…' : `${pct}%`}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4cd6ff' }}>Active</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        <div className="rounded-xl p-3 text-left" style={{ background: '#222a3d', borderLeft: '2px solid #4cd6ff' }}>
                                            <p className="text-[9px] uppercase font-bold" style={{ color: '#4a4f62' }}>Occupied</p>
                                            <p className="font-bold text-lg" style={{ color: '#dae2fd' }}>
                                                {loading ? '…' : `${occupied} Units`}
                                            </p>
                                        </div>
                                        <div className="rounded-xl p-3 text-left" style={{ background: '#222a3d', borderLeft: '2px solid #424656' }}>
                                            <p className="text-[9px] uppercase font-bold" style={{ color: '#4a4f62' }}>Idle</p>
                                            <p className="font-bold text-lg" style={{ color: '#dae2fd' }}>
                                                {loading ? '…' : `${idle} Units`}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Deployment Stream */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Deployment Stream</h4>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <span className="material-symbols-outlined spin text-2xl" style={{ color: '#4cd6ff' }}>sync</span>
                                </div>
                            ) : recentKontraks.length === 0 ? (
                                <p className="text-sm text-center py-8" style={{ color: '#4a4f62' }}>Belum ada kontrak.</p>
                            ) : recentKontraks.map((k, i) => (
                                <div key={k.kontrakId || i}
                                    className={`flex gap-4 items-start ${i < recentKontraks.length - 1 ? 'pb-4' : ''}`}
                                    style={i < recentKontraks.length - 1 ? { borderBottom: '1px solid rgba(66,70,86,0.15)' } : {}}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: k.status === 'ACTIVE' ? 'rgba(76,214,255,0.1)' : k.status === 'EXPIRED' ? 'rgba(255,180,171,0.1)' : 'rgba(205,189,255,0.1)' }}>
                                        <span className="material-symbols-outlined text-lg"
                                            style={{ color: k.status === 'ACTIVE' ? '#4cd6ff' : k.status === 'EXPIRED' ? '#ffb4ab' : '#cdbdff' }}>
                                            {k.status === 'ACTIVE' ? 'description' : k.status === 'EXPIRED' ? 'cancel' : 'pending'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: '#dae2fd' }}>
                                            {k.nomorKontrak || `Kontrak #${k.kontrakId}`}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: '#8c90a1' }}>
                                            {k.namaClient || '–'} · {k.namaPaket || '–'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                                        style={{
                                            background: k.status === 'ACTIVE' ? 'rgba(76,214,255,0.1)' : k.status === 'EXPIRED' ? 'rgba(255,180,171,0.1)' : 'rgba(205,189,255,0.1)',
                                            color: k.status === 'ACTIVE' ? '#4cd6ff' : k.status === 'EXPIRED' ? '#ffb4ab' : '#cdbdff'
                                        }}>
                                        {k.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Physical Resource Utilization */}
                <div className="card p-6">
                    <h4 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Physical Resource Utilization</h4>
                    <div className="space-y-6">
                        <ResourceBar label="Cluster CPU Load" value={64} color="#4cd6ff" />
                        <ResourceBar label="Memory (RAM) Pool" value={42} color="#4cd6ff" />
                        <ResourceBar label="Network Throughput" value={88} color="#cdbdff" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}