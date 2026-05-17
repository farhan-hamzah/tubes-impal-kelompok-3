import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import UserService from '../../services/UserService';

<<<<<<< HEAD
=======
const MOCK_CLIENTS = [
    { userId: 'U-001', nama: 'Budi Santoso',    email: 'budi@tensorlab.ai',   nomorTelepon: '081234567890', isActive: true },
    { userId: 'U-002', nama: 'Siti Rahayu',     email: 'siti@deeplearn.id',   nomorTelepon: '082345678901', isActive: true },
    { userId: 'U-003', nama: 'Andi Wijaya',     email: 'andi@aiventure.co',   nomorTelepon: '083456789012', isActive: true },
    { userId: 'U-004', nama: 'Dewi Lestari',    email: 'dewi@cloudgpu.io',    nomorTelepon: '084567890123', isActive: false },
    { userId: 'U-005', nama: 'Reza Firmansyah', email: 'reza@hpcworld.net',   nomorTelepon: '085678901234', isActive: true },
];
>>>>>>> farhan

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAllClients();
<<<<<<< HEAD
            setClients(Array.isArray(data) ? data : []);
        } catch {
            setClients([]);
=======
            setClients(data && data.length > 0 ? data : MOCK_CLIENTS);
        } catch {
            setClients(MOCK_CLIENTS);
>>>>>>> farhan
        } finally {
            setLoading(false);
        }
    };

    const filtered = clients.filter(c =>
        c.nama?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout pageTitle="Manajemen Client">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Manajemen <span style={{ color: '#4cd6ff' }}>Klien</span>
                        </h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Pantau alokasi sumber daya, kesehatan kontrak, dan kinerja klien di seluruh klaster.
                        </p>
                    </div>
                    <button className="btn-primary">
                        <span className="material-symbols-outlined">person_add</span> Daftarkan Klien
                    </button>
                </div>

                {/* Snapshot KPIs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
<<<<<<< HEAD
                        { icon: 'monitoring', label: 'Utilisasi Global', value: '–', badge: null, badgeColor: '#4cd6ff', sub: null },
                        { icon: 'account_balance', label: 'Proyeksi ARR', value: '–', badge: null, badgeColor: '#4cd6ff', sub: null },
                        { icon: 'security', label: 'Insiden Terbuka', value: '–', badge: null, badgeColor: '#ffb59d', sub: null },
=======
                        { icon: 'monitoring', label: 'Utilisasi Global', value: '88.2%', badge: '+12%', badgeColor: '#4cd6ff', sub: null },
                        { icon: 'account_balance', label: 'Proyeksi ARR', value: 'Rp 1,8 M', badge: 'Stabil', badgeColor: '#4cd6ff', sub: 'Siklus perpanjangan berikutnya dalam 14 hari.' },
                        { icon: 'security', label: 'Insiden Terbuka', value: '02', badge: 'Peringatan', badgeColor: '#ffb59d', sub: null },
>>>>>>> farhan
                    ].map(({ icon, label, value, badge, badgeColor, sub }) => (
                        <div key={label} className="kpi-card">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>{icon}</span>
<<<<<<< HEAD
                                {badge && <span className="badge" style={{ background: `${badgeColor}18`, color: badgeColor }}>{badge}</span>}
=======
                                <span className="badge" style={{ background: `${badgeColor}18`, color: badgeColor }}>{badge}</span>
>>>>>>> farhan
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-4xl font-extrabold" style={{ color: '#dae2fd' }}>{value}</p>
                            {sub && <p className="text-[10px] mt-3 leading-tight" style={{ color: '#4a4f62' }}>{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Table Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl"
                    style={{ background: '#131b2e', border: '1px solid rgba(66,70,86,0.2)' }}>
                    <div className="flex flex-1 gap-3 w-full md:w-auto">
                        <div className="relative flex-1 max-w-sm">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#4a4f62' }}>search</span>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Cari berdasarkan nama atau email..."
                                className="input input-icon w-full" />
                        </div>
                        <div className="relative hidden sm:block">
                            <select className="select" style={{ paddingLeft: '0.75rem' }}>
                                <option>Semua Status</option>
                                <option>Aktif</option>
                                <option>Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary py-2 px-3">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        <button onClick={load} className="btn-secondary py-2 px-3">
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {['Nama Klien', 'Kontak', 'Status', 'Kontrak', 'Beban Komputasi', ''].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat data klien...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Tidak ada klien ditemukan.</td></tr>
                                ) : filtered.map((c, i) => {
                                    const load = (i % 5 + 1) * 15;
                                    return (
                                        <tr key={c.userId || i} className="group">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                                                        style={{ background: 'rgba(76,214,255,0.1)', color: '#4cd6ff' }}>
                                                        {c.nama?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold" style={{ color: '#dae2fd' }}>{c.nama}</p>
                                                        <p className="text-[10px] font-mono" style={{ color: '#4a4f62' }}>
                                                            CLI-{String(c.userId || i).padStart(3, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="text-sm" style={{ color: '#c2c6d8' }}>{c.email}</p>
                                                <p className="text-xs" style={{ color: '#4a4f62' }}>{c.nomorTelepon || '—'}</p>
                                            </td>
                                            <td>
                                                <span className={`badge ${c.isActive !== false ? 'badge-active' : 'badge-expired'}`}>
                                                    {c.isActive !== false && <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />}
                                                    {c.isActive !== false ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-display text-2xl font-extrabold" style={{ color: '#dae2fd' }}>
                                                    {(i % 5) + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="progress-bar max-w-28">
                                                    <div className="progress-fill" style={{ width: `${load}%` }} />
                                                </div>
                                                <p className="text-[10px] mt-1" style={{ color: '#4a4f62' }}>{load}% kapasitas</p>
                                            </td>
                                            <td>
                                                <button className="btn-secondary text-xs py-1.5 px-3">Lihat Detail</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {!loading && filtered.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.15)' }}>
                            <p className="text-xs" style={{ color: '#4a4f62' }}>
                                Menampilkan <span className="font-bold" style={{ color: '#dae2fd' }}>{filtered.length}</span> klien
                            </p>
                            <div className="flex gap-1">
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                                    style={{ background: '#4cd6ff', color: '#003543' }}>1</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}