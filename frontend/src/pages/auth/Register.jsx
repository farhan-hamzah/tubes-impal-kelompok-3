import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/AuthService';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nama: '', email: '', password: '', konfirmasi: '', nomorTelepon: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password !== form.konfirmasi) {
            setError('Password dan konfirmasi tidak cocok.'); return;
        }
        setLoading(true); setError('');
        try {
            await authService.register({ nama: form.nama, email: form.email, password: form.password, nomorTelepon: form.nomorTelepon });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Pendaftaran gagal. Coba lagi.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: '#0b1326' }}>
            <div className="w-full max-w-md fade-in">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
                        <span className="material-symbols-outlined icon-fill text-2xl" style={{ color: '#003543' }}>memory</span>
                    </div>
                    <span className="font-display font-black text-2xl tracking-widest" style={{ color: '#4cd6ff' }}>TensorLease</span>
                </div>

                <div className="card p-8" style={{ background: '#171f33' }}>
                    <h2 className="font-display font-bold text-2xl mb-1" style={{ color: '#dae2fd' }}>Buat Akun Baru</h2>
                    <p className="text-sm mb-8" style={{ color: '#8c90a1' }}>Daftar dan mulai gunakan klaster GPU hari ini.</p>

                    {error && (
                        <div className="mb-5 p-4 rounded-xl flex items-start gap-3 fade-in"
                            style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                            <span className="material-symbols-outlined text-lg shrink-0" style={{ color: '#ffb4ab' }}>report</span>
                            <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { name: 'nama', label: 'Nama Lengkap', icon: 'badge', type: 'text', placeholder: 'John Doe' },
                            { name: 'email', label: 'Alamat Email', icon: 'mail', type: 'email', placeholder: 'nama@perusahaan.com' },
                            { name: 'nomorTelepon', label: 'Nomor Telepon', icon: 'phone', type: 'tel', placeholder: '+62 812 xxxx xxxx' },
                            { name: 'password', label: 'Password', icon: 'lock', type: 'password', placeholder: '••••••••' },
                            { name: 'konfirmasi', label: 'Konfirmasi Password', icon: 'lock_reset', type: 'password', placeholder: '••••••••' },
                        ].map(({ name, label, icon, type, placeholder }) => (
                            <div key={name} className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#4a4f62' }}>{icon}</span>
                                    <input name={name} type={type} required value={form[name]}
                                        onChange={handleChange} placeholder={placeholder}
                                        className="input input-icon" />
                                </div>
                            </div>
                        ))}

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                            {loading
                                ? <><span className="material-symbols-outlined text-lg spin">progress_activity</span> Mendaftar...</>
                                : <><span className="material-symbols-outlined text-lg">person_add</span> Daftar Sekarang</>}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6" style={{ color: '#8c90a1' }}>
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-semibold hover:underline" style={{ color: '#4cd6ff' }}>Masuk</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}