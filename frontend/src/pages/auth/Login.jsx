import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

// ── Mock users for demo/preview mode (no backend required) ──
const DEMO_USERS = {
    ADMIN: {
        user: { nama: 'Super Admin', email: 'admin@tensor.id', role: 'ADMIN', adminId: 'ADMIN-001', clientId: null },
        token: 'demo-admin-token',
    },
    CLIENT: {
        user: { nama: 'Client Demo', email: 'client@tensor.id', role: 'CLIENT', adminId: null, clientId: 'CLIENT-001' },
        token: 'demo-client-token',
    },
};

export default function Login() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authService.login(form);
            const { token, role, nama, email, clientId, adminId } = res;
            loginUser({ nama, email, role, clientId, adminId }, token);
            if (role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/client/dashboard');
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan. Pastikan backend sudah berjalan.');
        } finally {
            setLoading(false);
        }
    };

    // Demo mode — bypass backend completely
    const demoLogin = (role) => {
        const { user, token } = DEMO_USERS[role];
        loginUser(user, token);
        navigate(role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard');
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center p-4"
            style={{ background: '#0b1326' }}>

            <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
                style={{ background: '#060e20' }}>

                {/* ── Left: Branding ── */}
                <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
                    style={{ background: '#131b2e' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
                                <span className="material-symbols-outlined icon-fill text-2xl"
                                    style={{ color: '#003543' }}>memory</span>
                            </div>
                            <span className="font-display font-black text-2xl tracking-widest"
                                style={{ color: '#4cd6ff' }}>TensorLease</span>
                        </div>

                        <h1 className="font-display font-bold text-4xl leading-tight"
                            style={{ color: '#dae2fd' }}>
                            Powering the{' '}
                            <span style={{
                                background: 'linear-gradient(90deg,#4cd6ff,#007c98)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Next Generation
                            </span>
                            {' '}of AI Compute.
                        </h1>

                        <p className="mt-4 text-base leading-relaxed max-w-sm"
                            style={{ color: '#8c90a1' }}>
                            Kelola klaster GPU high-performance dengan presisi enterprise-grade
                            dan pemantauan real-time.
                        </p>

                        <div className="mt-10 space-y-3">
                            {[
                                'GPU NVIDIA A100 & H100 tersedia',
                                'Dashboard monitoring real-time',
                                'Sistem pembayaran retainer fleksibel',
                            ].map(f => (
                                <div key={f} className="flex items-center gap-3 text-sm"
                                    style={{ color: '#c2c6d8' }}>
                                    <span className="material-symbols-outlined text-base"
                                        style={{ color: '#4cd6ff' }}>check_circle</span>
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs relative z-10" style={{ color: '#4a4f62' }}>
                        Dipercaya oleh 500+ Deep Learning Lab
                    </p>

                    {/* Decorative glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 70% 20%, rgba(76,214,255,0.05), transparent 60%)' }} />
                </div>

                {/* ── Right: Login Form ── */}
                <div className="flex items-center justify-center p-8 md:p-12"
                    style={{ background: '#171f33' }}>
                    <div className="w-full max-w-sm">

                        {/* Mobile logo */}
                        <div className="flex items-center gap-3 mb-8 md:hidden">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
                                <span className="material-symbols-outlined icon-fill text-xl"
                                    style={{ color: '#003543' }}>memory</span>
                            </div>
                            <span className="font-display font-black text-xl tracking-widest"
                                style={{ color: '#4cd6ff' }}>TensorLease</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="font-display font-bold text-2xl"
                                style={{ color: '#dae2fd' }}>Selamat Datang</h2>
                            <p className="text-sm mt-1" style={{ color: '#8c90a1' }}>
                                Masuk untuk mengelola klaster GPU Anda.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 p-4 rounded-xl flex items-start gap-3 fade-in"
                                style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                                <span className="material-symbols-outlined text-lg shrink-0"
                                    style={{ color: '#ffb4ab' }}>report</span>
                                <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider"
                                    style={{ color: '#8c90a1' }}>Alamat Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]"
                                        style={{ color: '#4a4f62' }}>mail</span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="nama@perusahaan.com"
                                        className="input input-icon"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider"
                                        style={{ color: '#8c90a1' }}>Password</label>
                                    <Link to="/forgot-password"
                                        className="text-xs font-medium hover:underline"
                                        style={{ color: '#4cd6ff' }}>
                                        Lupa Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]"
                                        style={{ color: '#4a4f62' }}>lock</span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="input input-icon"
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                                        style={{ color: '#4a4f62' }}>
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showPw ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2">
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined text-lg spin">
                                            progress_activity
                                        </span>
                                        Memverifikasi...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">login</span>
                                        Masuk
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-8" style={{ color: '#8c90a1' }}>
                            Belum punya akun?{' '}
                            <Link to="/register"
                                className="font-semibold hover:underline"
                                style={{ color: '#4cd6ff' }}>
                                Daftar Sekarang
                            </Link>
                        </p>

                        {/* Demo Mode */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px" style={{ background: 'rgba(66,70,86,0.4)' }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: '#4a4f62' }}>Demo Tanpa Backend</span>
                                <div className="flex-1 h-px" style={{ background: 'rgba(66,70,86,0.4)' }} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => demoLogin('ADMIN')}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'rgba(205,189,255,0.1)', color: '#cdbdff', border: '1px solid rgba(205,189,255,0.25)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(205,189,255,0.2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(205,189,255,0.1)'}>
                                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                    Preview Admin
                                </button>
                                <button
                                    onClick={() => demoLogin('CLIENT')}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'rgba(76,214,255,0.1)', color: '#4cd6ff', border: '1px solid rgba(76,214,255,0.25)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,214,255,0.2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(76,214,255,0.1)'}>
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    Preview Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}