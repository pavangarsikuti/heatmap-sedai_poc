import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, Target, Zap } from 'lucide-react';

const Footer = ({ assets, filters }) => {
  const kpis = useMemo(() => {
    const total = assets.length || 1;

    // Portfolio value
    const totalValue = assets.reduce((sum, a) => {
      const valStr = a.value ? a.value.toString() : '0';
      const n = parseFloat(valStr.replace(/[$M]/g, ''));
      return sum + (isNaN(n) ? 0 : n);
    }, 0).toFixed(1);

    // Average risk score
    const avgScore = assets.length
      ? Math.round((assets.reduce((sum, a) => sum + a.score, 0) / total) * 10) / 10
      : 0;

    // Performance trends
    const increased = assets.filter(a => a.trendDir === 'up').length;
    const decreased = assets.filter(a => a.trendDir === 'down').length;
    const unchanged = total - increased - decreased;
    const incPct = Math.round((increased / total) * 100);
    const decPct = Math.round((decreased / total) * 100);
    const uncPct = Math.round((unchanged / total) * 100);

    // Risk distribution
    const critCount = assets.filter(a => a.status === 'CRITICAL').length;
    const elevCount = assets.filter(a => a.status === 'ELEVATED').length;
    const modCount = assets.filter(a => a.status === 'MODERATE').length;
    const safeCount = assets.filter(a => a.status === 'SAFE').length;

    // Top risk driver (most common first driver among filtered assets)
    const driverCounts = {};
    assets.forEach(a => {
      if (a.drivers?.[0]) {
        const lbl = a.drivers[0].label;
        driverCounts[lbl] = (driverCounts[lbl] || 0) + 1;
      }
    });
    const topDriver = Object.keys(driverCounts).length
      ? Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0][0]
      : '—';

    // Predictive KPIs averaged
    const tfLabel = filters?.timeframe === '3 Months' ? '3M' : filters?.timeframe === '6 Months' ? '6M' : '12M';
    const avgPredIncrease = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.increase || 0), 0) / assets.length) : 0;
    const avgPredDecrease = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.decrease || 0), 0) / assets.length) : 0;
    const avgPredStable = assets.length ? Math.round(assets.reduce((sum, a) => sum + (a.predictions?.stable || 0), 0) / assets.length) : 0;

    return {
      total, totalValue, avgScore, incPct, decPct, uncPct,
      critCount, elevCount, modCount, safeCount,
      topDriver, tfLabel, avgPredIncrease, avgPredDecrease, avgPredStable,
    };
  }, [assets, filters]);

  // Avg score color
  const scoreColor = kpis.avgScore >= 55 ? '#ff4d4d' : kpis.avgScore >= 35 ? '#ffcd3c' : '#2ecc71';

  // Active filter context
  const activeFilterLabels = [];
  if (filters) {
    if (filters.riskType !== 'All Risks') activeFilterLabels.push(filters.riskType);
    if (filters.timeframe !== '12 Months') activeFilterLabels.push(filters.timeframe);
    if (filters.country !== 'All') activeFilterLabels.push(filters.country);
    if (filters.assetType !== 'All') activeFilterLabels.push(filters.assetType);
    if (filters.status !== 'All') activeFilterLabels.push(filters.status);
  }

  return (
    <footer style={{
      minHeight: 52,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(6,6,14,0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      gap: 16,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Core Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{kpis.total}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Assets</span>
          </div>
          <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>${kpis.totalValue}M</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio</span>
          </div>
        </div>

        <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.08)' }} />

        {/* Avg Risk Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={11} color={scoreColor} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Risk:</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: scoreColor }}>{kpis.avgScore}</span>
        </div>

        <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.08)' }} />

        {/* Performance KPIs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Perf:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingUp size={10} color="#ff4d4d" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ff4d4d' }}>{kpis.incPct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <TrendingDown size={10} color="#2ecc71" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2ecc71' }}>{kpis.decPct}%</span>
            </div>
          </div>
        </div>

        <div style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.08)' }} />

        {/* Forecast */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpis.tfLabel} Forecast:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#2ecc71' }}>+{kpis.avgPredIncrease}%</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ff4d4d' }}>-{kpis.avgPredDecrease}%</span>
            <Activity size={10} color="#3b82f6" style={{ opacity: 0.6 }} />
          </div>
        </div>
      </div>

      {/* Right side status pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Crit', count: kpis.critCount, color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)' },
          { label: 'Elev', count: kpis.elevCount, color: '#ff9f43', bg: 'rgba(255,159,67,0.1)' },
          { label: 'Mod', count: kpis.modCount, color: '#ffcd3c', bg: 'rgba(255,205,60,0.1)' },
          { label: 'Safe', count: kpis.safeCount, color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: s.bg, padding: '2px 8px', borderRadius: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 7, color: '#475569', fontWeight: 600 }}>{s.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;


