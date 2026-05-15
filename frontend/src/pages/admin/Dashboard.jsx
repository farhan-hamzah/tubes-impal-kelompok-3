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
                            <h3 className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>–</h3>
                        </div>
                        <div className="progress-bar mt-4">
                            <div className="progress-fill" style={{ width: '0%' }} />
                        </div>
                    </div>
                </div>

        </div>
        </MainLayout>
    );
}