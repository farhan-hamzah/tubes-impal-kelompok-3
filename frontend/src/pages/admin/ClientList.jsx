import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import UserService from '../../services/UserService';


export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    // State pengurutan
    const [sortField, setSortField] = useState('nama');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAllClients();
            setClients(Array.isArray(data) ? data : []);
        } catch {
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <span className="material-symbols-outlined text-[14px]" style={{ color: '#4a4f62' }}>unfold_more</span>;
        return <span className="material-symbols-outlined text-[14px]" style={{ color: '#4cd6ff' }}>{sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>;
    };

    const filtered = clients
        .filter(c =>
            c.nama?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            let va = a[sortField] ?? '';
            let vb = b[sortField] ?? '';
            if (sortField === 'isActive') { va = a.isActive !== false ? 1 : 0; vb = b.isActive !== false ? 1 : 0; }
            const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
            return sortDir === 'asc' ? cmp : -cmp;
        });

    return (
        <MainLayout pageTitle="Manajemen Klien">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Manajemen <span style={{ color: '#4cd6ff' }}>Klien</span>
                        </h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Pantau alokasi sumber daya, kesehatan kontrak, dan performa klien di seluruh klaster.
                        </p>
                    </div>
                </div>

                {/* KPI Snapshot */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                        { icon: 'monitoring', label: 'Utilisasi Global', value: '–' },
                        { icon: 'account_balance', label: 'Proyeksi ARR', value: '–' },
                        { icon: 'security', label: 'Insiden Terbuka', value: '–' },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="kpi-card">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>{icon}</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-4xl font-extrabold" style={{ color: '#dae2fd' }}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Kontrol Tabel */}
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
                        <button onClick={load} className="btn-secondary py-2 px-3">
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                        </button>
                    </div>
                </div>

                {/* Tabel */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        <button onClick={() => toggleSort('nama')} className="flex items-center gap-1 hover:opacity-80">
                                            Nama Klien <SortIcon field="nama" />
                                        </button>
                                    </th>
                                    <th>
                                        <button onClick={() => toggleSort('email')} className="flex items-center gap-1 hover:opacity-80">
                                            Kontak <SortIcon field="email" />
                                        </button>
                                    </th>
                                    <th>
                                        <button onClick={() => toggleSort('isActive')} className="flex items-center gap-1 hover:opacity-80">
                                            Status <SortIcon field="isActive" />
                                        </button>
                                    </th>
                                    <th>Kontrak</th>
                                    <th>Beban Komputasi</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat data klien...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Tidak ada klien ditemukan.</td></tr>
                                ) : filtered.map((c, i) => {
                                    const beban = (i % 5 + 1) * 15;
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
                                                    <div className="progress-fill" style={{ width: `${beban}%` }} />
                                                </div>
                                                <p className="text-[10px] mt-1" style={{ color: '#4a4f62' }}>{beban}% kapasitas</p>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => setSelectedClient(c)}
                                                    className="btn-secondary text-xs py-1.5 px-3">
                                                    Lihat Detail
                                                </button>
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

            {/* Modal Detail Klien */}
            {selectedClient && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Detail Klien</h3>
                                <p className="text-xs font-mono mt-0.5" style={{ color: '#4cd6ff' }}>
                                    CLI-{String(selectedClient.userId).padStart(3, '0')}
                                </p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0"
                                    style={{ background: 'rgba(76,214,255,0.1)', color: '#4cd6ff', border: '1px solid rgba(76,214,255,0.2)' }}>
                                    {selectedClient.nama?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-display font-bold text-xl" style={{ color: '#dae2fd' }}>{selectedClient.nama}</p>
                                    <span className={`badge mt-1 ${selectedClient.isActive !== false ? 'badge-active' : 'badge-expired'}`}>
                                        {selectedClient.isActive !== false ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-xl p-4 space-y-3" style={{ background: '#131b2e' }}>
                                {[
                                    ['Email', selectedClient.email || '—'],
                                    ['Telepon', selectedClient.nomorTelepon || '—'],
                                    ['Perusahaan', selectedClient.perusahaan || '—'],
                                    ['ID Pengguna', selectedClient.userId || '—'],
                                    ['Peran', selectedClient.role || '—'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span style={{ color: '#8c90a1' }}>{k}</span>
                                        <span className="font-semibold text-right max-w-xs" style={{ color: '#dae2fd' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setSelectedClient(null)} className="btn-secondary">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}