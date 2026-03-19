import React from 'react';
import { LayoutGrid, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

const Footer = ({ assets }) => {
  const totalValue = assets.reduce((sum, a) => {
    const n = parseFloat(a.value.replace(/[$M]/g, ''));
    return sum + n;
  }, 0).toFixed(1);

  // Dynamic KPIs based on filtered assets
  const total = assets.length || 1;
  const increased = assets.filter(a => a.trendDir === 'up').length;
  const decreased = assets.filter(a => a.trendDir === 'down').length;
  const unchanged = total - increased - decreased;

  const incPct = Math.round((increased / total) * 100);
  const decPct = Math.round((decreased / total) * 100);
  const uncPct = Math.round((unchanged / total) * 100);

  // Predictive KPIs (3-6 Months) - averaged across filtered assets
  const avgPredIncrease = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.increase || 0), 0) / assets.length) : 0;
  const avgPredDecrease = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.decrease || 0), 0) / assets.length) : 0;
  const avgPredStable = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.stable || 0), 0) / assets.length) : 0;

  return (
    <footer style={{
      height: 48,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(6,6,14,0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      gap: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Core Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{assets.length}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Assets</span>
          </div>
          <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>${totalValue}M</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio</span>
          </div>
        </div>

        <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.1)' }} />

        {/* Dynamic Performance KPIs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Increased in value">
              <TrendingUp size={11} color="#2ecc71" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2ecc71' }}>{incPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Decreased in value">
              <TrendingDown size={11} color="#ff4d4d" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ff4d4d' }}>{decPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Unchanged">
              <Clock size={11} color="#94a3b8" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{uncPct}%</span>
            </div>
          </div>
        </div>

        <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.1)' }} />

        {/* Predictive KPIs (3-6M) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }} title="Click for details">3-6M Forecast:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>
              <span style={{ color: '#2ecc71' }}>+{avgPredIncrease}%</span> / 
              <span style={{ color: '#ff4d4d' }}> -{avgPredDecrease}%</span> / 
              <span style={{ color: '#94a3b8' }}> {avgPredStable}% stable</span>
            </div>
            <Activity size={12} color="#3b82f6" style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* Quick status pills */}
      <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
        {[
          { label: 'Crit', count: assets.filter(a => a.status === 'CRITICAL').length, color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)' },
          { label: 'Elev', count: assets.filter(a => a.status === 'ELEVATED').length, color: '#ff9f43', bg: 'rgba(255,159,67,0.1)' },
          { label: 'Safe', count: assets.filter(a => a.status === 'SAFE').length, color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, padding: '2px 9px', borderRadius: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 8, color: '#475569', fontWeight: 600 }}>{s.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
