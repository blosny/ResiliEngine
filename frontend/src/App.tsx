import { AlertTriangle, Cpu, History, RefreshCcw, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { triggerChaos, getHistory, clearHistory } from './api';

type HistoryLog = {
  id: string | number;
  message?: string;
  type?: string;
  aiRecommendation?: string;
};

function App() {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Geçmiş yüklenemedi", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrigger = async (type: 'latency' | 'error500') => {
    setLoading(true);
    try {
      await triggerChaos(type);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Hata enjekte edilemedi. Lütfen bağlantıları kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      console.error(err);
      alert("Hata silinemedi");
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100%', boxSizing: 'border-box', color: 'white', padding: '3rem 5%', fontFamily: '"Inter", sans-serif', position: 'relative' }}>
      
      {/* Background gradients */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vh', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(15,23,42,0) 70%)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vh', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, rgba(15,23,42,0) 70%)', zIndex: 0 }} />

      <header style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', width: '100%', maxWidth: '1600px', margin: '0 auto 3rem auto' }}>
        <Cpu size={44} color="#38bdf8" style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }} />
        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc', lineHeight: '1.2', display: 'block' }}>
          ResiliEngine
        </h1>
      </header>

      <main style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '3rem', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
        
        <section>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              <AlertTriangle color="#fbbf24" size={24} /> Kaos Enjektörü
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Mikroservis mimarisini zorlamak için sisteme kontrollü hatalar enjekte edin.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => handleTrigger('latency')} disabled={loading} style={{ padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.8))', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                {loading ? 'İşleniyor...' : '3sn Gecikme (Latency) Ekle'}
              </button>
              
              <button onClick={() => handleTrigger('error500')} disabled={loading} style={{ padding: '1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
                {loading ? 'İşleniyor...' : 'HTTP 500 Hatası Fırlat'}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
                <History color="#38bdf8" size={24} /> Etkileşim Geçmişi ve AI
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleClear} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <Trash2 size={20} />
                </button>
                <button onClick={fetchHistory} style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '0.5rem', borderRadius: '8px', color: '#38bdf8', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <RefreshCcw size={20} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem', flex: 1 }}>
              {history.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem 0' }}>Hiçbir aktivite bulunamadı. Lütfen bir kaos enjekte edin.</div>}
              
              {history.map((log: HistoryLog) => (
                <div key={log.id} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #38bdf8', borderTop: '1px solid rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.05em' }}>{log.type}</span>
                    <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{log.message || "Simülasyon"}</span>
                  </div>
                  
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <strong style={{ color: '#4ade80', display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>✧ Yapay Zekâ Analizi Durumu</strong>
                    <p style={{ color: log.aiRecommendation?.includes('[HATA]') ? '#ef4444' : log.aiRecommendation?.includes('[BİLGİ]') ? '#facc15' : log.aiRecommendation ? '#e2e8f0' : '#64748b', margin: 0, lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {log.aiRecommendation || "Analiz bekleniyor..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
      {/* Version anchor */}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', zIndex: 10 }}>
        v1.0
      </div>
    </div>
  );
}

export default App;