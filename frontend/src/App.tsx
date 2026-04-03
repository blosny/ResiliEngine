import { AlertTriangle, Cpu, History, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { triggerChaos, getHistory } from './api';

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
      alert(`${type.toUpperCase()} hatası başarıyla enjekte edildi!`);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Hata enjekte edilemedi. Arda'nın CORS ayarını yapması gerekebilir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <Cpu size={40} color="#38bdf8" />
        <h1 style={{ fontSize: '2rem', margin: 0 }}>ResiliEngine <span style={{ color: '#38bdf8', fontSize: '1rem' }}>v1.0</span></h1>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <section>
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
              <AlertTriangle color="#fbbf24" /> Kaos Enjektörü
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={() => handleTrigger('latency')} disabled={loading} style={{ padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                3sn Gecikme (Latency) Ekle
              </button>
              <button onClick={() => handleTrigger('error500')} disabled={loading} style={{ padding: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                HTTP 500 Hatası Fırlat
              </button>
            </div>
          </div>
        </section>

        <section>
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                <History color="#38bdf8" /> Aktivite ve AI Analizleri
              </h2>
              <button onClick={fetchHistory} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
                <RefreshCcw size={20} />
              </button>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.length === 0 && <p style={{ color: '#64748b' }}>Kayıtlar yükleniyor...</p>}
              {history.map((log: HistoryLog) => (
                <div key={log.id} style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                  <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>Hata: {log.message || log.type}</p>
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '6px' }}>
                    <strong style={{ color: '#4ade80' }}>AI Tavsiyesi:</strong>
                    <p style={{ color: '#cbd5e1' }}>{log.aiRecommendation || "Analiz bekleniyor..."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;