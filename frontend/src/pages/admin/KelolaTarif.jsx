import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import PaketService from '../../services/PaketService';

export default function KelolaTarif() {
    const [pakets, setPakets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [newTarif, setNewTarif] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { setPakets(await PaketService.getAllPaket() || []); }
        catch { setPakets([]); }
        finally { setLoading(false); }
    };

    const handleSave = async (paket) => {
        setSaving(true);
        try {
            await PaketService.updatePaket(paket.paketId, { ...paket, tarif: +newTarif });
            setEditId(null);
            setSuccess(`Tarif ${paket.namaPaket} diperbarui.`);
            setTimeout(() => setSuccess(''), 3000);
            load();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    };

    return (
        <MainLayout pageTitle="Kelola Tarif">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Kelola <span style={{ color: '#4cd6ff' }}>Tarif</span>
                        </h1>
                        <p className="text-sm mt-2" style={{ color: '#8c90a1' }}>
                            Perbarui harga layanan untuk setiap paket HPC.
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>check_circle</span>
                        <p className="text-sm font-medium" style={{ color: '#4cd6ff' }}>{success}</p>
                    </div>
                )}

                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(66,70,86,0.2)' }}>
                        <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>Daftar Tarif Paket</h3>
                        <button onClick={load} className="btn-secondary text-xs py-2 px-3">
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {['Paket', 'Spesifikasi', 'Tarif Saat Ini', 'Aksi'].map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-12" style={{ color: '#4a4f62' }}>Memuat...</td></tr>
                                ) : pakets.map(p => (
                                    <tr key={p.paketId}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                                    style={{ background: 'rgba(76,214,255,0.1)' }}>
                                                    <span className="material-symbols-outlined icon-fill text-lg" style={{ color: '#4cd6ff' }}>dataset</span>
                                                </div>
                                                <p className="font-bold" style={{ color: '#dae2fd' }}>{p.namaPaket}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-sm" style={{ color: '#c2c6d8' }}>{p.spesifikasiGpu}</p>
                                            <p className="text-xs" style={{ color: '#4a4f62' }}>{p.jumlahCpuCore} vCPU • {p.kapasitasRamGb} GB RAM</p>
                                        </td>
                                        <td>
                                            {editId === p.paketId ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm" style={{ color: '#8c90a1' }}>Rp</span>
                                                    <input type="number" value={newTarif}
                                                        onChange={e => setNewTarif(e.target.value)}
                                                        className="input py-1.5 px-3 w-36 text-sm"
                                                        autoFocus />
                                                </div>
                                            ) : (
                                                <span className="font-display font-bold text-xl" style={{ color: '#4cd6ff' }}>
                                                    Rp {p.tarif?.toLocaleString('id-ID')}
                                                    <span className="text-xs font-normal" style={{ color: '#4a4f62' }}>/bln</span>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editId === p.paketId ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSave(p)} disabled={saving}
                                                        className="btn-primary text-xs py-1.5 px-3">
                                                        {saving ? <span className="material-symbols-outlined spin text-sm">sync</span> : 'Simpan'}
                                                    </button>
                                                    <button onClick={() => setEditId(null)} className="btn-secondary text-xs py-1.5 px-3">Batal</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => { setEditId(p.paketId); setNewTarif(p.tarif); }}
                                                    className="btn-secondary text-xs py-1.5 px-3">
                                                    <span className="material-symbols-outlined text-[16px]">edit</span> Ubah Tarif
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pricing Strategy Card */}
                <div className="card p-6" style={{ background: 'linear-gradient(135deg,rgba(82,3,213,0.1),rgba(23,31,51,0.9))' }}>
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-3xl" style={{ color: '#cdbdff' }}>tips_and_updates</span>
                        <div>
                            <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#dae2fd' }}>Tips Penetapan Harga</h3>
                            <ul className="text-sm space-y-1 list-disc ml-4" style={{ color: '#8c90a1' }}>
                                <li>Pertimbangkan biaya operasional GPU dan listrik saat menetapkan tarif.</li>
                                <li>Bandingkan dengan harga pasar cloud provider (AWS, GCP, Azure).</li>
                                <li>Berikan diskon untuk kontrak jangka panjang (≥12 bulan).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}