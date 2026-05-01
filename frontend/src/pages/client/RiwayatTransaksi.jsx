import { useState, useEffect, useRef } from 'react';
import { getInvoiceByClient } from '../../api/invoice';
import { getSnapToken } from '../../api/payment';
import { uploadBuktiPembayaran } from '../../api/invoice';
import { useAuth } from '../../context/AuthContext';

export default function RiwayatTransaksi() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // track invoice yang sedang upload
  const [previewBukti, setPreviewBukti] = useState(null); // untuk lihat bukti yang sudah diupload
  const fileInputRef = useRef({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
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
        onSuccess: () => { alert('Pembayaran berhasil!'); fetchInvoice(); },
        onPending: () => { alert('Pembayaran pending.'); fetchInvoice(); },
        onError: () => { alert('Pembayaran gagal. Coba lagi.'); },
        onClose: () => { console.log('Popup ditutup.'); },
      });
    } catch (err) {
      alert('Gagal memulai pembayaran: ' + (err.response?.data || err.message));
    } finally {
      setPayingId(null);
    }
  };

  const handleUploadBukti = async (invoiceId, file) => {
    if (!file) return;

    // Validasi ukuran file max 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB!');
      return;
    }

    setUploadingId(invoiceId);
    try {
      // Convert ke base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await uploadBuktiPembayaran(invoiceId, base64);
      alert('Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.');
      fetchInvoice();
    } catch (err) {
      alert('Gagal upload bukti: ' + (err.response?.data || err.message));
    } finally {
      setUploadingId(null);
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

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <p>📋 Kontrak: {inv.nomorKontrak}</p>
                <p>💰 Tagihan: Rp {inv.jumlahTagihan?.toLocaleString('id-ID')}</p>
                <p>📅 Periode: {inv.tagihanMulai} s/d {inv.tagihanAkhir}</p>
                <p>⏰ Jatuh Tempo: {inv.tanggalJatuhTempo}</p>
                {inv.tanggalPembayaran && (
                  <p>✅ Dibayar: {inv.tanggalPembayaran}</p>
                )}
              </div>

              {inv.statusPembayaran === 'UNPAID' && (
                <div className="flex flex-col gap-2">
                  {/* Tombol bayar via Midtrans */}
                  <button
                    onClick={() => handleBayar(inv.invoiceId)}
                    disabled={payingId === inv.invoiceId}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {payingId === inv.invoiceId ? 'Memproses...' : '💳 Bayar via Midtrans'}
                  </button>

                  {/* Tombol upload bukti transfer manual */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={el => fileInputRef.current[inv.invoiceId] = el}
                      onChange={(e) => handleUploadBukti(inv.invoiceId, e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current[inv.invoiceId]?.click()}
                      disabled={uploadingId === inv.invoiceId}
                      className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
                    >
                      {uploadingId === inv.invoiceId
                        ? 'Mengupload...'
                        : inv.buktiPembayaran
                          ? '✅ Bukti Terupload — Ganti'
                          : '📎 Upload Bukti Transfer'}
                    </button>

                    {/* Preview bukti yang sudah diupload */}
                    {inv.buktiPembayaran && (
                      <button
                        onClick={() => setPreviewBukti(inv.buktiPembayaran)}
                        className="text-blue-600 text-sm underline"
                      >
                        Lihat Bukti
                      </button>
                    )}
                  </div>

                  {inv.buktiPembayaran && (
                    <p className="text-xs text-yellow-600">
                      ⏳ Bukti sudah diupload, menunggu verifikasi admin.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal preview bukti */}
      {previewBukti && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewBukti(null)}
        >
          <div className="max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b">
                <span className="font-medium">Bukti Pembayaran</span>
                <button onClick={() => setPreviewBukti(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              {previewBukti.startsWith('data:image') ? (
                <img src={previewBukti} alt="Bukti Pembayaran" className="w-full" />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>File PDF tidak bisa dipreview.</p>
                  <a href={previewBukti} download className="text-blue-600 underline">Download</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}