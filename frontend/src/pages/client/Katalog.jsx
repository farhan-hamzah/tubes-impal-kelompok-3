import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPaket } from '../../api/paket';
import { buatKontrakByClient } from '../../api/kontrak';
import { useAuth } from '../../context/AuthContext';

export default function Katalog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [beliPaket, setBeliPaket] = useState(null);
  const [form, setForm] = useState({ durasibulan: 1, tanggalMulai: '', catatan: '' });
  const [loadingBeli, setLoadingBeli] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchPaket(); }, []);

  const fetchPaket = async () => {
    try {
      const res = await getAllPaket();
      setPakets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBeli = async (e) => {
    e.preventDefault();
    setLoadingBeli(true);
    setError('');
    try {
      const res = await buatKontrakByClient({
        clientId: user.clientId,
        paketId: beliPaket.paketId,
        tanggalMulai: form.tanggalMulai,
        durasibulan: parseInt(form.durasibulan),
        catatan: form.catatan,
      });
      setSuccess(`Kontrak ${res.data.nomorKontrak} berhasil dibuat! Menunggu invoice dari admin.`);
      setBeliPaket(null);
      fetchPaket();
    } catch (err) {
      setError(err.response?.data || 'Gagal membuat kontrak!');
    } finally {
      setLoadingBeli(false);
    }
  };

  const totalBiaya = beliPaket
    ? (beliPaket.tarif * form.durasibulan).toLocaleString('id-ID')
    : 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Katalog Paket HPC</h2>

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
          {success}
          <button
            onClick={() => navigate('/client/kontrak')}
            className="ml-4 underline font-medium"
          >
            Lihat Kontrak
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : pakets.length === 0 ? (
        <p className="text-gray-500">Belum ada paket tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pakets.map((paket, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{paket.namaPaket}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  paket.status === 'AKTIF'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {paket.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>🎮 GPU: {paket.spesifikasiGpu}</p>
                <p>💻 CPU: {paket.jumlahCpuCore} Core</p>
                <p>🧠 RAM: {paket.kapasitasRamGb} GB</p>
                <p>💾 Storage: {paket.storage}</p>
                <p>📦 Unit Tersedia: {paket.jumlahUnit}</p>
              </div>
              <p className="font-bold text-blue-600 mb-3">
                Rp {paket.tarif?.toLocaleString('id-ID')}/bulan
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(paket)}
                  className="flex-1 border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    setBeliPaket(paket);
                    setError('');
                    setForm({ durasibulan: 1, tanggalMulai: new Date().toISOString().split('T')[0], catatan: '' });
                  }}
                  disabled={paket.status !== 'AKTIF' || paket.jumlahUnit <= 0}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paket.jumlahUnit <= 0 ? 'Habis' : 'Beli'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">{selected.namaPaket}</h3>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="font-medium">GPU:</span> {selected.spesifikasiGpu}</p>
              <p><span className="font-medium">CPU:</span> {selected.jumlahCpuCore} Core</p>
              <p><span className="font-medium">RAM:</span> {selected.kapasitasRamGb} GB</p>
              <p><span className="font-medium">Storage:</span> {selected.storage}</p>
              <p><span className="font-medium">Unit Tersedia:</span> {selected.jumlahUnit}</p>
              <p><span className="font-medium">Status:</span> {selected.status}</p>
              <p><span className="font-medium">Harga:</span> Rp {selected.tarif?.toLocaleString('id-ID')}/bulan</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setSelected(null); setBeliPaket(selected); setError(''); setForm({ durasibulan: 1, tanggalMulai: new Date().toISOString().split('T')[0], catatan: '' }); }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Beli Paket Ini
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Beli Paket */}
      {beliPaket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-1">Beli Paket</h3>
            <p className="text-blue-600 font-medium mb-4">{beliPaket.namaPaket}</p>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
            )}

            <form onSubmit={handleBeli} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={form.tanggalMulai}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi Sewa (Bulan)
                </label>
                <input
                  type="number"
                  value={form.durasibulan}
                  min="1"
                  max="24"
                  onChange={(e) => setForm({ ...form, durasibulan: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Catatan tambahan..."
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Harga/bulan</span>
                  <span>Rp {beliPaket.tarif?.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Durasi</span>
                  <span>{form.durasibulan} bulan</span>
                </div>
                <div className="flex justify-between font-bold text-blue-600 border-t pt-1 mt-1">
                  <span>Total Biaya</span>
                  <span>Rp {totalBiaya}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loadingBeli}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingBeli ? 'Memproses...' : 'Konfirmasi Beli'}
                </button>
                <button
                  type="button"
                  onClick={() => setBeliPaket(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}