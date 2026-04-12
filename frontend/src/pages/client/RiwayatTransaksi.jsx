import { useState, useEffect } from 'react';
import { getInvoiceByClient } from '../../api/invoice';
import { useAuth } from '../../context/AuthContext';

export default function RiwayatTransaksi() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.clientId) fetchInvoice();
  }, [user]);

  const fetchInvoice = async () => {
    try {
      const res = await getInvoiceByClient(user.clientId);
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    const colors = {
      PAID: 'bg-green-100 text-green-700',
      UNPAID: 'bg-yellow-100 text-yellow-700',
      OVERDUE: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Riwayat Transaksi</h2>

      {loading ? <p>Loading...</p> :
       invoices.length === 0 ? (
        <p className="text-gray-500">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-sm text-gray-500">{inv.nomorInvoice}</span>
                <span className={`px-2 py-1 rounded text-xs ${statusColor(inv.statusPembayaran)}`}>
                  {inv.statusPembayaran}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>📋 Kontrak: {inv.nomorKontrak}</p>
                <p>💰 Tagihan: Rp {inv.jumlahTagihan?.toLocaleString('id-ID')}</p>
                <p>📅 Periode: {inv.tagihanMulai} s/d {inv.tagihanAkhir}</p>
                <p>⏰ Jatuh Tempo: {inv.tanggalJatuhTempo}</p>
                {inv.tanggalPembayaran && (
                  <p>✅ Dibayar: {inv.tanggalPembayaran}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}