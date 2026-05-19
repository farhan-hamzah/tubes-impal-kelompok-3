import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import PaketService from '../../services/PaketService';
import KontrakService from '../../services/KontrakService';


export default function KelolaPaket() {
    const [pakets, setPakets] = useState([]);
    const [kontraks, setKontraks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ namaPaket: '', spesifikasiGpu: '', jumlahCpuCore: '', kapasitasRamGb: '', storage: '', jumlahUnit: '', tarif: '', status: 'AKTIF' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [pkts, kons] = await Promise.all([
                PaketService.getAllPaket(),
                KontrakService.getAllKontrak(),
            ]);
            setPakets(Array.isArray(pkts) ? pkts : []);
            setKontraks(Array.isArray(kons) ? kons : []);
        } catch {
            setPakets([]);
            setKontraks([]);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditId(null);
        setForm({ namaPaket: '', spesifikasiGpu: '', jumlahCpuCore: '', kapasitasRamGb: '', storage: '', jumlahUnit: '', tarif: '', status: 'AKTIF' });
        setShowModal(true);
    };

    const handleSubmit = async e => {
        e.preventDefault(); setSubmitting(true);
        try {
            const payload = { ...form, jumlahCpuCore: +form.jumlahCpuCore, kapasitasRamGb: +form.kapasitasRamGb, jumlahUnit: +form.jumlahUnit, tarif: +form.tarif };
            if (editId) await PaketService.updatePaket(editId, payload);
            else await PaketService.createPaket(payload);
            setShowModal(false); load();
        } catch (err) { alert(err.message); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try { await PaketService.deletePaket(deleteTarget.paketId); load(); }
        catch (err) { alert(err.message); }
        finally { setDeleteTarget(null); }
    };

    // KPI dari data nyata
    const paketAktif = pakets.filter(p => p.status === 'AKTIF').length;
    const kontrakAktif = kontraks.filter(k => k.status === 'ACTIVE').length;
    const totalUnit = pakets.reduce((s, p) => s + (p.jumlahUnit || 0), 0);
    const utilisasiPct = totalUnit > 0 ? Math.round((kontrakAktif / totalUnit) * 100) : 0;
    const proyeksiPendapatan = kontraks
        .filter(k => k.status === 'ACTIVE')
        .reduce((s, k) => s + (k.totalBiaya || 0), 0);
    const rupiah = (n) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Rp –';

    const fields = [
        { name: 'namaPaket',      label: 'Nama Paket',       icon: 'badge',       type: 'text', placeholder: 'H100 Research Node' },
        { name: 'spesifikasiGpu', label: 'Spesifikasi GPU',   icon: 'memory',      type: 'text', placeholder: '8x NVIDIA H100 80GB' },
        { name: 'storage',        label: 'Storage',           icon: 'hard_drive',  type: 'text', placeholder: '2TB NVMe SSD' },
    ];
    const numFields = [
        { name: 'jumlahCpuCore',  label: 'CPU Core',          placeholder: '128' },
        { name: 'kapasitasRamGb', label: 'RAM (GB)',           placeholder: '1024' },
        { name: 'jumlahUnit',     label: 'Unit Tersedia',      placeholder: '10' },
        { name: 'tarif',          label: 'Tarif (Rp/Bln)',     placeholder: '15000000', step: '1000' },
    ];

    return (
        <MainLayout pageTitle="Paket Layanan">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Paket <span style={{ color: '#4cd6ff' }}>Layanan</span>
                        </h1>
                        <p className="text-sm mt-2 max-w-lg" style={{ color: '#8c90a1' }}>
                            Konfigurasi beban kerja komputasi tinggi. Tentukan tipe instansi, kepadatan GPU, dan tingkatan harga.
                        </p>
                    </div>
                    <button onClick={openCreate} className="btn-primary">
                        <span className="material-symbols-outlined">add</span> Tambah Paket Baru
                    </button>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Paket',         value: loading ? '…' : pakets.length,         icon: 'inventory_2' },
                        { label: 'Paket Aktif',         value: loading ? '…' : paketAktif,            icon: 'bolt' },
                        { label: 'Utilisasi Rata-rata', value: loading ? '…' : `${utilisasiPct}%`,    icon: 'analytics' },
                        { label: 'Proyeksi Pendapatan', value: loading ? '…' : rupiah(proyeksiPendapatan), icon: 'payments' },
                    ].map(({ label, value, icon }) => (
                        <div key={label} className="kpi-card">
                            <div className="absolute top-4 right-4 opacity-10">
                                <span className="material-symbols-outlined text-5xl" style={{ color: '#4cd6ff' }}>{icon}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-3xl font-bold" style={{ color: '#dae2fd' }}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabel */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                        <h2 className="font-display text-lg font-bold" style={{ color: '#dae2fd' }}>Manajemen Katalog</h2>
                        <button onClick={load} className="btn-secondary text-xs py-2 px-3">
                            <span className="material-symbols-outlined text-[16px]">refresh</span> Segarkan
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {['Identitas Paket', 'CPU Core', 'GPU', 'RAM / Storage', 'Tarif', 'Status', ''].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat data...</td></tr>
                                ) : pakets.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12" style={{ color: '#4a4f62' }}>Belum ada paket.</td></tr>
                                ) : pakets.map(p => (
                                    <tr key={p.paketId} className="group">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: 'rgba(76,214,255,0.1)' }}>
                                                    <span className="material-symbols-outlined icon-fill text-lg" style={{ color: '#4cd6ff' }}>dataset</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold" style={{ color: '#dae2fd' }}>{p.namaPaket}</p>
                                                    <p className="text-[10px]" style={{ color: '#4a4f62' }}>ID: {p.paketId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span style={{ color: '#dae2fd' }}>{p.jumlahCpuCore} vCPU</span></td>
                                        <td><span style={{ color: '#dae2fd' }}>{p.spesifikasiGpu || '—'}</span></td>
                                        <td>
                                            <p style={{ color: '#dae2fd' }}>{p.kapasitasRamGb} GB RAM</p>
                                            <p className="text-xs" style={{ color: '#4a4f62' }}>{p.storage}</p>
                                        </td>
                                        <td>
                                            <span className="font-bold" style={{ color: '#4cd6ff' }}>
                                                Rp {p.tarif?.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-[10px]" style={{ color: '#4a4f62' }}>/bln</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.status === 'AKTIF' ? 'badge-active' : 'badge-expired'}`}>
                                                {p.status === 'AKTIF' && <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />}
                                                {p.status} ({p.jumlahUnit})
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                <button onClick={() => {
                                                    setEditId(p.paketId);
                                                    setForm({ namaPaket: p.namaPaket, spesifikasiGpu: p.spesifikasiGpu, jumlahCpuCore: p.jumlahCpuCore, kapasitasRamGb: p.kapasitasRamGb, storage: p.storage, jumlahUnit: p.jumlahUnit, tarif: p.tarif, status: p.status });
                                                    setShowModal(true);
                                                }} className="p-2 rounded-lg hover:bg-white/5 transition-colors" style={{ color: '#4cd6ff' }}>
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => setDeleteTarget(p)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" style={{ color: '#ffb4ab' }}>
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {deleteTarget && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-sm">
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-display font-bold text-lg" style={{ color: '#ffb4ab' }}>Hapus Paket</h3>
                            <button onClick={() => setDeleteTarget(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl"
                                style={{ background: 'rgba(147,0,10,0.15)', border: '1px solid rgba(255,180,171,0.25)' }}>
                                <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5" style={{ color: '#ffb4ab' }}>warning</span>
                                <div>
                                    <p className="font-bold text-sm" style={{ color: '#ffb4ab' }}>Tindakan ini tidak dapat dibatalkan.</p>
                                    <p className="text-xs mt-1" style={{ color: '#c2c6d8' }}>
                                        Paket <strong style={{ color: '#dae2fd' }}>"{deleteTarget.namaPaket}"</strong> akan dihapus secara permanen.
                                        Kontrak aktif yang terhubung dengan paket ini mungkin akan terpengaruh.
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-xl p-3" style={{ background: '#131b2e' }}>
                                <p className="text-xs" style={{ color: '#8c90a1' }}>ID Paket: <span className="font-mono" style={{ color: '#4cd6ff' }}>{deleteTarget.paketId}</span></p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Batal</button>
                            <button onClick={handleDelete}
                                className="px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                style={{ background: 'rgba(147,0,10,0.3)', color: '#ffb4ab', border: '1px solid rgba(255,180,171,0.3)' }}>
                                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                Hapus Paket
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah / Edit Paket */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>
                                {editId ? 'Edit Paket' : 'Tambah Paket Baru'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form id="paketForm" onSubmit={handleSubmit} className="p-6 space-y-4">
                            {fields.map(({ name, label, icon, type, placeholder }) => (
                                <div key={name} className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px]" style={{ color: '#4a4f62' }}>{icon}</span>
                                        <input type={type} required value={form[name]}
                                            onChange={e => setForm({ ...form, [name]: e.target.value })}
                                            placeholder={placeholder} className="input input-icon" />
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-4">
                                {numFields.map(({ name, label, placeholder, step }) => (
                                    <div key={name} className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</label>
                                        <input type="number" step={step || '1'} required value={form[name]}
                                            onChange={e => setForm({ ...form, [name]: e.target.value })}
                                            placeholder={placeholder} className="input" />
                                    </div>
                                ))}
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                            <button type="submit" form="paketForm" disabled={submitting} className="btn-primary">
                                {submitting
                                    ? <><span className="material-symbols-outlined spin text-lg">sync</span> Menyimpan...</>
                                    : <><span className="material-symbols-outlined text-lg">save</span> Simpan</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}