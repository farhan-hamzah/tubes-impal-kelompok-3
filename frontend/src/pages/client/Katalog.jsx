import { useState, useEffect } from 'react';
import { getAllPaket } from '../../api/paket';

export default function Katalog() {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPaket();
  }, []);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Katalog Paket HPC</h2>

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
              <div className="flex justify-between items-center">
                <p className="font-bold text-blue-600">
                  Rp {paket.tarif?.toLocaleString('id-ID')}/bulan
                </p>
                <button
                  onClick={() => setSelected(paket)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}