import React from 'react';
import { Settings, User, ChevronDown, Bell } from 'lucide-react';

const TABS = ['RISK RADAR', 'ASSET COCKPIT', 'ACTIONS', 'PLANNING', 'IMPACT'];

const Header = ({ activeTab, onTabChange }) => (
  <header style={{
    height: 58,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    background: 'rgba(6,6,14,0.98)',
    backdropFilter: 'blur(16px)',
    flexShrink: 0,
    zIndex: 50,
  }}>
    {/* Logo + Nav */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 30, height: 30,
          border: '2px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 18, color: '#f1f5f9',
          letterSpacing: '-0.05em',
        }}>S</div>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f5f9' }}>SedAI</span>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, fontWeight: active ? 700 : 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active ? '#f1f5f9' : '#475569',
                paddingBottom: 4,
                borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'color .15s, border-color .15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#94a3b8'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#475569'; }}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>

    {/* Right side */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Bell size={14} color="#334155" style={{ cursor: 'pointer' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Welcome back,</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Andrew</span>
        <ChevronDown size={11} color="#475569" />
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={13} color="#fff" />
        </div>
      </div>
      <Settings size={14} color="#334155" style={{ cursor: 'pointer' }} />
    </div>
  </header>
);

export default Header;
