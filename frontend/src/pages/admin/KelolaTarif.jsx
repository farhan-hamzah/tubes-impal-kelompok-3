import { useState, useEffect } from 'react';
import { getAllPaket, updatePaket } from '../../api/paket';

export default function KelolaTarif() {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [tarifBaru, setTarifBaru] = useState('');
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

  const handleUpdateTarif = async (paketId) => {
    setError('');
    setSuccess('');
    try {
      await updatePaket(paketId, { tarif: parseFloat(tarifBaru) });
      setSuccess('Tarif berhasil diperbarui!');
      setEditId(null);
      setTarifBaru('');
      fetchPaket();
    } catch (err) {
      setError(err.response?.data || 'Gagal update tarif!');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Kelola Tarif HPC</h2>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>}

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left">Nama Paket</th>
                <th className="border p-3 text-left">Tarif Saat Ini</th>
                <th className="border p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pakets.map((paket, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-3">{paket.namaPaket}</td>
                  <td className="border p-3 font-semibold text-blue-600">
                    Rp {paket.tarif?.toLocaleString('id-ID')}/bulan
                  </td>
                  <td className="border p-3">
                    {editId === paket.paketId ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={tarifBaru}
                          onChange={(e) => setTarifBaru(e.target.value)}
                          placeholder="Tarif baru"
                          className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleUpdateTarif(paket.paketId)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditId(paket.paketId); setTarifBaru(paket.tarif); }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Ubah Tarif
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}