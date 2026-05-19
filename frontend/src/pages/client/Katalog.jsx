import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import PaketService from '../../services/PaketService';
import KontrakService from '../../services/KontrakService';

// ── Mock data fallback (demo / no-backend mode) ─────────────────
const MOCK_PAKETS = [
    {
        paketId: 'PKT-001',
        namaPaket: 'H100 Research Node',
        spesifikasiGpu: '8× NVIDIA H100 80GB SXM5',
        jumlahCpuCore: 128,
        kapasitasRamGb: 1024,
        storage: '4TB NVMe RAID-0',
        jumlahUnit: 10,
        tarif: 45000000,
        status: 'AKTIF',
    },
    {
        paketId: 'PKT-002',
        namaPaket: 'A100 Enterprise Cluster',
        spesifikasiGpu: '4× NVIDIA A100 80GB PCIe',
        jumlahCpuCore: 64,
        kapasitasRamGb: 512,
        storage: '2TB NVMe SSD',
        jumlahUnit: 15,
        tarif: 28000000,
        status: 'AKTIF',
    },
    {
        paketId: 'PKT-003',
        namaPaket: 'RTX Pro Studio',
        spesifikasiGpu: '8× NVIDIA RTX 4090 24GB',
        jumlahCpuCore: 32,
        kapasitasRamGb: 256,
        storage: '1TB NVMe SSD',
        jumlahUnit: 20,
        tarif: 12000000,
        status: 'AKTIF',
    },
    {
        paketId: 'PKT-004',
        namaPaket: 'Starter GPU Node',
        spesifikasiGpu: '2× NVIDIA RTX 3090 24GB',
        jumlahCpuCore: 16,
        kapasitasRamGb: 128,
        storage: '500GB NVMe SSD',
        jumlahUnit: 30,
        tarif: 4500000,
        status: 'AKTIF',
    },
    {
        paketId: 'PKT-005',
        namaPaket: 'V100 Legacy Compute',
        spesifikasiGpu: '4× NVIDIA Tesla V100 32GB',
        jumlahCpuCore: 48,
        kapasitasRamGb: 384,
        storage: '2TB SATA SSD',
        jumlahUnit: 0,
        tarif: 9000000,
        status: 'TIDAK AKTIF',
    },
    {
        paketId: 'PKT-006',
        namaPaket: 'H100 Ultra Flagship',
        spesifikasiGpu: '16× NVIDIA H100 80GB NVLink',
        jumlahCpuCore: 256,
        kapasitasRamGb: 2048,
        storage: '8TB NVMe RAID-10',
        jumlahUnit: 3,
        tarif: 98000000,
        status: 'AKTIF',
    },
];

const GPU_ICON = (gpu = '') => {
    if (gpu.includes('H100')) return '🔷';
    if (gpu.includes('A100')) return '🟣';
    if (gpu.includes('RTX')) return '🔴';
    if (gpu.includes('V100')) return '🟡';
    return '⚡';
};

// Accent colors cycling per card
const ACCENTS = ['#4cd6ff', '#cdbdff', '#ffb59d', '#4cd6ff', '#8c90a1', '#4cd6ff'];

