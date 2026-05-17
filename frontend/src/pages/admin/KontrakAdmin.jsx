import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import KontrakService from '../../services/KontrakService';
import UserService from '../../services/UserService';
import PaketService from '../../services/PaketService';

<<<<<<< HEAD
=======
// ── Mock data fallback (demo / no backend) ───────────────────────
const MOCK_KONTRAKS = [
    { kontrakId: 'K-001', nomorKontrak: 'KTR-2024-001', namaClient: 'Budi Santoso',    namaPaket: 'H100 Research Node',      status: 'ACTIVE',        tanggalMulai: '2024-01-01', tanggalBerakhir: '2024-12-31', durasibulan: 12, totalBiaya: 540000000 },
    { kontrakId: 'K-002', nomorKontrak: 'KTR-2024-002', namaClient: 'Siti Rahayu',     namaPaket: 'A100 Enterprise Cluster', status: 'ACTIVE',        tanggalMulai: '2024-02-01', tanggalBerakhir: '2024-07-31', durasibulan:  6, totalBiaya: 168000000 },
    { kontrakId: 'K-003', nomorKontrak: 'KTR-2024-003', namaClient: 'Andi Wijaya',     namaPaket: 'RTX Pro Studio',          status: 'EXPIRING_SOON', tanggalMulai: '2024-01-01', tanggalBerakhir: '2024-04-30', durasibulan:  4, totalBiaya:  48000000 },
    { kontrakId: 'K-004', nomorKontrak: 'KTR-2024-004', namaClient: 'Dewi Lestari',    namaPaket: 'Starter GPU Node',        status: 'PENDING',       tanggalMulai: '2024-04-01', tanggalBerakhir: '2024-09-30', durasibulan:  6, totalBiaya:  27000000 },
    { kontrakId: 'K-005', nomorKontrak: 'KTR-2023-005', namaClient: 'Reza Firmansyah', namaPaket: 'V100 Legacy Compute',     status: 'EXPIRED',       tanggalMulai: '2023-06-01', tanggalBerakhir: '2023-12-31', durasibulan:  7, totalBiaya:  63000000 },
];
const MOCK_CLIENTS = [
    { userId: 'U-001', nama: 'Budi Santoso' },
    { userId: 'U-002', nama: 'Siti Rahayu' },
    { userId: 'U-003', nama: 'Andi Wijaya' },
    { userId: 'U-004', nama: 'Dewi Lestari' },
];
const MOCK_PAKETS = [
    { paketId: 'PKT-001', namaPaket: 'H100 Research Node',      tarif: 45000000 },
    { paketId: 'PKT-002', namaPaket: 'A100 Enterprise Cluster', tarif: 28000000 },
    { paketId: 'PKT-003', namaPaket: 'RTX Pro Studio',          tarif: 12000000 },
    { paketId: 'PKT-004', namaPaket: 'Starter GPU Node',        tarif:  4500000 },
];
>>>>>>> farhan

const StatusBadge = ({ status }) => {
    const map = {
        ACTIVE:        { label: 'Aktif',            cls: 'badge-active' },
        PENDING:       { label: 'Menunggu',         cls: 'badge-pending' },
        EXPIRED:       { label: 'Kedaluwarsa',      cls: 'badge-expired' },
        EXPIRING_SOON: { label: 'Segera Berakhir',  cls: 'badge-overdue' },
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
<<<<<<< HEAD
            setKontraks(Array.isArray(k) ? k : []);
            setClients(Array.isArray(c) ? c : []);
            setPakets(Array.isArray(p) ? p : []);
        } catch {
            setKontraks([]);
            setClients([]);
            setPakets([]);
=======
            setKontraks(k && k.length > 0 ? k : MOCK_KONTRAKS);
            setClients(c && c.length > 0 ? c : MOCK_CLIENTS);
            setPakets(p && p.length > 0 ? p : MOCK_PAKETS);
        } catch {
            setKontraks(MOCK_KONTRAKS);
            setClients(MOCK_CLIENTS);
            setPakets(MOCK_PAKETS);
>>>>>>> farhan
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async s => {
        setFilter(s);
<<<<<<< HEAD
        if (!s) { fetchAll(); return; }
        try {
            const data = await KontrakService.getKontrakByStatus(s);
            setKontraks(Array.isArray(data) ? data : []);
        } catch {
            setKontraks([]);
        }
=======
        if (!s) { setKontraks(MOCK_KONTRAKS); return; }
        setKontraks(MOCK_KONTRAKS.filter(k => k.status === s));
        try {
            const data = await KontrakService.getKontrakByStatus(s);
            if (data && data.length > 0) setKontraks(data);
        } catch { }
>>>>>>> farhan
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
        <MainLayout pageTitle="Daftar Kontrak">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase" style={{ color: '#4cd6ff' }}>
                            Kontrak
                        </h1>
                        <p className="text-sm mt-2 max-w-md" style={{ color: '#8c90a1' }}>
                            Manajemen siklus hidup dan pelacakan komitmen untuk retainer klien.
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

                {/* KPI Row */}
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

                {/* Filter Tabs */}
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

                {/* Table */}
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
                                            <button className="text-[10px] font-bold uppercase hover:underline" style={{ color: '#4cd6ff' }}>Detail</button>
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

            {/* Modal */}
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
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Client</label>
                                <select className="select" required value={form.clientId}
                                    onChange={e => setForm({ ...form, clientId: e.target.value })}>
                                    <option value="">Pilih Client</option>
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