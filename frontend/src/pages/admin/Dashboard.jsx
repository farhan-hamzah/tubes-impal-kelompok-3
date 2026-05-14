import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';
import kontrakService from '../../services/KontrakService';
import userService from '../../services/UserService';

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
    </div>
);

// ── Main Component ───────────────────────────────────────
export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ invoices: '-', contracts: '-', clients: '-' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [invoices, contracts, clients] = await Promise.all([
                    invoiceService.getAllInvoice(),
                    kontrakService.getAllKontrak(),
                    userService.getAllClients(),
                ]);
                setStats({
                    invoices: Array.isArray(invoices) ? invoices.length : '-',
                    contracts: Array.isArray(contracts) ? contracts.length : '-',
                    clients: Array.isArray(clients) ? clients.length : '-',
                });
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
                            Dashboard / Overview
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl font-black" style={{ color: '#dae2fd' }}>System Pulse</h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Real-time telemetry dan resource orchestration untuk klaster HPC Anda.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary">
                            <span className="material-symbols-outlined text-[18px]">download</span> Export Logs
                        </button>
                        <Link to="/admin/paket" className="btn-primary">
                            <span className="material-symbols-outlined text-[18px]">add</span> New Cluster
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
                    <KpiCard label="Total Clients" value={loading ? '…' : stats.clients} icon="groups" accent="#4cd6ff" />
                    <KpiCard label="Active Contracts" value={loading ? '…' : stats.contracts} icon="description" accent="#cdbdff" />
                    <KpiCard label="Total Invoices" value={loading ? '…' : stats.invoices} icon="payments" accent="#4cd6ff" />
                    <div className="kpi-card" style={{ border: '1px solid rgba(76,214,255,0.2)' }}>
                        <div className="absolute top-4 right-4 opacity-15">
                            <span className="material-symbols-outlined text-5xl" style={{ color: '#4cd6ff' }}>memory</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>GPU Units Available</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>15/100</h3>
                            <span className="text-xs" style={{ color: '#ffb59d' }}>High Demand</span>
                        </div>
                        <div className="progress-bar mt-4">
                            <div className="progress-fill" style={{ width: '85%' }} />
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Revenue Performance</h4>
                                <p className="text-xs mt-1" style={{ color: '#8c90a1' }}>Total revenue accrued over the last 30 days</p>
                            </div>
                            <select className="select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem', fontSize: '0.75rem' }}>
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                            </select>
                        </div>
                        <div className="h-52 flex items-end gap-2 px-2">
                            {[['WK1', 40], ['WK2', 55], ['WK3', 78], ['WK4', 65], ['WK5', 90], ['WK6', 72], ['WK7', 88]].map(([label, h]) => (
                                <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full rounded-t-md transition-all duration-300"
                                        style={{ height: `${h}%`, background: 'rgba(76,214,255,0.2)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,214,255,0.6)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(76,214,255,0.2)'} />
                                    <span className="text-[10px]" style={{ color: '#8c90a1' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* GPU Donut */}
                    <div className="card p-6 flex flex-col items-center justify-center text-center">
                        <h4 className="font-display text-lg font-bold mb-1" style={{ color: '#dae2fd' }}>GPU Fleet Status</h4>
                        <p className="text-xs mb-6" style={{ color: '#8c90a1' }}>Real-time resource allocation</p>
                        <div className="relative w-40 h-40 mb-6">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="64" fill="transparent" stroke="#222a3d" strokeWidth="12" />
                                <circle cx="80" cy="80" r="64" fill="transparent" stroke="#4cd6ff" strokeWidth="12"
                                    strokeDasharray="402" strokeDashoffset="60" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-display text-3xl font-black" style={{ color: '#dae2fd' }}>85%</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4cd6ff' }}>Active</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="rounded-xl p-3 text-left" style={{ background: '#222a3d', borderLeft: '2px solid #4cd6ff' }}>
                                <p className="text-[9px] uppercase font-bold" style={{ color: '#4a4f62' }}>Occupied</p>
                                <p className="font-bold text-lg" style={{ color: '#dae2fd' }}>85 Units</p>
                            </div>
                            <div className="rounded-xl p-3 text-left" style={{ background: '#222a3d', borderLeft: '2px solid #424656' }}>
                                <p className="text-[9px] uppercase font-bold" style={{ color: '#4a4f62' }}>Idle</p>
                                <p className="font-bold text-lg" style={{ color: '#dae2fd' }}>15 Units</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resource Usage + Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h4 className="font-display text-lg font-bold mb-6" style={{ color: '#dae2fd' }}>Physical Resource Utilization</h4>
                        <div className="space-y-6">
                            <ResourceBar label="Cluster CPU Load" value={64} color="#4cd6ff" />
                            <ResourceBar label="Memory (RAM) Pool" value={42} color="#4cd6ff" />
                            <ResourceBar label="Network Throughput" value={88} color="#cdbdff" />
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Deployment Stream</h4>
                            <span className="material-symbols-outlined cursor-pointer" style={{ color: '#4a4f62' }}>more_vert</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: 'cloud_done', color: '#4cd6ff', bg: 'rgba(76,214,255,0.1)', title: 'New Cluster Instance: A-100-Nodes-04', sub: 'Deployed to West-US-2 by admin', time: '2m ago' },
                                { icon: 'warning', color: '#ffb59d', bg: 'rgba(255,181,157,0.1)', title: 'Resource Warning: High Memory', sub: 'Node-09 has reached 92% capacity', time: '14m ago' },
                                { icon: 'person_add', color: '#cdbdff', bg: 'rgba(205,189,255,0.1)', title: 'New Client Onboarding', sub: 'DeepLearn AI provisioned 20 H100 units', time: '1h ago' },
                            ].map(({ icon, color, bg, title, sub, time }, i) => (
                                <div key={i} className={`flex gap-4 items-start ${i < 2 ? 'pb-4' : ''}`}
                                    style={i < 2 ? { borderBottom: '1px solid rgba(66,70,86,0.15)' } : {}}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: bg }}>
                                        <span className="material-symbols-outlined text-lg" style={{ color }}>{icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: '#dae2fd' }}>{title}</p>
                                        <p className="text-xs mt-0.5" style={{ color: '#8c90a1' }}>{sub}</p>
                                    </div>
                                    <span className="text-[10px] font-medium shrink-0" style={{ color: '#4a4f62' }}>{time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}