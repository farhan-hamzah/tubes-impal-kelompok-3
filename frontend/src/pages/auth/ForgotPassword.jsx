import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Link reset password sudah dikirim ke email!');
    } catch (err) {
      setMessage('Gagal mengirim email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Lupa Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Kirim Link Reset
          </button>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}