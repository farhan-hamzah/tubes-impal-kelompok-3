import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const menus = [
    { label: 'Katalog Paket HPC', path: '/client/katalog', icon: '🖥️' },
    { label: 'Kontrak Saya', path: '/client/kontrak', icon: '📋' },
    { label: 'Riwayat Transaksi', path: '/client/transaksi', icon: '🧾' },
    { label: 'Profil Saya', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TensorLease</h1>
        <div className="flex items-center gap-4">
          <span>Halo, {user?.nama}</span>
          <button onClick={() => { logoutUser(); navigate('/login'); }}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map((menu, i) => (
            <button key={i} onClick={() => navigate(menu.path)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-left">
              <div className="text-3xl mb-2">{menu.icon}</div>
              <div className="font-semibold text-gray-700">{menu.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}