import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    nomorTelepon: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError('Password tidak sama!');
    }

    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold leading-tight mb-6">
          High-Performance <br />
          Computing untuk <br />
          Semua Kebutuhan Anda
        </h1>

        <p className="text-blue-100 mb-8">
          Platform manajemen retainer untuk layanan GPU dan infrastruktur komputasi tingkat enterprise
        </p>

        <ul className="space-y-4 text-sm">
          <li>⚡ GPU NVIDIA A100 & H100 tersedia</li>
          <li>🔒 Infrastruktur aman dan terisolasi</li>
          <li>📊 Dashboard monitoring real-time</li>
          <li>💳 Sistem pembayaran retainer fleksibel</li>
        </ul>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">Buat Akun Baru</h2>
          <p className="text-gray-400 mb-6">
            Bergabunglah dengan TensorLease dan akses GPU berkinerja tinggi
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label className="text-sm text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Nama kamu"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="email@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300">Nomor Telepon</label>
              <input
                type="text"
                name="nomorTelepon"
                value={form.nomorTelepon}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-300">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Ulangi password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}