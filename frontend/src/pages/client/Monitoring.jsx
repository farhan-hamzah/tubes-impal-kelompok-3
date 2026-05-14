import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import kontrakService from '../../services/KontrakService';

// ── Mock real-time data generator ──
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const GaugeCircle = ({ value, label, color }) => {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={r} fill="transparent" stroke="#222a3d" strokeWidth="8" />
                    <circle cx="60" cy="60" r={r} fill="transparent" stroke={color} strokeWidth="8"
                        strokeDasharray={circ} strokeDashoffset={offset}
                        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-black" style={{ color: '#dae2fd' }}>{value}%</span>
                </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{ color: '#8c90a1' }}>{label}</p>
            <div className="w-2 h-2 rounded-full mt-2 pulse-dot" style={{ background: color }} />
        </div>
    );
};

const MetricRow = ({ label, value, unit, max, color }) => (
    <div className="flex items-center gap-4">
        <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium" style={{ color: '#c2c6d8' }}>{label}</span>
                <span className="font-bold" style={{ color }}>{value} {unit}</span>
            </div>
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
            </div>
        </div>
    </div>
);

export default function Monitoring() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState({
        gpuUtil: 84, cpuUtil: 32, vramUsed: 42, ramUsed: 512,
        temp: 67, power: 320, netIn: 1.4, netOut: 0.8,
    });
    const [history, setHistory] = useState(Array(30).fill(0).map(() => randomBetween(40, 90)));
    const [activeNode, setActiveNode] = useState(0);
    const [tick, setTick] = useState(0);

    // Simulate live metrics
    useEffect(() => {
        const t = setInterval(() => {
            setMetrics(prev => ({
                gpuUtil: Math.min(99, Math.max(50, prev.gpuUtil + randomBetween(-5, 5))),
                cpuUtil: Math.min(99, Math.max(10, prev.cpuUtil + randomBetween(-3, 4))),
                vramUsed: Math.min(80, Math.max(20, prev.vramUsed + randomBetween(-2, 2))),
                ramUsed: Math.min(1024, Math.max(128, prev.ramUsed + randomBetween(-20, 20))),
                temp: Math.min(85, Math.max(55, prev.temp + randomBetween(-2, 2))),
                power: Math.min(400, Math.max(200, prev.power + randomBetween(-10, 10))),
                netIn: +(Math.random() * 2 + 0.5).toFixed(1),
                netOut: +(Math.random() * 1.5 + 0.2).toFixed(1),
            }));
            setHistory(prev => [...prev.slice(1), randomBetween(40, 95)]);
            setTick(t => t + 1);
        }, 2000);
        return () => clearInterval(t);
    }, []);

    const [contracts, setContracts] = useState([]);
    const [kontrakError, setKontrakError] = useState('');

    useEffect(() => {
        if (!user?.clientId) return;
        const fetchKontrak = async () => {
            try {
                const data = await kontrakService.getKontrakByClient(user.clientId);
                setContracts(Array.isArray(data) ? data : []);
            } catch (err) {
                setKontrakError(err.message || 'Gagal memuat data kontrak.');
            }
        };
        fetchKontrak();
    }, [user?.clientId]);

    const nodes = [
        { id: 'H100-Node-01', type: 'NVIDIA H100 80GB', status: 'ACTIVE' },
        { id: 'H100-Node-02', type: 'NVIDIA H100 80GB', status: 'ACTIVE' },
        { id: 'RTX-Node-03', type: 'NVIDIA RTX 4090', status: 'IDLE' },
    ];

    const maxH = Math.max(...history);

    return (
        <MainLayout pageTitle="Monitoring Klaster">
            <div className="space-y-8">
                {kontrakError && (
                    <div className="p-4 rounded-xl flex items-center gap-3 fade-in"
                        style={{ background: 'rgba(147,0,10,0.2)', borderLeft: '3px solid #ffb4ab' }}>
                        <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>report</span>
                        <p className="text-sm" style={{ color: '#ffb4ab' }}>{kontrakError}</p>
                    </div>
                )}
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#4cd6ff' }}>Live Data</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-extrabold" style={{ color: '#dae2fd' }}>
                            Monitoring <span style={{ color: '#4cd6ff' }}>Klaster</span>
                        </h1>
                        <p className="text-sm mt-2" style={{ color: '#8c90a1' }}>
                            Telemetri real-time klaster GPU Anda. Diperbarui setiap 2 detik.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#4a4f62' }}>
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Tick #{tick}
                    </div>
                </div>

                {/* Node Selector */}
                <div className="flex gap-3 flex-wrap">
                    {nodes.map((node, i) => (
                        <button key={node.id} onClick={() => setActiveNode(i)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                            style={activeNode === i
                                ? { background: 'rgba(76,214,255,0.12)', border: '1px solid rgba(76,214,255,0.4)', color: '#dae2fd' }
                                : { background: '#131b2e', border: '1px solid rgba(66,70,86,0.3)', color: '#8c90a1' }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: node.status === 'ACTIVE' ? '#4cd6ff' : '#424656' }} />
                            <div className="text-left">
                                <p className="text-xs font-bold">{node.id}</p>
                                <p className="text-[10px]" style={{ color: '#4a4f62' }}>{node.type}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Gauges + Line Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Gauges */}
                    <div className="lg:col-span-4 card p-6 flex flex-col items-center justify-around gap-6">
                        <h3 className="font-display font-bold text-lg self-start" style={{ color: '#dae2fd' }}>
                            Utilisasi Sumber Daya
                        </h3>
                        <div className="flex justify-around w-full flex-wrap gap-6">
                            <GaugeCircle value={metrics.gpuUtil} label="GPU Compute" color="#4cd6ff" />
                            <GaugeCircle value={metrics.cpuUtil} label="CPU Cores" color="#cdbdff" />
                            <GaugeCircle value={Math.round((metrics.vramUsed / 80) * 100)} label="VRAM" color="#ffb59d" />
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-8 card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>GPU Utilization — Live</h3>
                                <p className="text-xs mt-1" style={{ color: '#8c90a1' }}>Node: {nodes[activeNode].id}</p>
                            </div>
                            <span className="badge badge-active">
                                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#4cd6ff' }} />
                                {metrics.gpuUtil}%
                            </span>
                        </div>
                        <div className="h-48 flex items-end gap-1 relative">
                            {history.map((v, i) => (
                                <div key={i} className="flex-1 rounded-t-sm transition-all duration-300"
                                    style={{
                                        height: `${(v / maxH) * 100}%`,
                                        background: i === history.length - 1
                                            ? '#4cd6ff'
                                            : `rgba(76,214,255,${0.05 + (i / history.length) * 0.3})`,
                                    }} />
                            ))}
                            {/* Latest value callout */}
                            <div className="absolute top-0 right-0 glass px-3 py-2 rounded-xl">
                                <p className="text-[10px] font-bold" style={{ color: '#4cd6ff' }}>SAAT INI</p>
                                <p className="font-bold text-sm" style={{ color: '#dae2fd' }}>{history[history.length - 1]}%</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3">
                            {['30s lalu', '20s', '10s', 'Sekarang'].map(l => (
                                <span key={l} className="text-[10px]" style={{ color: '#4a4f62' }}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h3 className="font-display font-bold text-lg mb-6" style={{ color: '#dae2fd' }}>Hardware Metrics</h3>
                        <div className="space-y-5">
                            <MetricRow label="VRAM Used" value={metrics.vramUsed} unit="GB" max={80} color="#4cd6ff" />
                            <MetricRow label="System RAM" value={metrics.ramUsed} unit="MB" max={1024} color="#cdbdff" />
                            <MetricRow label="GPU Temperature" value={metrics.temp} unit="°C" max={100} color={metrics.temp > 80 ? '#ffb4ab' : '#4cd6ff'} />
                            <MetricRow label="Power Draw" value={metrics.power} unit="W" max={400} color="#ffb59d" />
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-display font-bold text-lg mb-6" style={{ color: '#dae2fd' }}>Network & Status</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Throughput In', value: `${metrics.netIn} GB/s`, color: '#4cd6ff', icon: 'arrow_downward' },
                                { label: 'Throughput Out', value: `${metrics.netOut} GB/s`, color: '#cdbdff', icon: 'arrow_upward' },
                                { label: 'Uptime', value: '14h 32m 08s', color: '#4cd6ff', icon: 'schedule' },
                                { label: 'Node Status', value: nodes[activeNode].status, color: nodes[activeNode].status === 'ACTIVE' ? '#4cd6ff' : '#8c90a1', icon: 'circle' },
                                { label: 'GPU Type', value: nodes[activeNode].type, color: '#dae2fd', icon: 'memory' },
                                { label: 'Region', value: 'US-EAST-01', color: '#dae2fd', icon: 'location_on' },
                            ].map(({ label, value, color, icon }) => (
                                <div key={label} className="flex items-center justify-between py-2.5"
                                    style={{ borderBottom: '1px solid rgba(66,70,86,0.15)' }}>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: '#4a4f62' }}>{icon}</span>
                                        <span className="text-sm" style={{ color: '#c2c6d8' }}>{label}</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
