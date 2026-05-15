import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authService.forgotPassword(email);
            // Ambil token dari response
            const token = res?.resetToken || res?.data?.resetToken || res;
            setResetToken(token);
            setSent(true);
        } catch (err) {
            setError(err.message || 'Gagal membuat token. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(resetToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLanjut = () => {
        navigate('/reset-password', { state: { token: resetToken, email } });
    };

    return (
        <div className="min-h-screen grid-bg flex items-center justify-center p-4" style={{ background: '#0b1326' }}>
            <div className="w-full max-w-sm fade-in">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#4cd6ff,#007c98)' }}>
                        <span className="material-symbols-outlined icon-fill text-2xl" style={{ color: '#003543' }}>memory</span>
                    </div>
                    <span className="font-display font-black text-2xl tracking-widest" style={{ color: '#4cd6ff' }}>TensorLease</span>
                </div>

                <div className="card p-8" style={{ background: '#171f33' }}>
                    {!sent ? (
                        <>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.2)' }}>
                                <span className="material-symbols-outlined text-3xl" style={{ color: '#4cd6ff' }}>lock_reset</span>
                            </div>
                            <h2 className="font-display font-bold text-2xl text-center mb-2" style={{ color: '#dae2fd' }}>Reset Password</h2>
                            <p className="text-sm text-center mb-8" style={{ color: '#8c90a1' }}>
                                Masukkan email Anda untuk mendapatkan token reset password.
                            </p>
                            {error && (
                                <div className="mb-4 p-3 rounded-xl flex items-start gap-3 fade-in"
                                    style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                                    <span className="material-symbols-outlined text-lg shrink-0" style={{ color: '#ffb4ab' }}>report</span>
                                    <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>Alamat Email</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#4a4f62' }}>mail</span>
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                            placeholder="nama@perusahaan.com" className="input input-icon" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full">
                                    {loading
                                        ? <><span className="material-symbols-outlined spin">progress_activity</span> Memproses...</>
                                        : <><span className="material-symbols-outlined">key</span> Dapatkan Token Reset</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="fade-in">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                                <span className="material-symbols-outlined text-3xl" style={{ color: '#4cd6ff' }}>key</span>
                            </div>
                            <h2 className="font-display font-bold text-xl text-center mb-2" style={{ color: '#dae2fd' }}>Token Berhasil Dibuat!</h2>
                            <p className="text-sm text-center mb-4" style={{ color: '#8c90a1' }}>
                                Gunakan token di bawah ini untuk reset password. Token berlaku <strong style={{ color: '#ffb347' }}>15 menit</strong>.
                            </p>

                            {/* Token display */}
                            <div className="rounded-xl p-3 mb-4 flex items-center gap-2"
                                style={{ background: 'rgba(76,214,255,0.05)', border: '1px solid rgba(76,214,255,0.2)' }}>
                                <p className="text-xs font-mono flex-1 break-all" style={{ color: '#4cd6ff' }}>
                                    {resetToken}
                                </p>
                                <button onClick={handleCopy} className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition"
                                    title="Copy token">
                                    <span className="material-symbols-outlined text-lg" style={{ color: copied ? '#4ade80' : '#4cd6ff' }}>
                                        {copied ? 'check' : 'content_copy'}
                                    </span>
                                </button>
                            </div>

                            <p className="text-xs text-center mb-6" style={{ color: '#8c90a1' }}>
                                Salin token di atas, lalu klik tombol di bawah untuk reset password.
                            </p>

                            <button onClick={handleLanjut} className="btn-primary w-full mb-3">
                                <span className="material-symbols-outlined">arrow_forward</span>
                                Lanjut Reset Password
                            </button>
                        </div>
                    )}
                    <Link to="/login" className="flex items-center justify-center gap-2 text-sm mt-4 hover:underline"
                        style={{ color: '#4cd6ff' }}>
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}