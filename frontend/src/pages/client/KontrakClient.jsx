import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import KontrakService from '../../services/KontrakService';

const StatusBadge = ({ status }) => {
    const map = {
        ACTIVE:        { label: 'Aktif',           cls: 'badge-active' },
        PENDING:       { label: 'Menunggu',        cls: 'badge-pending' },
        EXPIRED:       { label: 'Kedaluwarsa',     cls: 'badge-expired' },
        EXPIRING_SOON: { label: 'Segera Berakhir', cls: 'badge-overdue' },
    };
    const { label, cls } = map[status] || { label: status, cls: 'badge-expired' };
    return <span className={`badge ${cls}`}>{label}</span>;
};

export default function KontrakClient() {
    const { user } = useAuth();
    const [kontraks, setKontraks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        loadKontraks();
    }, [user]);

    const loadKontraks = async () => {
        setLoading(true);
        try {
            const data = await KontrakService.getKontrakByClient(user.clientId);
            setKontraks(data || []);
        } catch {
            setKontraks([]);
        } finally {
            setLoading(false);
        }
    };

    const active = kontraks.filter(k => k.status === 'ACTIVE');
    const pending = kontraks.filter(k => k.status === 'PENDING');
    const expiring = kontraks.filter(k => k.status === 'EXPIRING_SOON');

    return (
        <MainLayout pageTitle="Kontrak Saya">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                        Kontrak <span style={{ color: '#4cd6ff' }}>Saya</span>
                    </h1>
                    <p className="text-sm mt-2" style={{ color: '#8c90a1' }}>
                        Seluruh perjanjian layanan komputasi dan status perpanjangan Anda.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Kontrak Aktif', value: active.length, icon: 'verified', color: '#4cd6ff' },
                        { label: 'Menunggu', value: pending.length, icon: 'pending', color: '#cdbdff' },
                        { label: 'Segera Berakhir', value: expiring.length, icon: 'schedule', color: '#ffb59d' },
                    ].map(({ label, value, icon, color }) => (
                        <div key={label} className="kpi-card flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: `${color}15` }}>
                                <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#8c90a1' }}>{label}</p>
                                <p className="font-display text-3xl font-bold mt-0.5" style={{ color: '#dae2fd' }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kontrak List */}
                {loading ? (
                    <div className="text-center py-20" style={{ color: '#4a4f62' }}>Memuat kontrak Anda...</div>
                ) : kontraks.length === 0 ? (
                    <div className="card p-16 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: '#4a4f62' }}>description</span>
                        <p className="font-display text-xl font-bold mb-2" style={{ color: '#dae2fd' }}>Belum Ada Kontrak</p>
                        <p className="text-sm" style={{ color: '#8c90a1' }}>Hubungi administrator untuk memulai langganan layanan HPC Anda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {kontraks.map((k, i) => (
                            <div key={k.kontrakId || i}
                                className="card p-6 cursor-pointer transition-all hover:border-cyan-500/30"
                                style={{ border: selected === i ? '1px solid rgba(76,214,255,0.3)' : undefined }}
                                onClick={() => setSelected(selected === i ? null : i)}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: 'rgba(76,214,255,0.08)', border: '1px solid rgba(76,214,255,0.15)' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>contract</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>
                                                    {k.namaPaket}
                                                </h3>
                                                <StatusBadge status={k.status} />
                                            </div>
                                            <p className="text-xs mt-1 font-mono" style={{ color: '#4a4f62' }}>{k.nomorKontrak}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-right">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4f62' }}>Total Biaya</p>
                                            <p className="font-display text-xl font-bold" style={{ color: '#dae2fd' }}>
                                                Rp {k.totalBiaya?.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined transition-transform"
                                            style={{ color: '#4a4f62', transform: selected === i ? 'rotate(180deg)' : '' }}>
                                            keyboard_arrow_down
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {selected === i && (
                                    <div className="mt-5 pt-5 grid grid-cols-2 md:grid-cols-4 gap-4 fade-in"
                                        style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                                        {[
                                            { label: 'Tanggal Mulai', value: k.tanggalMulai },
                                            { label: 'Tanggal Berakhir', value: k.tanggalBerakhir },
                                            { label: 'Durasi', value: `${k.durasibulan} Bulan` },
                                            { label: 'Status', value: k.status },
                                        ].map(({ label, value }) => (
                                            <div key={label}>
                                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4f62' }}>{label}</p>
                                                <p className="font-semibold mt-0.5" style={{ color: '#dae2fd' }}>{value}</p>
                                            </div>
                                        ))}
                                        {k.catatan && (
                                            <div className="col-span-full mt-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#4a4f62' }}>Catatan</p>
                                                <p className="text-sm" style={{ color: '#c2c6d8' }}>{k.catatan}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}