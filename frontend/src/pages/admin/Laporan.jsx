import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';

<<<<<<< HEAD


export default function Laporan() {
=======
const mockRevenue = [
    { month: 'Jan', value: 82 }, { month: 'Feb', value: 95 },
    { month: 'Mar', value: 110 }, { month: 'Apr', value: 98 },
    { month: 'Mei', value: 130 }, { month: 'Jun', value: 142 },
];

const mockClients = [
    { name: 'DeepLearn AI', spend: 'Rp 28.4jt', pct: 72, badge: '#4cd6ff' },
    { name: 'NeuroVision Labs', spend: 'Rp 19.2jt', pct: 55, badge: '#cdbdff' },
    { name: 'AlphaForge Corp', spend: 'Rp 14.8jt', pct: 45, badge: '#4cd6ff' },
    { name: 'Sigma Dynamics', spend: 'Rp 11.0jt', pct: 32, badge: '#8c90a1' },
    { name: 'Quanta Systems', spend: 'Rp 8.6jt', pct: 24, badge: '#8c90a1' },
];

export default function Laporan() {
    const max = Math.max(...mockRevenue.map(r => r.value));
>>>>>>> farhan
    const [invoices, setInvoices] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inv, kon] = await Promise.all([
                    invoiceService.getAllInvoice(),
                    kontrakService.getAllKontrak(),
                ]);
                setInvoices(Array.isArray(inv) ? inv : []);
                setContracts(Array.isArray(kon) ? kon : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat data laporan.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <MainLayout pageTitle="Laporan & Analitik">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase" style={{ color: '#dae2fd' }}>
                        Laporan & <span style={{ color: '#4cd6ff' }}>Analitik</span>
                    </h1>
                    <p className="text-sm mt-2 max-w-lg" style={{ color: '#8c90a1' }}>
                        Tinjauan performa bisnis, penggunaan sumber daya, dan pendapatan secara menyeluruh.
                    </p>
                </div>
                {error && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
<<<<<<< HEAD
                        { label: 'Revenue (YTD)', value: '–', delta: null, icon: 'payments', color: '#4cd6ff' },
                        { label: 'Kontrak Aktif', value: contracts.length || '–', delta: null, icon: 'description', color: '#cdbdff' },
                        { label: 'Utilisasi GPU', value: '–', delta: null, icon: 'memory', color: '#4cd6ff' },
                        { label: 'Churn Rate', value: '–', delta: null, icon: 'trending_down', color: '#4cd6ff' },
=======
                        { label: 'Revenue (YTD)', value: 'Rp 657jt', delta: '+18.4%', icon: 'payments', color: '#4cd6ff' },
                        { label: 'Kontrak Aktif', value: '856', delta: '+12.1%', icon: 'description', color: '#cdbdff' },
                        { label: 'Utilisasi GPU', value: '88.4%', delta: '+5.2%', icon: 'memory', color: '#4cd6ff' },
                        { label: 'Churn Rate', value: '2.1%', delta: '−0.3%', icon: 'trending_down', color: '#4cd6ff' },
>>>>>>> farhan
                    ].map(({ label, value, delta, icon, color }) => (
                        <div key={label} className="kpi-card">
                            <div className="absolute top-4 right-4 opacity-10">
                                <span className="material-symbols-outlined text-5xl" style={{ color }}>{icon}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{value}</p>
<<<<<<< HEAD
                            {delta && <p className="text-xs mt-2 font-semibold" style={{ color }}>{delta} vs bulan lalu</p>}
=======
                            <p className="text-xs mt-2 font-semibold" style={{ color }}>{delta} vs bulan lalu</p>
>>>>>>> farhan
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h4 className="font-display text-xl font-bold" style={{ color: '#dae2fd' }}>Pendapatan Bulanan</h4>
                                <p className="text-xs mt-1" style={{ color: '#8c90a1' }}>6 bulan terakhir · Jutaan Rupiah</p>
                            </div>
                            <button className="btn-secondary text-xs py-1.5 px-3">
                                <span className="material-symbols-outlined text-[16px]">download</span> Ekspor
                            </button>
                        </div>
<<<<<<< HEAD
                        <div className="h-52 flex items-center justify-center">
                            <p className="text-sm" style={{ color: '#4a4f62' }}>Belum ada data pendapatan.</p>
=======
                        <div className="h-52 flex items-end gap-3 pb-2">
                            {mockRevenue.map(({ month, value }) => (
                                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-bold" style={{ color: '#4cd6ff' }}>
                                        {value}
                                    </span>
                                    <div className="w-full rounded-t-lg transition-all"
                                        style={{
                                            height: `${(value / max) * 100}%`,
                                            background: value === max
                                                ? 'linear-gradient(180deg, #4cd6ff, #007c98)'
                                                : 'rgba(76,214,255,0.2)'
                                        }} />
                                    <span className="text-[10px]" style={{ color: '#8c90a1' }}>{month}</span>
                                </div>
                            ))}
>>>>>>> farhan
                        </div>
                    </div>

                    {/* Pie chart–style donut */}
                    <div className="card p-6 flex flex-col items-center justify-center text-center">
                        <h4 className="font-display text-xl font-bold mb-1" style={{ color: '#dae2fd' }}>Alokasi Klaster</h4>
                        <p className="text-xs mb-6" style={{ color: '#8c90a1' }}>Distribusi penggunaan GPU</p>
                        <div className="relative w-36 h-36 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                                <circle cx="70" cy="70" r="56" fill="transparent" stroke="#222a3d" strokeWidth="12" />
                                <circle cx="70" cy="70" r="56" fill="transparent" stroke="#4cd6ff" strokeWidth="12"
                                    strokeDasharray="352" strokeDashoffset="53" strokeLinecap="round" />
                                <circle cx="70" cy="70" r="56" fill="transparent" stroke="#cdbdff" strokeWidth="12"
                                    strokeDasharray="352" strokeDashoffset="282" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div>
                                    <p className="font-display text-2xl font-black" style={{ color: '#dae2fd' }}>100</p>
                                    <p className="text-[9px] uppercase font-bold" style={{ color: '#4a4f62' }}>Unit GPU</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            {[{ color: '#4cd6ff', label: 'Terpakai', val: '85%' }, { color: '#cdbdff', label: 'Pemeliharaan', val: '5%' }, { color: '#424656', label: 'Idle', val: '10%' }].map(({ color, label, val }) => (
                                <div key={label} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                        <span style={{ color: '#c2c6d8' }}>{label}</span>
                                    </div>
                                    <span className="font-bold" style={{ color }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Clients + Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Top 5 Klien</h4>
                            <span className="text-xs" style={{ color: '#4a4f62' }}>Berdasarkan pengeluaran</span>
                        </div>
<<<<<<< HEAD
                        <div className="flex items-center justify-center h-32">
                            <p className="text-sm" style={{ color: '#4a4f62' }}>Belum ada data klien.</p>
=======
                        <div className="space-y-5">
                            {mockClients.map(({ name, spend, pct, badge }, i) => (
                                <div key={name}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold" style={{ color: '#4a4f62' }}>{i + 1}.</span>
                                            <span className="text-sm font-bold" style={{ color: '#dae2fd' }}>{name}</span>
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: badge }}>{spend}</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${pct}%`, background: badge }} />
                                    </div>
                                </div>
                            ))}
>>>>>>> farhan
                        </div>
                    </div>

                    <div className="card p-6">
                        <h4 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Ringkasan Insiden SLA</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Uptime Infrastruktur', value: '99.98%', color: '#4cd6ff' },
                                { label: 'Respon Tiket (Avg)', value: '< 4 Jam', color: '#cdbdff' },
                                { label: 'Insiden Terbuka', value: '2', color: '#ffb4ab' },
                                { label: 'Insiden Diselesaikan (30 Hari)', value: '14', color: '#4cd6ff' },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="flex items-center justify-between py-3"
                                    style={{ borderBottom: '1px solid rgba(66,70,86,0.15)' }}>
                                    <span className="text-sm" style={{ color: '#c2c6d8' }}>{label}</span>
                                    <span className="font-bold text-sm" style={{ color }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
