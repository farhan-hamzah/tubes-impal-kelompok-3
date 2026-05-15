import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';
import KontrakService from '../../services/KontrakService';

const rupiah = (n) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Rp –';
const tgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '–';


const StatusBadge = ({ status }) => {
    const map = { PAID: 'badge-paid', UNPAID: 'badge-unpaid', OVERDUE: 'badge-overdue' };
    const labels = { PAID: 'Lunas', UNPAID: 'Belum Bayar', OVERDUE: 'Jatuh Tempo' };
    return <span className={`badge ${map[status] || 'badge-expired'}`}>{labels[status] || status}</span>;
};

export default function InvoiceAdmin() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [kontraks, setKontraks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [validasiId, setValidasiId] = useState(null);
    const [previewBukti, setPreviewBukti] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ kontrakId: '', tagihanMulai: '', tagihanAkhir: '', tanggalJatuhTempo: '' });
    const [formVal, setFormVal] = useState({ jumlahDibayar: '', metodePembayaran: '' });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [inv, k] = await Promise.all([
                invoiceService.getAllInvoice(),
                KontrakService.getAllKontrak(),
            ]);
            setInvoices(Array.isArray(inv) ? inv : []);
            const aktif = (Array.isArray(k) ? k : []).filter(x => x.status === 'ACTIVE');
            setKontraks(aktif);
        } catch {
            setInvoices([]);
            setKontraks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async s => {
        setFilter(s);
        if (!s) { fetchAll(); return; }
        try {
            const data = await invoiceService.getInvoiceByStatus(s);
            setInvoices(Array.isArray(data) ? data : []);
        } catch {
            setInvoices([]);
        }
    };

    const handleCreate = async e => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await invoiceService.createInvoice(form);
            setShowCreate(false);
            setForm({ kontrakId: '', tagihanMulai: '', tagihanAkhir: '', tanggalJatuhTempo: '' });
            fetchAll();
        } catch (err) { setError(err.message); }
        finally { setSubmitting(false); }
    };

    const handleValidasi = async e => {
        e.preventDefault(); setError(''); setSubmitting(true);
        try {
            await invoiceService.validasiPembayaran(user?.adminId, {
                invoiceId: validasiId, ...formVal
            });
            setValidasiId(null);
            setFormVal({ jumlahDibayar: '', metodePembayaran: '' });
            fetchAll();
        } catch (err) { setError(err.message); }
        finally { setSubmitting(false); }
    };

    const paid = invoices.filter(i => i.statusPembayaran === 'PAID').length;
    const unpaid = invoices.filter(i => i.statusPembayaran === 'UNPAID').length;
    const overdue = invoices.filter(i => i.statusPembayaran === 'OVERDUE').length;
    const totalTagihan = invoices.reduce((a, i) => a + (i.jumlahTagihan || 0), 0);

    const filters = [
        { val: '', label: 'Semua' }, { val: 'PAID', label: 'Lunas' },
        { val: 'UNPAID', label: 'Belum Bayar' }, { val: 'OVERDUE', label: 'Jatuh Tempo' },
    ];

    return (
        <MainLayout pageTitle="Faktur & Pembayaran">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase" style={{ color: '#4cd6ff' }}>Invoice</h1>
                        <p className="text-sm mt-2 max-w-md" style={{ color: '#8c90a1' }}>Kelola faktur, validasi pembayaran, dan rekonsiliasi keuangan.</p>
                    </div>
                    <button onClick={() => setShowCreate(true)} className="btn-primary">
                        <span className="material-symbols-outlined">add</span> Buat Invoice
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl text-sm font-medium"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab', color: '#ffb4ab' }}>
                        {error}
                    </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Tagihan', value: `Rp ${totalTagihan.toLocaleString('id-ID')}`, accent: '#4cd6ff' },
                        { label: 'Lunas', value: paid, accent: '#4cd6ff' },
                        { label: 'Belum Bayar', value: unpaid, accent: '#ffb59d' },
                        { label: 'Jatuh Tempo', value: overdue, accent: '#ffb4ab' },
                    ].map(({ label, value, accent }) => (
                        <div key={label} className="kpi-card">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8c90a1' }}>{label}</p>
                            <p className="font-display text-3xl font-bold" style={{ color: accent }}>{value}</p>
                        </div>
                    ))}
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

                {/* Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table" style={{ minWidth: 900 }}>
                            <thead>
                                <tr>
                                    {['No. Invoice', 'Client', 'Kontrak', 'Periode', 'Jumlah', 'Jatuh Tempo', 'Status', 'Bukti', ''].map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={9} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat invoice...</td></tr>
                                ) : invoices.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-12" style={{ color: '#4a4f62' }}>Belum ada invoice.</td></tr>
                                ) : invoices.map((inv, i) => (
                                    <tr key={inv.invoiceId || i}>
                                        <td><span className="font-mono text-xs" style={{ color: '#4cd6ff' }}>{inv.nomorInvoice}</span></td>
                                        <td><span style={{ color: '#dae2fd' }}>{inv.namaClient}</span></td>
                                        <td><span className="font-mono text-xs" style={{ color: '#8c90a1' }}>{inv.nomorKontrak}</span></td>
                                        <td><span className="text-xs" style={{ color: '#c2c6d8' }}>{inv.tagihanMulai} s/d {inv.tagihanAkhir}</span></td>
                                        <td>
                                            <span className="font-bold" style={{ color: '#dae2fd' }}>
                                                Rp {inv.jumlahTagihan?.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td><span className="text-sm" style={{ color: '#c2c6d8' }}>{inv.tanggalJatuhTempo}</span></td>
                                        <td><StatusBadge status={inv.statusPembayaran} /></td>
                                        <td>
                                            {inv.buktiPembayaran ? (
                                                <button onClick={() => setPreviewBukti(inv.buktiPembayaran)}
                                                    className="text-xs font-bold hover:underline" style={{ color: '#4cd6ff' }}>
                                                    Lihat Bukti
                                                </button>
                                            ) : <span style={{ color: '#4a4f62', fontSize: '0.75rem' }}>Belum ada</span>}
                                        </td>
                                        <td>
                                            {inv.statusPembayaran === 'UNPAID' && inv.buktiPembayaran && (
                                                <button
                                                    onClick={() => { setValidasiId(inv.invoiceId); setFormVal({ jumlahDibayar: inv.jumlahTagihan, metodePembayaran: '' }); }}
                                                    className="btn-primary text-xs py-1.5 px-3">
                                                    Validasi
                                                </button>
                                            )}
                                            {inv.statusPembayaran === 'UNPAID' && !inv.buktiPembayaran && (
                                                <span className="text-xs" style={{ color: '#4a4f62' }}>Menunggu bukti</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Buat Invoice */}
            {showCreate && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Buat Invoice</h3>
                            <button onClick={() => setShowCreate(false)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form id="invForm" onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Kontrak Aktif</label>
                                <select className="select" required value={form.kontrakId}
                                    onChange={e => setForm({ ...form, kontrakId: e.target.value })}>
                                    <option value="">Pilih Kontrak</option>
                                    {kontraks.map(k => (
                                        <option key={k.kontrakId} value={k.kontrakId}>
                                            {k.nomorKontrak} — {k.namaClient}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {[
                                { name: 'tagihanMulai', label: 'Tagihan Mulai' },
                                { name: 'tagihanAkhir', label: 'Tagihan Akhir' },
                                { name: 'tanggalJatuhTempo', label: 'Jatuh Tempo' },
                            ].map(({ name, label }) => (
                                <div key={name} className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</label>
                                    <input type="date" required value={form[name]}
                                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                                        className="input" style={{ colorScheme: 'dark' }} />
                                </div>
                            ))}
                        </form>
                        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setShowCreate(false)} className="btn-secondary">Batal</button>
                            <button type="submit" form="invForm" disabled={submitting} className="btn-primary">
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Validasi */}
            {validasiId && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Validasi Pembayaran</h3>
                            <button onClick={() => setValidasiId(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form id="valForm" onSubmit={handleValidasi} className="p-6 space-y-4">
                            <p className="text-sm" style={{ color: '#8c90a1' }}>Pastikan bukti transfer sudah diverifikasi sebelum konfirmasi.</p>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Jumlah Dibayar</label>
                                <input type="number" required value={formVal.jumlahDibayar}
                                    onChange={e => setFormVal({ ...formVal, jumlahDibayar: e.target.value })}
                                    className="input" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Metode Pembayaran</label>
                                <select className="select" required value={formVal.metodePembayaran}
                                    onChange={e => setFormVal({ ...formVal, metodePembayaran: e.target.value })}>
                                    <option value="">Pilih Metode</option>
                                    <option value="Transfer Bank">Transfer Bank</option>
                                    <option value="Virtual Account">Virtual Account</option>
                                    <option value="QRIS">QRIS</option>
                                </select>
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setValidasiId(null)} className="btn-secondary">Batal</button>
                            <button type="submit" form="valForm" disabled={submitting} className="btn-primary">
                                {submitting ? 'Memproses...' : 'Konfirmasi Lunas'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Preview Bukti */}
            {previewBukti && (
                <div className="modal-overlay" onClick={() => setPreviewBukti(null)}>
                    <div className="modal-box max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <h3 className="font-bold" style={{ color: '#dae2fd' }}>Bukti Pembayaran</h3>
                            <button onClick={() => setPreviewBukti(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-4">
                            {previewBukti.startsWith('data:image') ? (
                                <img src={previewBukti} alt="Bukti" className="w-full rounded-xl" />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm mb-3" style={{ color: '#8c90a1' }}>File PDF tidak bisa dipreview.</p>
                                    <a href={previewBukti} download className="btn-primary">Download</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}