export default function Katalog() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pakets, setPakets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ tanggalMulai: '', durasibulan: '', catatan: '' });
    const [search, setSearch] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await PaketService.getAllPaket();
            // Use backend data if available, otherwise fall back to mock
            setPakets(data && data.length > 0 ? data : MOCK_PAKETS);
        } catch {
            // No backend — use mock data for demo
            setPakets(MOCK_PAKETS);
        } finally {
            setLoading(false);
        }
    };

    const filtered = pakets.filter(p =>
        p.namaPaket?.toLowerCase().includes(search.toLowerCase()) ||
        p.spesifikasiGpu?.toLowerCase().includes(search.toLowerCase())
    );

    const handleOrder = (paket) => {
        setSelected(paket);
        setForm({ tanggalMulai: '', durasibulan: '', catatan: '' });
        setShowForm(true);
        setError(''); setSuccess('');
    };

    const handleSubmit = async e => {
        e.preventDefault(); setSubmitting(true); setError('');
        try {
            if (!user?.clientId) {
                setError('Akun Anda belum memiliki ID klien. Hubungi administrator untuk melanjutkan pemesanan.');
                setSubmitting(false);
                return;
            }
            await KontrakService.createKontrakClient({
                clientId: user.clientId,
                paketId: selected.paketId,
                ...form,
                durasibulan: +form.durasibulan,
            });
            setShowForm(false);
            setSuccess(`Kontrak untuk "${selected.namaPaket}" berhasil dibuat! Tim kami akan menghubungi Anda.`);
            setSelected(null);
        } catch (err) {
            setError(err.message || 'Gagal membuat kontrak. Coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    const activeCount = filtered.filter(p => p.status === 'AKTIF' && p.jumlahUnit > 0).length;

    return (
        <MainLayout pageTitle="Katalog Layanan">
            <div className="space-y-8">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cd6ff' }}>
                            Layanan / Katalog GPU
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Katalog <span style={{ color: '#4cd6ff' }}>Layanan</span>
                        </h1>
                        <p className="text-sm mt-2 max-w-xl" style={{ color: '#8c90a1' }}>
                            Pilih paket klaster GPU yang sesuai kebutuhan komputasi AI dan HPC Anda.
                            Kontrak fleksibel, skalabel, dengan uptime 99.99%.
                        </p>
                    </div>
                </div>

                {/* ── Success Banner ── */}
                {success && (
                    <div className="p-4 rounded-xl flex items-center justify-between fade-in"
                        style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>check_circle</span>
                            <p className="text-sm font-medium" style={{ color: '#4cd6ff' }}>{success}</p>
                        </div>
                        <button onClick={() => navigate('/client/kontrak')}
                            className="text-xs font-bold underline shrink-0" style={{ color: '#4cd6ff' }}>
                            Lihat Kontrak →
                        </button>
                    </div>
                )}

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Paket Tersedia', value: activeCount, color: '#4cd6ff', icon: 'inventory_2' },
                        { label: 'GPU Options', value: '4+', color: '#cdbdff', icon: 'memory' },
                        { label: 'Uptime SLA', value: '99.99%', color: '#4cd6ff', icon: 'verified' },
                    ].map(({ label, value, color, icon }) => (
                        <div key={label} className="kpi-card flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: `${color}12` }}>
                                <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold" style={{ color }}>{value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Search ── */}
                <div className="relative max-w-sm">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]"
                        style={{ color: '#4a4f62' }}>search</span>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Cari paket GPU..."
                        className="input input-icon w-full" />
                </div>

                {/* ── Package Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card h-80 animate-pulse" style={{ background: '#171f33' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card p-16 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4 block" style={{ color: '#4a4f62' }}>inventory_2</span>
                        <p className="font-display text-xl font-bold" style={{ color: '#dae2fd' }}>Tidak Ada Hasil</p>
                        <p className="text-sm mt-1" style={{ color: '#8c90a1' }}>Coba kata kunci lain</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((p, i) => {
                            const accent = ACCENTS[i % ACCENTS.length];
                            const isAvail = p.status === 'AKTIF' && p.jumlahUnit > 0;
                            return (
                                <div key={p.paketId || i}
                                    className="card flex flex-col overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                    style={{ borderTop: `3px solid ${accent}40` }}>

                                    {/* Card Body */}
                                    <div className="p-6 flex-1">
                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                                                style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                                                {GPU_ICON(p.spesifikasiGpu)}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`badge ${p.status === 'AKTIF' ? 'badge-active' : 'badge-expired'}`}>
                                                    {p.status === 'AKTIF' && (
                                                        <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />
                                                    )}
                                                    {p.status}
                                                </span>
                                                {p.jumlahUnit > 0 && p.jumlahUnit <= 5 && (
                                                    <span className="text-[10px] font-bold" style={{ color: '#ffb59d' }}>
                                                        ⚡ {p.jumlahUnit} unit tersisa
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-display text-xl font-extrabold mb-1" style={{ color: '#dae2fd' }}>
                                            {p.namaPaket}
                                        </h3>
                                        <p className="text-xs font-mono mb-5" style={{ color: `${accent}80` }}>
                                            {p.spesifikasiGpu}
                                        </p>

                                        {/* Divider */}
                                        <div className="h-px mb-5" style={{ background: 'rgba(66,70,86,0.3)' }} />

                                        {/* Specs */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                            {[
                                                { icon: 'developer_board', label: 'CPU', value: `${p.jumlahCpuCore} vCPU` },
                                                { icon: 'storage', label: 'RAM', value: `${p.kapasitasRamGb} GB` },
                                                { icon: 'hard_drive', label: 'Storage', value: p.storage },
                                                { icon: 'inventory', label: 'Unit', value: `${p.jumlahUnit} tersedia` },
                                            ].map(({ icon, label, value }) => (
                                                <div key={label} className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-[14px] mt-0.5 shrink-0"
                                                        style={{ color: accent }}>{icon}</span>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-wider"
                                                            style={{ color: '#4a4f62' }}>{label}</p>
                                                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#c2c6d8' }}>{value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 py-5"
                                        style={{ borderTop: '1px solid rgba(66,70,86,0.25)', background: '#131b2e' }}>
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-widest font-bold mb-0.5"
                                                    style={{ color: '#4a4f62' }}>Tarif / Bulan</p>
                                                <p className="font-display text-2xl font-black" style={{ color: accent }}>
                                                    Rp {p.tarif?.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <p className="text-[10px]" style={{ color: '#4a4f62' }}>excl. PPN</p>
                                        </div>

                                        <button
                                            onClick={() => isAvail && handleOrder(p)}
                                            disabled={!isAvail}
                                            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                                            style={isAvail
                                                ? {
                                                    background: `${accent}15`,
                                                    color: accent,
                                                    border: `1px solid ${accent}35`,
                                                }
                                                : {
                                                    background: '#1a2135',
                                                    color: '#4a4f62',
                                                    cursor: 'not-allowed',
                                                    border: '1px solid rgba(66,70,86,0.2)',
                                                }}
                                            onMouseEnter={e => isAvail && (e.currentTarget.style.background = `${accent}28`)}
                                            onMouseLeave={e => isAvail && (e.currentTarget.style.background = `${accent}15`)}>
                                            {!isAvail
                                                ? <><span className="material-symbols-outlined text-[18px]">block</span> Tidak Tersedia</>
                                                : <><span className="material-symbols-outlined text-[18px]">shopping_cart</span> Pesan Sekarang</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── SLA Info Strip ── */}
                <div className="card p-5 flex flex-col md:flex-row items-center justify-between gap-4"
                    style={{ background: 'linear-gradient(135deg, rgba(76,214,255,0.05), rgba(23,31,51,0.9))', border: '1px solid rgba(76,214,255,0.1)' }}>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-2xl" style={{ color: '#4cd6ff' }}>verified_user</span>
                        <div>
                            <p className="font-bold text-sm" style={{ color: '#dae2fd' }}>Enterprise SLA Guarantee</p>
                            <p className="text-xs" style={{ color: '#8c90a1' }}>99.99% uptime · Dedicated support 24/7 · GDPR Compliant</p>
                        </div>
                    </div>
                    <div className="flex gap-6 text-center shrink-0">
                        {[['99.99%', 'Uptime'], ['< 4 Jam', 'Resp. SLA'], ['24/7', 'Support']].map(([v, l]) => (
                            <div key={l}>
                                <p className="font-display font-bold text-lg" style={{ color: '#4cd6ff' }}>{v}</p>
                                <p className="text-[10px] uppercase tracking-wider" style={{ color: '#4a4f62' }}>{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Order Modal ── */}
            {showForm && selected && (
                <div className="modal-overlay">
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4"
                            style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>
                                    Pesan Paket
                                </h3>
                                <p className="text-xs mt-0.5" style={{ color: '#4cd6ff' }}>{selected.namaPaket}</p>
                            </div>
                            <button onClick={() => setShowForm(false)} style={{ color: '#4a4f62' }}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mx-6 mt-4 p-3 rounded-xl text-sm"
                                style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab', color: '#ffb4ab' }}>
                                {error}
                            </div>
                        )}

                        <form id="orderForm" onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Spec Summary */}
                            <div className="rounded-xl p-4" style={{ background: '#131b2e' }}>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
                                    style={{ color: '#8c90a1' }}>Ringkasan Paket</p>
                                <div className="space-y-2">
                                    {[
                                        ['GPU', selected.spesifikasiGpu],
                                        ['CPU', `${selected.jumlahCpuCore} vCPU`],
                                        ['RAM', `${selected.kapasitasRamGb} GB`],
                                        ['Storage', selected.storage],
                                        ['Tarif', `Rp ${selected.tarif?.toLocaleString('id-ID')} / bulan`],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-sm">
                                            <span style={{ color: '#8c90a1' }}>{k}</span>
                                            <span className="font-semibold" style={{ color: '#dae2fd' }}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider"
                                    style={{ color: '#8c90a1' }}>Tanggal Mulai</label>
                                <input type="date" required value={form.tanggalMulai}
                                    onChange={e => setForm({ ...form, tanggalMulai: e.target.value })}
                                    className="input" style={{ colorScheme: 'dark' }} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider"
                                    style={{ color: '#8c90a1' }}>Durasi Kontrak (Bulan)</label>
                                <input type="number" min="1" max="36" required value={form.durasibulan}
                                    onChange={e => setForm({ ...form, durasibulan: e.target.value })}
                                    placeholder="Contoh: 12" className="input" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider"
                                    style={{ color: '#8c90a1' }}>Catatan Khusus (Opsional)</label>
                                <textarea rows={2} value={form.catatan}
                                    onChange={e => setForm({ ...form, catatan: e.target.value })}
                                    className="input resize-none"
                                    placeholder="Kebutuhan konfigurasi khusus, dll." />
                            </div>
                        </form>

                        <div className="flex justify-end gap-3 px-6 py-4"
                            style={{ borderTop: '1px solid rgba(66,70,86,0.2)' }}>
                            <button onClick={() => setShowForm(false)} className="btn-secondary">Batal</button>
                            <button type="submit" form="orderForm" disabled={submitting} className="btn-primary">
                                {submitting
                                    ? <><span className="material-symbols-outlined spin text-lg">sync</span> Memproses...</>
                                    : <><span className="material-symbols-outlined text-lg">send</span> Konfirmasi Pesanan</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}