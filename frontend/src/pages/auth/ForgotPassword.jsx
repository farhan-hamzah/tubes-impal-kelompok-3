import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/AuthService';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message || 'Gagal mengirim email. Coba lagi.');
        } finally {
            setLoading(false);
        }
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
                                Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                            </p>
                            {error && (
                                <div className="mb-4 p-3 rounded-xl flex items-start gap-3 fade-in"
                                    style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                                    <span className="material-symbols-outlined text-lg shrink-0"
                                        style={{ color: '#ffb4ab' }}>report</span>
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
                                        ? <><span className="material-symbols-outlined spin">progress_activity</span> Mengirim...</>
                                        : <><span className="material-symbols-outlined">send</span> Kirim Link Reset</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4 fade-in">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                                <span className="material-symbols-outlined text-3xl" style={{ color: '#4cd6ff' }}>mark_email_read</span>
                            </div>
                            <h2 className="font-display font-bold text-xl mb-2" style={{ color: '#dae2fd' }}>Email Terkirim!</h2>
                            <p className="text-sm mb-6" style={{ color: '#8c90a1' }}>
                                Link reset password telah dikirim ke <strong style={{ color: '#4cd6ff' }}>{email}</strong>.
                            </p>
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