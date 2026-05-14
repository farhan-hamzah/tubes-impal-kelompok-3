import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/UserService';

export default function Profile() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        nama: user?.nama || '',
        email: user?.email || '',
        nomorTelepon: user?.nomorTelepon || '',
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.clientId && !user?.adminId) return;
        const userId = user?.clientId || user?.adminId;
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile(userId);
                if (data) {
                    setForm(prev => ({
                        ...prev,
                        nama: data.nama || prev.nama,
                        email: data.email || prev.email,
                        nomorTelepon: data.nomorTelepon || prev.nomorTelepon,
                    }));
                }
            } catch {
                // Silently fall back to auth context values
            }
        };
        fetchProfile();
    }, [user?.clientId, user?.adminId]);

    const handleSave = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userId = user?.clientId || user?.adminId;
            await userService.updateProfile(userId, form);
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.message || 'Gagal menyimpan profil.');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <MainLayout pageTitle="Profil Saya">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-4xl font-extrabold" style={{ color: '#dae2fd' }}>
                        Profil <span style={{ color: '#4cd6ff' }}>Saya</span>
                    </h1>
                    <p className="text-sm mt-2" style={{ color: '#8c90a1' }}>
                        Kelola informasi akun dan preferensi Anda.
                    </p>
                </div>

                {saved && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(76,214,255,0.1)', border: '1px solid rgba(76,214,255,0.3)' }}>
                        <span className="material-symbols-outlined" style={{ color: '#4cd6ff' }}>check_circle</span>
                        <p className="text-sm font-medium" style={{ color: '#4cd6ff' }}>Profil berhasil diperbarui!</p>
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{error}</p>
                    </div>
                )}

                {/* Avatar & Role */}
                <div className="card p-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-black text-3xl shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(76,214,255,0.2), rgba(0,124,152,0.2))', border: '2px solid rgba(76,214,255,0.3)', color: '#4cd6ff' }}>
                        {(user?.nama || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-display text-2xl font-bold" style={{ color: '#dae2fd' }}>
                            {user?.nama}
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: '#8c90a1' }}>{user?.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="badge badge-active">
                                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />
                                {isAdmin ? 'Administrator' : 'Client'}
                            </span>
                            <span className="badge" style={{ background: '#222a3d', color: '#8c90a1' }}>
                                ID: {isAdmin ? user?.adminId : user?.clientId}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setEditing(!editing)} className="btn-secondary">
                        <span className="material-symbols-outlined text-[18px]">
                            {editing ? 'close' : 'edit'}
                        </span>
                        {editing ? 'Batal' : 'Edit'}
                    </button>
                </div>

                {/* Form */}
                <div className="card p-6">
                    <h3 className="font-display font-bold text-lg mb-6" style={{ color: '#dae2fd' }}>
                        Informasi Akun
                    </h3>
                    <form onSubmit={handleSave} className="space-y-5">
                        {[
                            { name: 'nama', label: 'Nama Lengkap', icon: 'badge', type: 'text' },
                            { name: 'email', label: 'Alamat Email', icon: 'mail', type: 'email' },
                            { name: 'nomorTelepon', label: 'Nomor Telepon', icon: 'phone', type: 'tel' },
                        ].map(({ name, label, icon, type }) => (
                            <div key={name} className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#8c90a1' }}>{label}</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: '#4a4f62' }}>{icon}</span>
                                    <input type={type} value={form[name]} disabled={!editing}
                                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                                        className="input input-icon"
                                        style={{ opacity: editing ? 1 : 0.6, cursor: editing ? 'text' : 'default' }} />
                                </div>
                            </div>
                        ))}
                        {editing && (
                            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                                {loading
                                    ? <><span className="material-symbols-outlined text-lg spin">progress_activity</span> Menyimpan...</>
                                    : <><span className="material-symbols-outlined text-lg">save</span> Simpan Perubahan</>}
                            </button>
                        )}
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="card p-6" style={{ borderColor: 'rgba(255,180,171,0.2)' }}>
                    <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#ffb4ab' }}>Zona Berbahaya</h3>
                    <p className="text-sm mb-4" style={{ color: '#8c90a1' }}>Tindakan ini tidak dapat dibatalkan. Harap pertimbangkan dengan matang.</p>
                    <button className="btn-danger">
                        <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                        Hapus Akun
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}