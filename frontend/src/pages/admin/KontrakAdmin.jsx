import { useState, useEffect } from 'react';
import { getAllKontrak, buatKontrak, getKontrakByStatus } from '../../api/kontrak';
import { getAllClients } from '../../api/admin';
import { getAllPaket } from '../../api/paket';

export default function KontrakAdmin() {
  const [kontraks, setKontraks] = useState([]);
  const [clients, setClients] = useState([]);
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientId: '', adminId: '',
    paketId: '', tanggalMulai: '',
    durasibulan: '', catatan: ''
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [k, c, p] = await Promise.all([
        getAllKontrak(),
        getAllClients(),
        getAllPaket()
      ]);
      setKontraks(k.data);
      setClients(c.data);
      setPakets(p.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (status) => {
    setFilterStatus(status);
    try {
      if (status === '') {
        const res = await getAllKontrak();
        setKontraks(res.data);
      } else {
        const res = await getKontrakByStatus(status);
        setKontraks(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await buatKontrak(form);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data || 'Gagal buat kontrak!');
    }
  };

  const statusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      EXPIRED: 'bg-red-100 text-red-700',
      EXPIRING_SOON: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Kontrak</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Buat Kontrak
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

      {/* Filter Status */}
      <div className="flex gap-2 mb-4">
        {['', 'ACTIVE', 'PENDING', 'EXPIRED', 'EXPIRING_SOON'].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1 rounded text-sm ${
              filterStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {s === '' ? 'Semua' : s}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left">No. Kontrak</th>
                <th className="border p-3 text-left">Client</th>
                <th className="border p-3 text-left">Paket</th>
                <th className="border p-3 text-left">Mulai</th>
                <th className="border p-3 text-left">Berakhir</th>
                <th className="border p-3 text-left">Total Biaya</th>
                <th className="border p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {kontraks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border p-3 text-center text-gray-500">
                    Belum ada kontrak
                  </td>
                </tr>
              ) : kontraks.map((k, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-3 font-mono text-sm">{k.nomorKontrak}</td>
                  <td className="border p-3">{k.namaClient}</td>
                  <td className="border p-3">{k.namaPaket}</td>
                  <td className="border p-3">{k.tanggalMulai}</td>
                  <td className="border p-3">{k.tanggalBerakhir}</td>
                  <td className="border p-3">Rp {k.totalBiaya?.toLocaleString('id-ID')}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColor(k.status)}`}>
                      {k.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Buat Kontrak */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Buat Kontrak Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select
                  name="clientId"
                  value={form.clientId}
                  onChange={(e) => setForm({...form, clientId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Client</option>
                  {clients.map((c, i) => (
                    <option key={i} value={c.userId}>{c.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paket HPC</label>
                <select
                  name="paketId"
                  value={form.paketId}
                  onChange={(e) => setForm({...form, paketId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Paket</option>
                  {pakets.map((p, i) => (
                    <option key={i} value={p.paketId}>
                      {p.namaPaket} - Rp {p.tarif?.toLocaleString('id-ID')}/bln
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  value={form.tanggalMulai}
                  onChange={(e) => setForm({...form, tanggalMulai: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Bulan)</label>
                <input
                  type="number"
                  value={form.durasibulan}
                  onChange={(e) => setForm({...form, durasibulan: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea
                  value={form.catatan}
                  onChange={(e) => setForm({...form, catatan: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Simpan Kontrak
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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