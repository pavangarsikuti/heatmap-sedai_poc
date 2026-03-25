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
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <VersionBadge type="Data" version={dataVersion} date="12 Mar" />
    <VersionBadge type="Portfolio" version={portfolioVersion} date="Latest" />
    
    <button 
      onClick={onUpdatePortfolio}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 6,
        color: '#2ecc71',
        fontSize: 10,
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
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
        fontWeight: 700,
        cursor: 'pointer',
        textDecoration: 'underline'
      }}
    >
      View Changelog
    </button>
  </div>
);
