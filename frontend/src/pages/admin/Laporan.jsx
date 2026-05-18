import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';

const rupiah = (n) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Rp –';

export default function Laporan() {
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

    // Pendapatan tahun ini
    const tahunIni = new Date().getFullYear();
    const pendapatanYTD = invoices
        .filter(i => i.statusPembayaran === 'PAID' && new Date(i.tanggalBayar || i.tagihanMulai).getFullYear() === tahunIni)
        .reduce((s, i) => s + (i.jumlahTagihan || 0), 0);

    // Bar chart 6 bulan terakhir
    const dataBulanan = (() => {
        const now = new Date();
        const bulan = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            bulan.push({
                label: d.toLocaleDateString('id-ID', { month: 'short' }),
                month: d.getMonth(), year: d.getFullYear(), total: 0,
            });
        }
        invoices.filter(inv => inv.statusPembayaran === 'PAID').forEach(inv => {
            const d = new Date(inv.tanggalBayar || inv.tagihanMulai);
            const m = bulan.find(b => b.month === d.getMonth() && b.year === d.getFullYear());
            if (m) m.total += (inv.jumlahTagihan || 0);
        });
        const max = Math.max(...bulan.map(b => b.total), 1);
        return bulan.map(b => ({ ...b, pct: Math.max(4, Math.round((b.total / max) * 100)) }));
    })();

    // Top 5 klien berdasarkan total biaya kontrak
    const top5Klien = (() => {
        const map = {};
        contracts.forEach(k => {
            const nama = k.namaClient || 'Tidak Diketahui';
            map[nama] = (map[nama] || 0) + (k.totalBiaya || 0);
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    })();
    const maxSpend = top5Klien.length > 0 ? top5Klien[0][1] : 1;

    return (
        <MainLayout pageTitle="Laporan & Analitik">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase" style={{ color: '#dae2fd' }}>
                        Laporan &amp; <span style={{ color: '#4cd6ff' }}>Analitik</span>
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

                {/* KPI */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Pendapatan (YTD)', value: loading ? '…' : rupiah(pendapatanYTD), icon: 'payments', color: '#4cd6ff' },
                        { label: 'Kontrak Aktif', value: loading ? '…' : contracts.filter(k => k.status === 'ACTIVE').length, icon: 'description', color: '#cdbdff' },
                        { label: 'Utilisasi GPU', value: '–', icon: 'memory', color: '#4cd6ff' },
                        { label: 'Churn Rate', value: '–', icon: 'trending_down', color: '#4cd6ff' },
                    ].map(({ label, value, icon, color }) => (
                        <div key={label} className="kpi-card">
                            <div className="absolute top-4 right-4 opacity-10">
                                <span className="material-symbols-outlined text-5xl" style={{ color }}>{icon}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Chart + Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar chart pendapatan bulanan */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h4 className="font-display text-xl font-bold" style={{ color: '#dae2fd' }}>Pendapatan Bulanan</h4>
                                <p className="text-xs mt-1" style={{ color: '#8c90a1' }}>6 bulan terakhir · Rupiah</p>
                            </div>
                            <button className="btn-secondary text-xs py-1.5 px-3">
                                <span className="material-symbols-outlined text-[16px]">download</span> Ekspor
                            </button>
                        </div>
                        <div className="h-52 flex items-end gap-2 px-2">
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <span className="material-symbols-outlined animate-spin text-3xl" style={{ color: '#4cd6ff' }}>progress_activity</span>
                                </div>
                            ) : dataBulanan.every(b => b.total === 0) ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-sm" style={{ color: '#4a4f62' }}>Belum ada data pendapatan.</p>
                                </div>
                            ) : dataBulanan.map(b => (
                                <div key={b.label} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full rounded-t-md transition-all duration-300"
                                        style={{ height: `${b.pct}%`, background: 'rgba(76,214,255,0.2)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,214,255,0.6)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(76,214,255,0.2)'} />
                                    <span className="text-[10px]" style={{ color: '#8c90a1' }}>{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Donut chart alokasi klaster */}
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
                            {[
                                { color: '#4cd6ff', label: 'Terpakai', val: '85%' },
                                { color: '#cdbdff', label: 'Pemeliharaan', val: '5%' },
                                { color: '#424656', label: 'Idle', val: '10%' },
                            ].map(({ color, label, val }) => (
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

                {/* Top 5 Klien + Ringkasan SLA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Top 5 Klien</h4>
                            <span className="text-xs" style={{ color: '#4a4f62' }}>Berdasarkan pengeluaran</span>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <span className="material-symbols-outlined animate-spin text-3xl" style={{ color: '#4cd6ff' }}>progress_activity</span>
                            </div>
                        ) : top5Klien.length === 0 ? (
                            <div className="flex items-center justify-center h-32">
                                <p className="text-sm" style={{ color: '#4a4f62' }}>Belum ada data klien.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {top5Klien.map(([nama, spend]) => (
                                    <div key={nama}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: '#c2c6d8' }}>{nama}</span>
                                            <span className="font-bold" style={{ color: '#4cd6ff' }}>{rupiah(spend)}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${Math.round((spend / maxSpend) * 100)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card p-6">
                        <h4 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Ringkasan Insiden SLA</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Uptime Infrastruktur', value: '99.98%', color: '#4cd6ff' },
                                { label: 'Respon Tiket (Avg)', value: '< 4 Jam', color: '#cdbdff' },
                                { label: 'Insiden Terbuka', value: '2', color: '#ffb4ab' },
                                { label: 'Diselesaikan (30 Hari)', value: '14', color: '#4cd6ff' },
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
