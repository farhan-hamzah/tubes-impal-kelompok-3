import { useState, useEffect } from 'react';
import { getAllInvoice, buatInvoice, getInvoiceByStatus, validasiPembayaran } from '../../api/invoice';
import { getAllKontrak } from '../../api/kontrak';
import { useAuth } from '../../context/AuthContext';

export default function InvoiceAdmin() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [kontraks, setKontraks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [validasiId, setValidasiId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    kontrakId: '', tagihanMulai: '',
    tagihanAkhir: '', tanggalJatuhTempo: ''
  });
  const [formValidasi, setFormValidasi] = useState({
    invoiceId: '', jumlahDibayar: '',
    metodePembayaran: '', buktiPembayaran: ''
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [inv, k] = await Promise.all([getAllInvoice(), getAllKontrak()]);
      setInvoices(inv.data);
      setKontraks(k.data.filter(k => k.status === 'ACTIVE'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (status) => {
    setFilterStatus(status);
    try {
      const res = status === '' ? await getAllInvoice() : await getInvoiceByStatus(status);
      setInvoices(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBuatInvoice = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await buatInvoice(form);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data || 'Gagal buat invoice!');
    }
  };

  const handleValidasi = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await validasiPembayaran(user.adminId, { ...formValidasi, invoiceId: validasiId });
      setValidasiId(null);
      fetchAll();
    } catch (err) {
      setError(err.response?.data || 'Gagal validasi!');
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Invoice</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Buat Invoice
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

      <div className="flex gap-2 mb-4">
        {['', 'PAID', 'UNPAID', 'OVERDUE'].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1 rounded text-sm ${
              filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                <th className="border p-3 text-left">No. Invoice</th>
                <th className="border p-3 text-left">Client</th>
                <th className="border p-3 text-left">Periode</th>
                <th className="border p-3 text-left">Jumlah</th>
                <th className="border p-3 text-left">Jatuh Tempo</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan="7" className="border p-3 text-center text-gray-500">Belum ada invoice</td></tr>
              ) : invoices.map((inv, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-3 font-mono text-sm">{inv.nomorInvoice}</td>
                  <td className="border p-3">{inv.namaClient}</td>
                  <td className="border p-3 text-sm">{inv.tagihanMulai} s/d {inv.tagihanAkhir}</td>
                  <td className="border p-3">Rp {inv.jumlahTagihan?.toLocaleString('id-ID')}</td>
                  <td className="border p-3">{inv.tanggalJatuhTempo}</td>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColor(inv.statusPembayaran)}`}>
                      {inv.statusPembayaran}
                    </span>
                  </td>
                  <td className="border p-3">
                    {inv.statusPembayaran === 'UNPAID' && (
                      <button
                        onClick={() => { setValidasiId(inv.invoiceId); setFormValidasi({...formValidasi, jumlahDibayar: inv.jumlahTagihan}); }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Validasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Buat Invoice */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Buat Invoice</h3>
            <form onSubmit={handleBuatInvoice} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontrak</label>
                <select
                  value={form.kontrakId}
                  onChange={(e) => setForm({...form, kontrakId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kontrak Aktif</option>
                  {kontraks.map((k, i) => (
                    <option key={i} value={k.kontrakId}>
                      {k.nomorKontrak} - {k.namaClient}
                    </option>
                  ))}
                </select>
              </div>
              {[
                { label: 'Tagihan Mulai', name: 'tagihanMulai' },
                { label: 'Tagihan Akhir', name: 'tagihanAkhir' },
                { label: 'Tanggal Jatuh Tempo', name: 'tanggalJatuhTempo' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type="date"
                    value={form[f.name]}
                    onChange={(e) => setForm({...form, [f.name]: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form Validasi Pembayaran */}
      {validasiId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Validasi Pembayaran</h3>
            <form onSubmit={handleValidasi} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Dibayar</label>
                <input
                  type="number"
                  value={formValidasi.jumlahDibayar}
                  onChange={(e) => setFormValidasi({...formValidasi, jumlahDibayar: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select
                  value={formValidasi.metodePembayaran}
                  onChange={(e) => setFormValidasi({...formValidasi, metodePembayaran: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Metode</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Virtual Account">Virtual Account</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Pembayaran</label>
                <input
                  type="text"
                  value={formValidasi.buktiPembayaran}
                  onChange={(e) => setFormValidasi({...formValidasi, buktiPembayaran: e.target.value})}
                  placeholder="Nama file bukti transfer"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Konfirmasi Lunas
                </button>
                <button type="button" onClick={() => setValidasiId(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
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