import { AlertTriangle, Cpu, History, RefreshCcw, Trash2, ShieldCheck, Activity, Terminal, ChevronRight, BarChart3, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { triggerChaos, getHistory, clearHistory } from './api';

type HistoryLog = {
  id: string | number;
  message?: string;
  type?: string;
  aiRecommendation?: string;
  timestamp?: string;
  status?: string;
  target?: string;
  duration?: number;
};

function App() {
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? [...data].reverse() : []);
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
    } catch (err: any) {
      if (err.response?.status === 500 && type === 'error500') {
        fetchHistory();
      }
    } finally {
      setTimeout(() => setLoading(false), 1000);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', padding: '60px 40px' }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Top Navigation / Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '80px', borderBottom: '1px solid #27272a', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={32} color="#3b82f6" />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>ResiliEngine <span style={{ color: '#71717a', fontWeight: 400 }}>Monitoring</span></h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#22c55e" /> System Online</span>
                <span style={{ fontSize: '14px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={14} /> PostgreSQL: Connected</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="panel" style={{ padding: '12px 24px', textAlign: 'left', minWidth: '160px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Active Logs</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{history.length}</div>
            </div>
          </div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px' }}>
          
          {/* Action Column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 size={24} color="#3b82f6" /> Chaos Control
              </h2>
              <p style={{ color: '#71717a', fontSize: '15px', lineHeight: '1.6', marginBottom: '40px' }}>
                Trigger fault injection strategies to evaluate infrastructure resilience and recovery patterns.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button className="btn btn-outline" onClick={() => handleTrigger('latency')} disabled={loading}>
                  <Activity size={20} />
                  <div style={{ flex: 1, textAlign: 'left' }}>Inject Latency (+2000ms)</div>
                  <ChevronRight size={18} opacity={0.3} />
                </button>

                <button className="btn btn-outline" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleTrigger('error500')} disabled={loading}>
                  <Terminal size={20} color="#ef4444" />
                  <div style={{ flex: 1, textAlign: 'left' }}>Force Service Failure (500)</div>
                  <ChevronRight size={18} opacity={0.3} />
                </button>
              </div>

              {loading && (
                <div style={{ marginTop: '32px', padding: '16px', border: '1px solid #3b82f6', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                  EXPERIMENT IN PROGRESS...
                </div>
              )}
            </div>
          </aside>

          {/* Logs Column */}
          <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '800px' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History size={24} color="#3b82f6" /> System Audit Logs
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-outline" style={{ padding: '8px 12px', width: 'auto' }} onClick={fetchHistory}><RefreshCcw size={18} /></button>
                <button className="btn btn-danger" style={{ padding: '8px 12px', width: 'auto' }} onClick={handleClear}><Trash2 size={18} /></button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              {history.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', gap: '24px' }}>
                  <Terminal size={64} opacity={0.1} />
                  <p style={{ fontWeight: 500 }}>No system activity recorded in current session.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {history.map((log) => (
                    <div key={log.id} style={{ borderBottom: '1px solid #27272a', paddingBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ width: '48px', height: '48px', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {log.type === 'LATENCY' ? <Activity size={24} color="#3b82f6" /> : <Terminal size={24} color="#ef4444" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: 700 }}>{log.message || `System Fault: ${log.type}`}</div>
                            <div style={{ fontSize: '13px', color: '#71717a', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                              EVENT_ID: {String(log.id).toUpperCase()} • TIMESTAMP: {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className={`badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>{log.status}</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px', backgroundColor: '#09090b', padding: '20px', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Target Resource</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{log.target || 'Infrastructure'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Response Time</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{log.duration}ms</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase' }}>Fault Type</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{log.type}</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ChevronRight size={14} /> AI Analysis Report
                        </div>
                        <div style={{ fontSize: '15px', color: log.aiRecommendation?.includes('[HATA]') ? '#f87171' : '#d1d5db', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                          {log.aiRecommendation || "Generating architectural analysis based on system metrics..."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;