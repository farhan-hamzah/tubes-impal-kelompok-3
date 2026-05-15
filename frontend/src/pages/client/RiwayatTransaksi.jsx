import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/InvoiceService';

// ── Helpers ──────────────────────────────────────────────────────
const rupiah = (n) =>
    n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Rp –';

const tgl = (d) => {
    if (!d) return '–';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};


const STATUS_CONFIG = {
    PAID:    { label: 'Lunas',        bg: 'rgba(76,214,255,0.12)',  color: '#4cd6ff',  icon: 'check_circle' },
    UNPAID:  { label: 'Belum Bayar',  bg: 'rgba(205,189,255,0.12)', color: '#cdbdff', icon: 'pending' },
    OVERDUE: { label: 'Jatuh Tempo',  bg: 'rgba(255,180,171,0.12)', color: '#ffb4ab', icon: 'warning' },
};

const METODE_OPTIONS = [
    'Transfer Bank BCA',
    'Transfer Bank Mandiri',
    'Transfer Bank BRI',
    'Transfer Bank BNI',
    'Virtual Account',
    'QRIS / GoPay / OVO',
    'Kartu Kredit',
];

export default function RiwayatTransaksi() {
    const { user } = useAuth();
    const fileRef = useRef();

    const [invoices, setInvoices]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [selected, setSelected]     = useState(null);   // invoice detail modal
    const [payModal, setPayModal]     = useState(null);   // payment form modal
    const [filterStatus, setFilter]   = useState('ALL');

    // Payment form state
    const [buktiFile, setBuktiFile]   = useState(null);
    const [metode, setMetode]         = useState(METODE_OPTIONS[0]);
    const [submitting, setSubmitting] = useState(false);
    const [doneId, setDoneId]         = useState(null);

    useEffect(() => { load(); }, [user]);

    const load = async () => {
        setLoading(true);
        try {
            const data = user?.clientId
                ? await invoiceService.getInvoiceByClient(user.clientId)
                : [];
            setInvoices(Array.isArray(data) ? data : []);
        } catch {
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filterStatus === 'ALL'
        ? invoices
        : invoices.filter(inv => inv.statusPembayaran === filterStatus);

    const totalTagihan = invoices.reduce((s, i) => s + (i.jumlahTagihan || 0), 0);
    const totalLunas   = invoices.filter(i => i.statusPembayaran === 'PAID').reduce((s, i) => s + (i.jumlahTagihan || 0), 0);
    const totalBelum   = invoices.filter(i => i.statusPembayaran !== 'PAID').reduce((s, i) => s + (i.jumlahTagihan || 0), 0);

    const handleFileChange = e => {
        const f = e.target.files[0];
        if (f) setBuktiFile(f);
    };

    const handlePay = async e => {
        e.preventDefault();
        if (!buktiFile) return alert('Pilih file bukti pembayaran.');
        setSubmitting(true);
        try {
            if (user?.clientId !== 'CLIENT-001') {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64 = reader.result.split(',')[1];
                    await invoiceService.uploadBuktiPembayaran(payModal.invoiceId, base64);
                    finalizePayment();
                };
                reader.readAsDataURL(buktiFile);
            } else {
                // Demo mode
                await new Promise(r => setTimeout(r, 800));
                finalizePayment();
            }
        } catch (err) {
            alert('Gagal mengupload: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const finalizePayment = () => {
        setDoneId(payModal.invoiceId);
        setInvoices(prev => prev.map(inv =>
            inv.invoiceId === payModal.invoiceId
                ? { ...inv, statusPembayaran: 'PAID', metodePembayaran: metode, tanggalBayar: new Date().toISOString().split('T')[0] }
                : inv
        ));
        setPayModal(null);
        setBuktiFile(null);
    };

    return (
        <MainLayout pageTitle="Riwayat Transaksi">
            <div className="space-y-8">

                {/* ── Header ── */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>
                        Keuangan / Invoice
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                        Riwayat <span style={{ color: '#4cd6ff' }}>Transaksi</span>
                    </h1>
                    <p className="text-sm mt-2" style={{ color: '#8c90a1' }}>
                        Kelola invoice, unggah bukti pembayaran, dan pantau status tagihan layanan Anda.
                    </p>
                </div>

                {/* ── Success Banner ── */}
                {doneId && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>check_circle</span>
                        <p className="text-sm font-medium" style={{ color: '#4cd6ff' }}>
                            Bukti pembayaran berhasil diunggah! Tim kami akan memverifikasi dalam 1×24 jam.
                        </p>
                        <button onClick={() => setDoneId(null)} className="ml-auto" style={{ color: '#4a4f62' }}>
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* ── KPI Summary ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Tagihan', value: rupiah(totalTagihan), color: '#dae2fd', icon: 'receipt_long', bg: 'rgba(218,226,253,0.06)' },
                        { label: 'Sudah Lunas', value: rupiah(totalLunas),   color: '#4cd6ff',  icon: 'check_circle', bg: 'rgba(76,214,255,0.08)' },
                        { label: 'Belum Dibayar', value: rupiah(totalBelum), color: '#ffb4ab',  icon: 'error',        bg: 'rgba(255,180,171,0.08)' },
                    ].map(({ label, value, color, icon, bg }) => (
                        <div key={label} className="kpi-card flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: bg }}>
                                <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</p>
                                <p className="font-display text-xl font-bold mt-0.5 truncate" style={{ color }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filter Tabs ── */}
                <div className="flex gap-2 flex-wrap">
                    {[['ALL','Semua'], ['UNPAID','Belum Bayar'], ['OVERDUE','Jatuh Tempo'], ['PAID','Lunas']].map(([val, lbl]) => (
                        <button key={val} onClick={() => setFilter(val)}
                            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                            style={filterStatus === val
                                ? { background: 'rgba(76,214,255,0.15)', color: '#4cd6ff', border: '1px solid rgba(76,214,255,0.35)' }
                                : { background: '#131b2e', color: '#8c90a1', border: '1px solid rgba(66,70,86,0.25)' }}>
                            {lbl}
                            <span className="ml-2 px-1.5 py-0.5 rounded-md text-[9px]"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {val === 'ALL' ? invoices.length : invoices.filter(i => i.statusPembayaran === val).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── Invoice Table ── */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {['No. Invoice', 'Paket / Kontrak', 'Periode', 'Jatuh Tempo', 'Jumlah', 'Status', 'Aksi'].map(h =>
                                        <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-16" style={{ color: '#4a4f62' }}>
                                        <span className="material-symbols-outlined spin text-3xl block mx-auto mb-2">sync</span>
                                        Memuat data invoice...
                                    </td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-16" style={{ color: '#4a4f62' }}>
                                        <span className="material-symbols-outlined text-4xl block mx-auto mb-2">receipt_long</span>
                                        Tidak ada invoice
                                    </td></tr>
                                ) : filtered.map((inv) => {
                                    const sc = STATUS_CONFIG[inv.statusPembayaran] || STATUS_CONFIG.UNPAID;
                                    const needsPay = inv.statusPembayaran === 'UNPAID' || inv.statusPembayaran === 'OVERDUE';
                                    return (
                                        <tr key={inv.invoiceId}>
                                            <td>
                                                <p className="font-mono text-xs font-bold" style={{ color: '#4cd6ff' }}>{inv.nomorInvoice}</p>
                                                <p className="text-[10px] mt-0.5" style={{ color: '#4a4f62' }}>{inv.nomorKontrak}</p>
                                            </td>
                                            <td>
                                                <p className="font-semibold text-sm" style={{ color: '#dae2fd' }}>
                                                    {inv.namaPaket || 'Paket Layanan'}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="text-xs" style={{ color: '#c2c6d8' }}>{tgl(inv.tagihanMulai)}</p>
                                                <p className="text-[10px]" style={{ color: '#4a4f62' }}>s/d {tgl(inv.tagihanAkhir)}</p>
                                            </td>
                                            <td>
                                                <p className="text-sm font-semibold"
                                                    style={{ color: inv.statusPembayaran === 'OVERDUE' ? '#ffb4ab' : '#c2c6d8' }}>
                                                    {tgl(inv.tanggalJatuhTempo)}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="font-display text-base font-bold" style={{ color: '#dae2fd' }}>
                                                    {rupiah(inv.jumlahTagihan)}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="badge flex items-center gap-1.5 w-fit"
                                                    style={{ background: sc.bg, color: sc.color }}>
                                                    <span className="material-symbols-outlined text-[14px]">{sc.icon}</span>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setSelected(inv)}
                                                        className="btn-secondary text-xs py-1.5 px-3">
                                                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                                                        Detail
                                                    </button>
                                                    {needsPay && (
                                                        <button onClick={() => { setPayModal(inv); setBuktiFile(null); setMetode(METODE_OPTIONS[0]); }}
                                                            className="btn-primary text-xs py-1.5 px-3">
                                                            <span className="material-symbols-outlined text-[15px]">upload</span>
                                                            Bayar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ══ MODAL: Invoice Detail ══ */}
            {selected && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Detail Invoice</h3>
                                <p className="text-xs font-mono mt-0.5" style={{ color: '#4cd6ff' }}>{selected.nomorInvoice}</p>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Status Banner */}
                            {(() => {
                                const sc = STATUS_CONFIG[selected.statusPembayaran] || STATUS_CONFIG.UNPAID;
                                return (
                                    <div className="flex items-center gap-3 p-4 rounded-xl"
                                        style={{ background: sc.bg, border: `1px solid ${sc.color}30` }}>
                                        <span className="material-symbols-outlined text-2xl" style={{ color: sc.color }}>{sc.icon}</span>
                                        <div>
                                            <p className="font-bold text-sm" style={{ color: sc.color }}>{sc.label}</p>
                                            {selected.tanggalBayar && (
                                                <p className="text-xs" style={{ color: '#8c90a1' }}>Dibayar: {tgl(selected.tanggalBayar)}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Info Grid */}
                            <div className="rounded-xl p-4 space-y-3" style={{ background: '#131b2e' }}>
                                {[
                                    ['No. Kontrak', selected.nomorKontrak],
                                    ['Paket Layanan', selected.namaPaket || 'Paket Layanan'],
                                    ['Periode Tagihan', `${tgl(selected.tagihanMulai)} – ${tgl(selected.tagihanAkhir)}`],
                                    ['Jatuh Tempo', tgl(selected.tanggalJatuhTempo)],
                                    ['Metode Bayar', selected.metodePembayaran || '–'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-sm">
                                        <span style={{ color: '#8c90a1' }}>{k}</span>
                                        <span className="font-semibold text-right max-w-48" style={{ color: '#dae2fd' }}>{v}</span>
                                    </div>
                                ))}
                                <div className="h-px" style={{ background: 'rgba(66,70,86,0.3)' }} />
                                <div className="flex justify-between">
                                    <span className="font-bold text-sm" style={{ color: '#8c90a1' }}>Total Tagihan</span>
                                    <span className="font-display font-bold text-xl" style={{ color: '#4cd6ff' }}>
                                        {rupiah(selected.jumlahTagihan)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            {(selected.statusPembayaran === 'UNPAID' || selected.statusPembayaran === 'OVERDUE') && (
                                <button onClick={() => { setPayModal(selected); setSelected(null); setBuktiFile(null); }}
                                    className="btn-primary">
                                    <span className="material-symbols-outlined text-[18px]">upload</span>
                                    Upload Bukti Bayar
                                </button>
                            )}
                            <button onClick={() => setSelected(null)} className="btn-secondary">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL: Upload Pembayaran ══ */}
            {payModal && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Upload Bukti Pembayaran</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#4cd6ff' }}>{payModal.nomorInvoice}</p>
                            </div>
                            <button onClick={() => setPayModal(null)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form id="payForm" onSubmit={handlePay} className="p-6 space-y-5">
                            {/* Invoice Summary */}
                            <div className="rounded-xl p-4 flex justify-between items-center"
                                style={{ background: '#131b2e' }}>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4f62' }}>Total Pembayaran</p>
                                    <p className="font-display text-2xl font-bold mt-1" style={{ color: '#4cd6ff' }}>
                                        {rupiah(payModal.jumlahTagihan)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4a4f62' }}>Jatuh Tempo</p>
                                    <p className="text-sm font-bold mt-1"
                                        style={{ color: payModal.statusPembayaran === 'OVERDUE' ? '#ffb4ab' : '#c2c6d8' }}>
                                        {tgl(payModal.tanggalJatuhTempo)}
                                    </p>
                                </div>
                            </div>

                            {/* Metode Pembayaran */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>
                                    Metode Pembayaran
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]"
                                        style={{ color: '#4a4f62' }}>account_balance</span>
                                    <select value={metode} onChange={e => setMetode(e.target.value)}
                                        className="input input-icon appearance-none pr-10"
                                        style={{ colorScheme: 'dark' }}>
                                        {METODE_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none"
                                        style={{ color: '#4a4f62' }}>expand_more</span>
                                </div>
                            </div>

                            {/* Rekening Tujuan */}
                            <div className="rounded-xl p-4 space-y-2" style={{ background: '#131b2e', border: '1px solid rgba(76,214,255,0.1)' }}>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4cd6ff' }}>
                                    Info Rekening Tujuan
                                </p>
                                {[
                                    ['Bank', 'PT TensorLease Indonesia'],
                                    ['No. Rekening', '1234-5678-9012'],
                                    ['Atas Nama', 'PT TensorLease Indonesia'],
                                    ['Berita', payModal.nomorInvoice],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-xs">
                                        <span style={{ color: '#8c90a1' }}>{k}</span>
                                        <span className="font-bold font-mono" style={{ color: '#dae2fd' }}>{v}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Upload File */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>
                                    Bukti Transfer (JPG / PNG / PDF)
                                </label>
                                <div
                                    onClick={() => fileRef.current.click()}
                                    className="w-full rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition-all"
                                    style={{
                                        border: `2px dashed ${buktiFile ? 'rgba(76,214,255,0.5)' : 'rgba(66,70,86,0.5)'}`,
                                        background: buktiFile ? 'rgba(76,214,255,0.04)' : 'transparent',
                                    }}>
                                    {buktiFile ? (
                                        <>
                                            <span className="material-symbols-outlined text-3xl mb-2" style={{ color: '#4cd6ff' }}>task</span>
                                            <p className="text-sm font-bold" style={{ color: '#4cd6ff' }}>{buktiFile.name}</p>
                                            <p className="text-[10px] mt-1" style={{ color: '#8c90a1' }}>
                                                {(buktiFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-3xl mb-2" style={{ color: '#4a4f62' }}>cloud_upload</span>
                                            <p className="text-sm" style={{ color: '#8c90a1' }}>Klik untuk memilih file</p>
                                            <p className="text-[10px] mt-1" style={{ color: '#4a4f62' }}>Maks. 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*,.pdf"
                                    className="hidden" onChange={handleFileChange} />
                            </div>
                        </form>

                        <div className="flex justify-end gap-3 px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setPayModal(null)} className="btn-secondary">Batal</button>
                            <button type="submit" form="payForm" disabled={submitting || !buktiFile}
                                className="btn-primary"
                                style={!buktiFile ? { opacity: 0.5 } : {}}>
                                {submitting
                                    ? <><span className="material-symbols-outlined spin text-lg">sync</span> Mengunggah...</>
                                    : <><span className="material-symbols-outlined text-lg">send</span> Konfirmasi Pembayaran</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}