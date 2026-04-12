import { useState, useEffect } from 'react';
import { getAllPaket, createPaket, updatePaket, deletePaket } from '../../api/paket';

export default function KelolaPaket() {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    namaPaket: '', spesifikasiGpu: '', jumlahCpuCore: '',
    kapasitasRamGb: '', storage: '', jumlahUnit: '',
    status: 'AKTIF', tarif: ''
  });
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updatePaket(editId, form);
      } else {
        await createPaket(form);
      }
      setShowForm(false);
      setEditId(null);
      resetForm();
      fetchPaket();
    } catch (err) {
      setError(err.response?.data || 'Gagal menyimpan paket!');
    }
  };

  const handleEdit = (paket) => {
    setForm({
      namaPaket: paket.namaPaket,
      spesifikasiGpu: paket.spesifikasiGpu,
      jumlahCpuCore: paket.jumlahCpuCore,
      kapasitasRamGb: paket.kapasitasRamGb,
      storage: paket.storage,
      jumlahUnit: paket.jumlahUnit,
      status: paket.status,
      tarif: paket.tarif
    });
    setEditId(paket.paketId);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await deletePaket(deleteId);
      setDeleteId(null);
      fetchPaket();
    } catch (err) {
      setError(err.response?.data || 'Gagal hapus paket!');
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setForm({
      namaPaket: '', spesifikasiGpu: '', jumlahCpuCore: '',
      kapasitasRamGb: '', storage: '', jumlahUnit: '',
      status: 'AKTIF', tarif: ''
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Paket HPC</h2>
        <button
          onClick={() => { resetForm(); setEditId(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Paket
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left">Nama Paket</th>
                <th className="border p-3 text-left">GPU</th>
                <th className="border p-3 text-left">CPU</th>
                <th className="border p-3 text-left">RAM</th>
                <th className="border p-3 text-left">Tarif</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pakets.map((paket, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-3">{paket.namaPaket}</td>
                  <td className="border p-3">{paket.spesifikasiGpu}</td>
                  <td className="border p-3">{paket.jumlahCpuCore} Core</td>
                  <td className="border p-3">{paket.kapasitasRamGb} GB</td>
                  <td className="border p-3">Rp {paket.tarif?.toLocaleString('id-ID')}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      paket.status === 'AKTIF'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {paket.status}
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(paket)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(paket.paketId)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editId ? 'Edit Paket' : 'Tambah Paket Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: 'Nama Paket', name: 'namaPaket', type: 'text' },
                { label: 'Spesifikasi GPU', name: 'spesifikasiGpu', type: 'text' },
                { label: 'Jumlah CPU Core', name: 'jumlahCpuCore', type: 'number' },
                { label: 'Kapasitas RAM (GB)', name: 'kapasitasRamGb', type: 'number' },
                { label: 'Storage', name: 'storage', type: 'text' },
                { label: 'Jumlah Unit', name: 'jumlahUnit', type: 'number' },
                { label: 'Tarif (Rp)', name: 'tarif', type: 'number' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="TIDAK_AKTIF">TIDAK AKTIF</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Simpan Perubahan' : 'Tambah Paket'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Hapus Paket</h3>
            <p className="text-gray-600 mb-4">Apakah kamu yakin ingin menghapus paket ini?</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}