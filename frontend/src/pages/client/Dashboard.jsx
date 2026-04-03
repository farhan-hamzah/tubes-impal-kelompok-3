import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TensorLease</h1>
        <div className="flex items-center gap-4">
          <span>Halo, {user?.nama}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Client</h2>
        <p className="text-gray-600">Selamat datang di TensorLease!</p>
      </div>
    </div>
  );
}