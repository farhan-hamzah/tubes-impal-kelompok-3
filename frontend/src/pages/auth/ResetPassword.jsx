import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../../services/AuthService';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await authService.resetPassword({ token, passwordBaru: password });
      setMessage('Password berhasil direset!');
    } catch (err) {
      setMessage(err.message || 'Token tidak valid / expired');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Reset Password
          </button>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}