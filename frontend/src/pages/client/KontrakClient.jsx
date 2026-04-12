import { useState, useEffect } from 'react';
import { getKontrakByClient } from '../../api/kontrak';
import { useAuth } from '../../context/AuthContext';

export default function KontrakClient() {
  const { user } = useAuth();
  const [kontraks, setKontraks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (user?.clientId) fetchKontrak();
  }, [user]);

  const fetchKontrak = async () => {
    try {
      const res = await getKontrakByClient(user.clientId);
      setKontraks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold mb-6">Kontrak Saya</h2>

      {loading ? <p>Loading...</p> :
       kontraks.length === 0 ? (
        <p className="text-gray-500">Belum ada kontrak.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kontraks.map((k, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm text-gray-500">{k.nomorKontrak}</span>
                <span className={`px-2 py-1 rounded text-xs ${statusColor(k.status)}`}>
                  {k.status}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{k.namaPaket}</h3>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>📅 {k.tanggalMulai} s/d {k.tanggalBerakhir}</p>
                <p>⏱️ Durasi: {k.durasibulan} bulan</p>
                <p>💰 Total: Rp {k.totalBiaya?.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={() => setSelected(k)}
                className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 text-sm"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Detail Kontrak</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">No. Kontrak:</span> {selected.nomorKontrak}</p>
              <p><span className="font-medium">Paket:</span> {selected.namaPaket}</p>
              <p><span className="font-medium">Tanggal Mulai:</span> {selected.tanggalMulai}</p>
              <p><span className="font-medium">Tanggal Berakhir:</span> {selected.tanggalBerakhir}</p>
              <p><span className="font-medium">Durasi:</span> {selected.durasibulan} bulan</p>
              <p><span className="font-medium">Total Biaya:</span> Rp {selected.totalBiaya?.toLocaleString('id-ID')}</p>
              <p><span className="font-medium">Status:</span> {selected.status}</p>
              {selected.catatan && <p><span className="font-medium">Catatan:</span> {selected.catatan}</p>}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}