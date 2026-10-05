import React, { useState, useEffect } from 'react';
import { Terminal, X, RefreshCw, Trash2, ChevronUp, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { websiteApi } from '../services/api';

const LiveConsoleDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchLogs();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      const res = await websiteApi.getAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      // quiet fail
    }
  };

  const handleClear = async () => {
    try {
      await websiteApi.clearAuditLogs();
      setLogs([]);
    } catch (err) {
      // quiet fail
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: '1.5rem',
        zIndex: 900,
        width: isOpen ? 'min(700px, 92vw)' : 'auto',
        background: '#090d16',
        border: '1px solid #1e293b',
        borderBottom: 'none',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.25s ease',
        color: '#f8fafc',
      }}
    >
      {/* Header / Trigger bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          cursor: 'pointer',
          background: '#0f172a',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 6px #10b981',
            }}
          />
          <Terminal size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Express API Terminal ({logs.length} events)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>

      {/* Expanded Terminal Body */}
      {isOpen && (
        <div style={{ padding: '0.75rem 1rem', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '0.35rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Live HTTP &amp; Database Activity Feed</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fetchLogs();
                }}
                className="btn btn-secondary btn-xs"
                title="Refresh Logs"
              >
                <RefreshCw size={11} />
                <span>Refresh</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="btn btn-secondary btn-xs"
                title="Clear Logs"
              >
                <Trash2 size={11} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxHeight: '220px',
            }}
          >
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: '#131c2e',
                  }}
                >
                  <span style={{ color: '#64748b', minWidth: '65px' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        log.method === 'POST'
                          ? '#10b981'
                          : log.method === 'PUT'
                          ? '#f59e0b'
                          : log.method === 'DELETE'
                          ? '#ef4444'
                          : '#38bdf8',
                      minWidth: '50px',
                    }}
                  >
                    {log.method}
                  </span>
                  <span style={{ color: '#e2e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.url}
                  </span>
                  <span
                    style={{
                      color: log.statusCode >= 400 ? '#ef4444' : '#10b981',
                      fontWeight: 700,
                    }}
                  >
                    {log.statusCode}
                  </span>
                  <span style={{ color: '#94a3b8' }}>{log.durationMs}ms</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>
                Waiting for incoming Express API requests...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveConsoleDrawer;
