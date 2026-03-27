import React, { useMemo } from 'react';
import { ChevronDown, MapPin, Globe, Loader2, Search, X } from 'lucide-react';
import { REGIONAL_DATA, GEO_LEVELS } from '../data/assets';
import { GEO_LEVEL_LABELS } from '../data/analysisData';

const getCascadingOptions = (geoPath) => {
  const optionsList = [Object.keys(REGIONAL_DATA)];
  let currentChildren = REGIONAL_DATA;

  for (let i = 1; i < geoPath.length; i++) {
    const selected = geoPath[i];
    if (currentChildren[selected] && currentChildren[selected].children) {
      currentChildren = currentChildren[selected].children;
      optionsList.push(Object.keys(currentChildren));
    } else {
      break;
    }
  }
  return optionsList;
};

const GeoFilterCard = ({ geoPath, onGeoSelect, onAnalyze, isSidebarOpen }) => {
  const cascadingOptions = useMemo(() => getCascadingOptions(geoPath), [geoPath]);
  const currentDepth = Math.max(0, geoPath.length -1);
  const currentLevelInfo = GEO_LEVEL_LABELS[currentDepth] || GEO_LEVEL_LABELS[1];

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      width: 280,
      maxHeight: 'calc(100% - 40px)',
      background: 'rgba(10, 11, 24, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: 16,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .filter-dropdown:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(99, 102, 241, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
      `}</style>

      {/* Header */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: 8, 
            background: 'rgba(99, 102, 241, 0.15)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <Globe size={16} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>MARKET DRILL-DOWN</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Hierarchy Explorer</div>
          </div>
        </div>
        <div style={{ 
          fontSize: 10, fontWeight: 900, color: '#818cf8', 
          background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: 4,
          border: '1px solid rgba(99,102,241,0.2)'
        }}>L{currentDepth}</div>
      </div>

      {/* Cascading Content */}
      <div className="custom-scrollbar" style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cascadingOptions.map((options, i) => {
          const levelIdx = i + 1;
          const levelKey = GEO_LEVEL_LABELS[levelIdx]?.name || GEO_LEVELS[i];
          const selectedValue = geoPath[levelIdx] || 'Select...';
          const isActive = !!geoPath[levelIdx];

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: isActive ? '#6366f1' : '#475569' }}>L{levelIdx}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? '#cbd5e1' : '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{levelKey}</span>
                </div>
                {isActive && (
                  <button 
                    onClick={() => onGeoSelect(GEO_LEVELS[i], null)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
              
              <div className="filter-dropdown" style={{
                position: 'relative',
                background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
                borderRadius: 8,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <select
                  value={geoPath[levelIdx] || ''}
                  onChange={(e) => onGeoSelect(GEO_LEVELS[i], e.target.value || null)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    appearance: 'none',
                    background: 'transparent',
                    border: 'none',
                    color: isActive ? '#e2e8f0' : '#475569',
                    fontSize: 12,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="" style={{ background: '#0f172a' }}>Select {levelKey}...</option>
                  {options.map(opt => (
                    <option key={opt} value={opt} style={{ background: '#0f172a' }}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isActive ? '#6366f1' : '#475569' }} />
              </div>
            </div>
          );
        })}

        {/* Action Button */}
        {currentDepth >= 1 && (
          <div style={{ marginTop: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={onAnalyze}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.3)';
              }}
            >
              🚀 ANALYZE PRECISELY
              <span style={{ 
                fontSize: 9, opacity: 0.8, background: 'rgba(0,0,0,0.2)', 
                padding: '2px 6px', borderRadius: 4, fontWeight: 900 
              }}>{currentLevelInfo.tag}</span>
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 9, color: '#475569', fontStyle: 'italic' }}>
              Precision: {currentLevelInfo.desc}
            </div>
          </div>
        )}
      </div>
      
      {/* Current Path Breadcrumb (Mini) */}
      <div style={{ 
        padding: '10px 20px', 
        background: 'rgba(255,255,255,0.02)', 
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }} className="custom-scrollbar">
        {geoPath.map((seg, i) => (
          <React.Fragment key={i}>
            <span style={{ fontSize: 9, color: i === geoPath.length - 1 ? '#818cf8' : '#475569', fontWeight: 600 }}>{seg}</span>
            {i < geoPath.length - 1 && <span style={{ fontSize: 8, color: '#334155' }}>/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GeoFilterCard;
