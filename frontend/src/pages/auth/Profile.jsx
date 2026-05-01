import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfil, updateProfil, deleteAkun } from '../../api/user';

export default function Profile() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    nomorTelepon: '',
    passwordLama: '',
    passwordBaru: '',
  });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfil, setLoadingProfil] = useState(true);
  const [showHapus, setShowHapus] = useState(false);

  // Ambil data profil dari backend saat mount
  useEffect(() => {
    const id = user?.clientId || user?.adminId;
    if (!id) return;

    getProfil(id)
      .then(res => {
        setForm(prev => ({
          ...prev,
          nama: res.data.nama || '',
          nomorTelepon: res.data.nomorTelepon || '',
        }));
        setEmail(res.data.email || '');
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingProfil(false));
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const id = user?.clientId || user?.adminId;
      await updateProfil(id, form);
      setSuccess('Profil berhasil diperbarui!');
      // Reset field password setelah update
      setForm(prev => ({ ...prev, passwordLama: '', passwordBaru: '' }));
    } catch (err) {
      setError(err.response?.data || 'Gagal update profil!');
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async () => {
    try {
      const id = user?.clientId || user?.adminId;
      await deleteAkun(id);
      logoutUser();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Gagal hapus akun!');
      setShowHapus(false);
    }
  };

  if (loadingProfil) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Profil Saya</h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleUpdate}>
          {/* Email — read only, tidak bisa diubah */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-gray-400 text-xs">(tidak dapat diubah)</span>
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
            <input
              type="text"
              name="nomorTelepon"
              value={form.nomorTelepon}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input
              type="password"
              name="passwordLama"
              value={form.passwordLama}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Isi jika ingin ganti password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              type="password"
              name="passwordBaru"
              value={form.passwordBaru}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>

        <hr className="my-6" />

        <button
          onClick={() => setShowHapus(true)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Hapus Akun
        </button>

        {showHapus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold mb-2">Hapus Akun</h3>
              <p className="text-gray-600 mb-4">
                Apakah kamu yakin? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleHapus}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setShowHapus(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}