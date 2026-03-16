import React from 'react';
import { LayoutGrid, TrendingUp } from 'lucide-react';

const Footer = ({ assets }) => {
  const totalValue = assets.reduce((sum, a) => {
    const n = parseFloat(a.value.replace(/[$M]/g, ''));
    return sum + n;
  }, 0).toFixed(1);

  const critical = assets.filter(a => a.status === 'CRITICAL').length;
  const elevated = assets.filter(a => a.status === 'ELEVATED').length;

  return (
    <footer style={{
      height: 40,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(6,6,14,0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{assets.length}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Assets</span>
        </div>

        <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{critical + elevated}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Significant</span>
          <TrendingUp size={11} color="#2ecc71" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#2ecc71' }}>${totalValue}M</span>
        </div>

        <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#334155' }}>
          <LayoutGrid size={11} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Portfolio Value</span>
        </div>
      </div>

      {/* Quick status pills */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: 'Critical', count: assets.filter(a => a.status === 'CRITICAL').length, color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)' },
          { label: 'Elevated', count: assets.filter(a => a.status === 'ELEVATED').length, color: '#ff9f43', bg: 'rgba(255,159,67,0.1)' },
          { label: 'Moderate', count: assets.filter(a => a.status === 'MODERATE').length, color: '#ffcd3c', bg: 'rgba(255,205,60,0.1)' },
          { label: 'Safe', count: assets.filter(a => a.status === 'SAFE').length, color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, padding: '2px 9px', borderRadius: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 9, color: '#334155', fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
