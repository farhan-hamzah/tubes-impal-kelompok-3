import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/auth/Profile';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import ClientList from './pages/admin/ClientList';
import KelolaPaket from './pages/admin/KelolaPaket';
import KelolaTarif from './pages/admin/KelolaTarif';
import KontrakAdmin from './pages/admin/KontrakAdmin';
import InvoiceAdmin from './pages/admin/InvoiceAdmin';
import Laporan from './pages/admin/Laporan';

// Client
import ClientDashboard from './pages/client/Dashboard';
import Katalog from './pages/client/Katalog';
import KontrakClient from './pages/client/KontrakClient';
import RiwayatTransaksi from './pages/client/RiwayatTransaksi';
<<<<<<< HEAD
=======
import Monitoring from './pages/client/Monitoring';
>>>>>>> farhan

// ─────────────────────────────────────────────
// ProtectedRoute — OOP-aware role guard
// ─────────────────────────────────────────────
const ProtectedRoute = ({ children, role }) => {
  const { user, token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b1326' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
            <span className="material-symbols-outlined icon-fill text-2xl" style={{ color: '#003543' }}>memory</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#8c90a1' }}>Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return children;
};

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Shared */}
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* ── ADMIN ── */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/clients" element={
        <ProtectedRoute role="ADMIN"><ClientList /></ProtectedRoute>
      } />
      <Route path="/admin/paket" element={
        <ProtectedRoute role="ADMIN"><KelolaPaket /></ProtectedRoute>
      } />
      <Route path="/admin/tarif" element={
        <ProtectedRoute role="ADMIN"><KelolaTarif /></ProtectedRoute>
      } />
      <Route path="/admin/kontrak" element={
        <ProtectedRoute role="ADMIN"><KontrakAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/invoice" element={
        <ProtectedRoute role="ADMIN"><InvoiceAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/laporan" element={
        <ProtectedRoute role="ADMIN"><Laporan /></ProtectedRoute>
      } />

      {/* ── CLIENT ── */}
      <Route path="/client/dashboard" element={
        <ProtectedRoute role="CLIENT"><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="/client/katalog" element={
        <ProtectedRoute role="CLIENT"><Katalog /></ProtectedRoute>
      } />
      <Route path="/client/kontrak" element={
        <ProtectedRoute role="CLIENT"><KontrakClient /></ProtectedRoute>
      } />
      <Route path="/client/transaksi" element={
        <ProtectedRoute role="CLIENT"><RiwayatTransaksi /></ProtectedRoute>
      } />
<<<<<<< HEAD
=======
      <Route path="/client/monitoring" element={
        <ProtectedRoute role="CLIENT"><Monitoring /></ProtectedRoute>
      } />
>>>>>>> farhan

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
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