import { AlertTriangle, Cpu, History, RefreshCcw, Trash2, ShieldCheck, Activity, Terminal, ChevronRight, BarChart3, Database, Lock, Zap, FileText, Send, Info, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { triggerChaos, getHistory, clearHistory, analyzeCustomLog } from './api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type HistoryLog = {
  id: string | number;
  message?: string;
  type?: string;
  aiRecommendation?: string;
  timestamp?: string;
  status?: string;
  target?: string;
  duration?: number;
  mode?: 'live' | 'cached' | 'fallback';
};

function App() {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Grafik için son 10 kaydı formatla
  const chartData = useMemo(() => {
    const lastLogs = [...history].reverse().slice(-10);
    if (lastLogs.length === 0) {
      return Array.from({ length: 10 }).map((_, i) => ({ name: i, value: 50 + Math.random() * 20 }));
    }
    return lastLogs.map((log, index) => ({
      name: index,
      value: log.type === 'LATENCY' ? (log.duration || 2000) : (log.status === 'FAILED' ? 500 : 50 + Math.random() * 20),
      type: log.type
    }));
  }, [history]);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      const logs = Array.isArray(data) ? [...data].reverse() : [];
      setHistory(logs);
    } catch (err) {
      console.error("Geçmiş yüklenemedi", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrigger = async (type: 'latency' | 'error500' | '429' | '401') => {
    setLoading(true);
    try {
      await triggerChaos(type);
      await fetchHistory();
    } catch (err: any) {
      await fetchHistory();
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Sistem geçmişini temizlemek istediğinize emin misiniz?")) {
      try {
        await clearHistory();
        setHistory([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', padding: '40px 20px' }}>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header Section */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '60px', borderBottom: '1px solid #27272a', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' }}>
              <Cpu size={32} color="#3b82f6" />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>ResiliEngine <span style={{ color: '#71717a', fontWeight: 400 }}>v2.0</span></h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#71717a' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></div>
                  Sunucu: Aktif
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#71717a' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></div>
                  AI Servisi: Çalışıyor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#71717a' }}>
                  <Database size={14} color="#3b82f6" />
                  Veritabanı: Bağlı
                </div>
              </div>
            </div>
          </div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: '40px' }}>

          {/* Controls & Tools */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Live Performance Graph */}
            <div className="panel" style={{ padding: '24px', height: '240px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#3b82f6" /> Performans Monitörü
                </h2>
                <span style={{ fontSize: '11px', color: '#71717a' }}>Sistem Yanıt Süresi (ms)</span>
              </div>
              <div style={{ width: '100%', height: '140px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 2500]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chaos Control Panel Kaldırıldı - Faz 5 (Live Monitor) Revizyonu */}
            <div className="panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={24} color="#22c55e" /> Aktif İzleme Devrede
              </h2>
              <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.6' }}>
                ResiliEngine Guard arka planda projenizi izliyor. Herhangi bir terminal hatası (Exception, Error vb.) tespit edildiğinde yapay zeka tarafından analiz edilerek bu ekrana yansıtılacaktır.
              </p>
              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="pulse-green" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                  Guard.js Dinleniyor...
                </div>
              </div>
            </div>
          </aside>

          {/* Audit Logs & AI Analysis */}
          <section className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '800px' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History size={24} color="#3b82f6" /> Deney ve Analiz Geçmişi
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ padding: '8px', width: '40px' }} onClick={fetchHistory}><RefreshCcw size={18} /></button>
                <button className="btn btn-danger" style={{ padding: '8px', width: '40px' }} onClick={handleClear}><Trash2 size={18} /></button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              {history.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', gap: '16px' }}>
                  <ShieldCheck size={48} opacity={0.2} />
                  <p style={{ fontSize: '14px' }}>Sistem boşta. Gösterilecek olay yok.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {history.map((log) => (
                    <div key={log.id} style={{ borderBottom: '1px solid #27272a', paddingBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {log.type === 'LATENCY' ? <Activity size={20} color="#3b82f6" /> :
                              log.type === 'CUSTOM' ? <FileText size={20} color="#a855f7" /> :
                                <Terminal size={20} color="#ef4444" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 700 }}>
                              {log.type === 'LATENCY' ? 'Gecikme Testi' :
                                log.type === 'ERROR_500' ? 'Servis Çökme Testi' :
                                  log.type === 'RATE_LIMIT' || log.type === '429' ? 'Sınır Aşımı Testi' :
                                    log.type === 'UNAUTHORIZED' || log.type === '401' ? 'Yetki Hatası Testi' :
                                      `${log.type} Hatası`}
                            </div>
                            <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'monospace' }}>
                              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'ŞİMDİ'} • HEDEF: {log.target}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-injection'}`} style={{ fontSize: '10px' }}>
                            {log.status === 'SUCCESS' ? 'NORMAL ÇALIŞMA' : 'BAŞARILI ENJEKSİYON'}
                          </div>
                          {log.mode && (
                            <div style={{
                              fontSize: '10px',
                              padding: '2px 10px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: log.mode === 'live' ? 'rgba(59, 130, 246, 0.15)' : log.mode === 'cached' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: log.mode === 'live' ? '#60a5fa' : log.mode === 'cached' ? '#4ade80' : '#fbbf24',
                              border: `1px solid ${log.mode === 'live' ? '#3b82f6' : log.mode === 'cached' ? '#22c55e' : '#f59e0b'}`
                            }}>
                              {log.mode === 'live' && <div className="pulse-blue" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60a5fa' }}></div>}
                              {log.mode === 'live' ? 'CANLI AI' : log.mode === 'cached' ? 'HAFIZADAN' : 'YEREL MOTOR'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'rgba(24, 24, 27, 0.5)', border: '1px solid #27272a', borderRadius: '12px', padding: '20px', borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '10px' }}>
                          <Info size={14} /> Mimari İyileştirme Önerisi
                        </div>
                        <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                          {log.aiRecommendation || "Sistem etkisi ve çözüm yolları analiz ediliyor..."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        .pulse-blue { animation: pulse-blue 2s infinite; }
        .pulse-green { animation: pulse-green 2s infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-blue { 0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(96, 165, 250, 0); } 100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); } }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        .panel { background: rgba(12, 12, 14, 0.6); border: 1px solid #27272a; border-radius: 16px; backdrop-filter: blur(12px); transition: all 0.2s ease; }
        .btn { display: flex; alignItems: center; justifyContent: center; gap: 8px; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .btn-primary { background: #3b82f6; color: #fff; }
        .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
        .btn-outline { background: transparent; border: 1px solid #27272a; color: #fff; }
        .btn-outline:hover { background: #18181b; border-color: #3b82f6; }
        .btn-danger { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .badge { padding: 4px 10px; border-radius: 6px; font-weight: 700; text-transform: uppercase; }
        .badge-success { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
        .badge-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
        .badge-injection { background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2); }
      `}</style>
    </div>
  );
}

export default App;