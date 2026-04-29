import { useState, useEffect } from 'react';
import { getInvoiceByClient } from '../../api/invoice';
import { getSnapToken } from '../../api/payment';
import { useAuth } from '../../context/AuthContext';

export default function RiwayatTransaksi() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null); // track invoice yang sedang diproses

  useEffect(() => {
    // Load Midtrans Snap script sekali saat mount
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    // Ganti ke https://app.midtrans.com/snap/snap.js untuk production
    script.setAttribute('data-client-key', 'Mid-client-zSHCK3L1qCzGcCor');
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

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

  const handleBayar = async (invoiceId) => {
    setPayingId(invoiceId);
    try {
      const res = await getSnapToken(invoiceId);
      const { snapToken } = res.data;

      window.snap.pay(snapToken, {
        onSuccess: () => {
          alert('Pembayaran berhasil!');
          fetchInvoice(); // refresh list
        },
        onPending: () => {
          alert('Pembayaran pending, menunggu konfirmasi.');
          fetchInvoice();
        },
        onError: () => {
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          console.log('Popup ditutup tanpa menyelesaikan pembayaran.');
        },
      });
    } catch (err) {
      alert('Gagal memulai pembayaran: ' + (err.response?.data || err.message));
    } finally {
      setPayingId(null);
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

              {/* Tombol Bayar hanya muncul jika UNPAID */}
              {inv.statusPembayaran === 'UNPAID' && (
                <div className="mt-3">
                  <button
                    onClick={() => handleBayar(inv.invoiceId)}
                    disabled={payingId === inv.invoiceId}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {payingId === inv.invoiceId ? 'Memproses...' : '💳 Bayar Sekarang'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}