import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import KontrakService from '../../services/KontrakService';
import UserService from '../../services/UserService';
import PaketService from '../../services/PaketService';


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

export default function KontrakAdmin() {
    const { user } = useAuth();
    const [kontraks, setKontraks] = useState([]);
    const [clients, setClients] = useState([]);
    const [pakets, setPakets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [selectedKontrak, setSelectedKontrak] = useState(null);
    const [form, setForm] = useState({ clientId: '', paketId: '', tanggalMulai: '', durasibulan: '', catatan: '' });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [k, c, p] = await Promise.all([
                KontrakService.getAllKontrak(),
                UserService.getAllClients(),
                PaketService.getAllPaket(),
            ]);
            setKontraks(Array.isArray(k) ? k : []);
            setClients(Array.isArray(c) ? c : []);
            setPakets(Array.isArray(p) ? p : []);
        } catch {
            setKontraks([]);
            setClients([]);
            setPakets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async s => {
        setFilter(s);
        if (!s) { fetchAll(); return; }
        try {
            const data = await KontrakService.getKontrakByStatus(s);
            setKontraks(Array.isArray(data) ? data : []);
        } catch {
            setKontraks([]);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await KontrakService.createKontrakAdmin({ ...form, adminId: user?.adminId });
            setShowModal(false);
            setForm({ clientId: '', paketId: '', tanggalMulai: '', durasibulan: '', catatan: '' });
            fetchAll();
        } catch (err) { setError(err.message); }
        finally { setSubmitting(false); }
    };

    const totalBiaya = kontraks.reduce((a, k) => a + (k.totalBiaya || 0), 0);
    const activeCount = kontraks.filter(k => k.status === 'ACTIVE').length;
    const pendingCount = kontraks.filter(k => k.status === 'PENDING').length;

    const filters = [
        { val: '', label: 'Semua' },
        { val: 'ACTIVE', label: 'Aktif' },
        { val: 'PENDING', label: 'Menunggu' },
        { val: 'EXPIRING_SOON', label: 'Segera Berakhir' },
        { val: 'EXPIRED', label: 'Kedaluwarsa' },
    ];

    return (
        <MainLayout pageTitle="Kontrak">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase" style={{ color: '#4cd6ff' }}>
                            Kontrak
                        </h1>
                        <p className="text-sm mt-2 max-w-md" style={{ color: '#8c90a1' }}>
                            Manajemen siklus hidup dan pemantauan komitmen layanan klien.
                        </p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        <span className="material-symbols-outlined">add</span> Kontrak Baru
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl text-sm font-medium fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab', color: '#ffb4ab' }}>
                        {error}
                    </div>
                )}

                {/* KPI */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="kpi-card col-span-2 lg:col-span-2 border-l-4" style={{ borderLeftColor: '#4cd6ff' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#8c90a1' }}>Total Komitmen</p>
                        <p className="font-display text-3xl font-black" style={{ color: '#dae2fd' }}>
                            Rp {totalBiaya.toLocaleString('id-ID')}
                        </p>
                        <div className="progress-bar mt-4"><div className="progress-fill" style={{ width: '78%' }} /></div>
                    </div>
                    <div className="kpi-card">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#8c90a1' }}>Aktif</p>
                        <p className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{activeCount}</p>
                    </div>
                    <div className="kpi-card">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#8c90a1' }}>Menunggu</p>
                        <p className="font-display text-3xl font-bold" style={{ color: '#cdbdff' }}>{pendingCount}</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                    {filters.map(({ val, label }) => (
                        <button key={val} onClick={() => handleFilter(val)}
                            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={filter === val
                                ? { background: '#4cd6ff', color: '#003543' }
                                : { background: '#171f33', color: '#8c90a1', border: '1px solid rgba(66,70,86,0.3)' }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tabel */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table" style={{ minWidth: 760 }}>
                            <thead>
                                <tr>
                                    {['ID Kontrak', 'Klien & Paket', 'Status', 'Lini Masa', 'Total Biaya', ''].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat kontrak...</td></tr>
                                ) : kontraks.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12" style={{ color: '#4a4f62' }}>Belum ada kontrak.</td></tr>
                                ) : kontraks.map((k, i) => (
                                    <tr key={k.kontrakId || i}>
                                        <td><span className="font-mono text-xs" style={{ color: '#4cd6ff' }}>{k.nomorKontrak}</span></td>
                                        <td>
                                            <p className="font-semibold" style={{ color: '#dae2fd' }}>{k.namaClient}</p>
                                            <p className="text-[10px]" style={{ color: '#4a4f62' }}>{k.namaPaket}</p>
                                        </td>
                                        <td><StatusBadge status={k.status} /></td>
                                        <td>
                                            <p className="text-xs" style={{ color: '#c2c6d8' }}>{k.tanggalMulai} — {k.tanggalBerakhir}</p>
                                            <div className="progress-bar max-w-24 mt-1.5">
                                                <div className="progress-fill"
                                                    style={{ width: k.status === 'EXPIRED' ? '100%' : k.status === 'PENDING' ? '10%' : '55%' }} />
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-display font-bold" style={{ color: '#dae2fd' }}>
                                                Rp {k.totalBiaya?.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedKontrak(k)}
                                                className="btn-secondary text-xs py-1.5 px-3">
                                                <span className="material-symbols-outlined text-[15px]">visibility</span>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && (
                        <div className="px-6 py-4 text-xs font-bold uppercase tracking-wider"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.15)', color: '#4a4f62' }}>
                            Menampilkan {kontraks.length} kontrak
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Kontrak */}
            {selectedKontrak && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Detail Kontrak</h3>
                                <p className="text-xs font-mono mt-0.5" style={{ color: '#4cd6ff' }}>{selectedKontrak.nomorKontrak}</p>
                            </div>
                            <button onClick={() => setSelectedKontrak(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ background: 'rgba(76,214,255,0.08)', border: '1px solid rgba(76,214,255,0.2)' }}>
                                <StatusBadge status={selectedKontrak.status} />
                            </div>
                            <div className="rounded-xl p-4 space-y-3" style={{ background: '#131b2e' }}>
                                {[
                                    ['Klien', selectedKontrak.namaClient || '—'],
                                    ['Paket', selectedKontrak.namaPaket || '—'],
                                    ['Tanggal Mulai', selectedKontrak.tanggalMulai || '—'],
                                    ['Tanggal Berakhir', selectedKontrak.tanggalBerakhir || '—'],
                                    ['Durasi', selectedKontrak.durasibulan ? `${selectedKontrak.durasibulan} bulan` : '—'],
                                    ['Catatan', selectedKontrak.catatan || '—'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span style={{ color: '#8c90a1' }}>{k}</span>
                                        <span className="font-semibold text-right max-w-xs" style={{ color: '#dae2fd' }}>{v}</span>
                                    </div>
                                ))}
                                <div className="h-px" style={{ background: 'rgba(66,70,86,0.3)' }} />
                                <div className="flex justify-between">
                                    <span className="font-bold text-sm" style={{ color: '#8c90a1' }}>Total Biaya</span>
                                    <span className="font-display font-bold text-xl" style={{ color: '#4cd6ff' }}>
                                        Rp {selectedKontrak.totalBiaya?.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setSelectedKontrak(null)} className="btn-secondary">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Buat Kontrak */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Buat Kontrak Baru</h3>
                            <button onClick={() => setShowModal(false)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form id="kontrakForm" onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Klien</label>
                                <select className="select" required value={form.clientId}
                                    onChange={e => setForm({ ...form, clientId: e.target.value })}>
                                    <option value="">Pilih Klien</option>
                                    {clients.map(c => <option key={c.userId} value={c.userId}>{c.nama}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Paket HPC</label>
                                <select className="select" required value={form.paketId}
                                    onChange={e => setForm({ ...form, paketId: e.target.value })}>
                                    <option value="">Pilih Paket</option>
                                    {pakets.map(p => (
                                        <option key={p.paketId} value={p.paketId}>
                                            {p.namaPaket} — Rp {p.tarif?.toLocaleString('id-ID')}/bln
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Tanggal Mulai</label>
                                    <input type="date" required value={form.tanggalMulai}
                                        onChange={e => setForm({ ...form, tanggalMulai: e.target.value })}
                                        className="input" style={{ colorScheme: 'dark' }} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Durasi (Bulan)</label>
                                    <input type="number" min="1" required value={form.durasibulan}
                                        onChange={e => setForm({ ...form, durasibulan: e.target.value })}
                                        placeholder="12" className="input" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Catatan</label>
                                <textarea rows={3} value={form.catatan}
                                    onChange={e => setForm({ ...form, catatan: e.target.value })}
                                    className="input resize-none" />
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                            <button type="submit" form="kontrakForm" disabled={submitting} className="btn-primary">
                                {submitting ? <><span className="material-symbols-outlined spin text-lg">sync</span> Menyimpan...</> : 'Simpan Kontrak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}