import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      const { token, role, nama, email } = res.data;
      loginUser({ nama, email, role }, token);

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'Email atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">Masuk ke Akun</h2>
          <p className="text-gray-400 mb-6">
            Selamat datang kembali! Silahkan login untuk melanjutkan
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-sm text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="nama@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan password anda"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
            <div>
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-400">Ingatkan saya</span>
            </div>

            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Lupa password?
            </a>
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Belum punya akun?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
    
  );
  <p className="text-right text-sm text-blue-500 cursor-pointer hover:underline mb-4">
  <a href="/forgot-password">Lupa password?</a>
</p>
}