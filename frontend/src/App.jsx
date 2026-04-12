import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import ClientDashboard from './pages/client/Dashboard';
import ClientList from './pages/admin/ClientList';
import KelolaPaket from './pages/admin/KelolaPaket';
import KelolaTarif from './pages/admin/KelolaTarif';
import KontrakAdmin from './pages/admin/KontrakAdmin';
import InvoiceAdmin from './pages/admin/InvoiceAdmin';
import Katalog from './pages/client/Katalog';
import KontrakClient from './pages/client/KontrakClient';
import RiwayatTransaksi from './pages/client/RiwayatTransaksi';

const ProtectedRoute = ({ children, role }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute role="ADMIN"><ClientList /></ProtectedRoute>} />
      <Route path="/admin/paket" element={<ProtectedRoute role="ADMIN"><KelolaPaket /></ProtectedRoute>} />
      <Route path="/admin/tarif" element={<ProtectedRoute role="ADMIN"><KelolaTarif /></ProtectedRoute>} />
      <Route path="/admin/kontrak" element={<ProtectedRoute role="ADMIN"><KontrakAdmin /></ProtectedRoute>} />
      <Route path="/admin/invoice" element={<ProtectedRoute role="ADMIN"><InvoiceAdmin /></ProtectedRoute>} />

      {/* Client */}
      <Route path="/client/dashboard" element={<ProtectedRoute role="CLIENT"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/client/katalog" element={<ProtectedRoute role="CLIENT"><Katalog /></ProtectedRoute>} />
      <Route path="/client/kontrak" element={<ProtectedRoute role="CLIENT"><KontrakClient /></ProtectedRoute>} />
      <Route path="/client/transaksi" element={<ProtectedRoute role="CLIENT"><RiwayatTransaksi /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}