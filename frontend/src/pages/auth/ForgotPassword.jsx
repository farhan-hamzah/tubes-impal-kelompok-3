import { useState } from 'react';
import API from '../../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess('Email reset password telah dikirim! Cek inbox kamu.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data || 'Gagal kirim email!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/reset-password', { token, passwordBaru });
      setSuccess('Password berhasil direset! Silakan login.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data || 'Gagal reset password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">TensorLease</h1>
          <p className="text-gray-500 mt-2">
            {step === 1 && 'Lupa Password'}
            {step === 2 && 'Masukkan Token Reset'}
            {step === 3 && 'Password Berhasil Direset!'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Step 1 - Input Email */}
        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Email Reset'}
            </button>
          </form>
        )}

        {/* Step 2 - Input Token + Password Baru */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token (dari email)
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste token dari email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru
              </label>
              <input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Mereset...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Step 3 - Sukses */}
        {step === 3 && (
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Login Sekarang
          </a>
        )}

        {step !== 3 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Ingat password?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </p>
        )}
      </div>
    </div>
  );
}