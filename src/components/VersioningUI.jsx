import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

export const VersionBadge = ({ type, version, date }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 6,
  }}>
    <span style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>{type.toUpperCase()}</span>
    <span style={{ fontSize: 10, fontWeight: 900, color: '#f8fafc' }}>{version}</span>
    {date && <span style={{ fontSize: 9, color: '#334155', fontWeight: 600 }}>({date})</span>}
  </div>
);

export const VersionControl = ({ portfolioVersion, dataVersion, onUpdatePortfolio, onShowChangelog }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <VersionBadge type="Data" version={dataVersion} date="12 Mar" />
      <VersionBadge type="Portfolio" version={portfolioVersion} date="Latest" />
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <button 
        onClick={onUpdatePortfolio}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 8,
          color: '#2ecc71',
          fontSize: 10,
          fontWeight: 900,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          letterSpacing: '0.02em'
        }}
        onMouseEnter={e => { 
          e.currentTarget.style.background = 'rgba(34,197,94,0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => { 
          e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <CheckCircle size={12} /> MARK VERIFIED
      </button>

      <button 
        onClick={onShowChangelog}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: 10,
          fontWeight: 800,
          cursor: 'pointer',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(59,130,246,0.2)',
          paddingBottom: 2,
          transition: 'all 0.2s',
          letterSpacing: '0.01em'
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.borderColor = '#60a5fa'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'; }}
      >
        VIEW CHANGELOG
      </button>
    </div>
  </div>
);
