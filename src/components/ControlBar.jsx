import React, { useMemo } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { FUNDS, ASSET_TYPES, STATUSES, ASSETS_DATA, REGIONAL_DATA, GEO_LEVELS } from '../data/assets';
import { GEO_LEVEL_LABELS } from '../data/analysisData';

const COUNTRIES = ['All', ...Object.keys(REGIONAL_DATA)];

// Helper: get options at each depth using the recursive REGIONAL_DATA
const getCascadingOptions = (geoPath) => {
  // geoPath[0] is 'Europe'
  const optionsList = [Object.keys(REGIONAL_DATA)]; // L1 options
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

// Current geographic level depth (0=Europe, 1=country, …, 10=postalCode)
export const getGeoDepth = (geoPath) => Math.max(0, geoPath.length - 1);

const ControlBar = ({ filters, onFilterChange, geoPath, onGeoSelect, onAnalyze }) => {
  const cascadingOptions = useMemo(() => getCascadingOptions(geoPath), [geoPath]);
  const depth = getGeoDepth(geoPath);

  const levelInfo = GEO_LEVEL_LABELS[depth] || GEO_LEVEL_LABELS[1];

  const filterDefs = [
    { key: 'riskType', label: 'Risk', options: ['All Risks', 'Market', 'Political', 'Climate', 'Financial', 'Social', 'Other'] },
    { key: 'status',   label: 'Level', options: STATUSES },
    { key: 'percentage', label: '%', options: ['All', '0-25', '25-50', '50-75', '75-100'] },
    { key: 'assetType', label: 'Type', options: ASSET_TYPES },
  ];

  const TIMEFRAME_OPTIONS = [
    { value: '3 Months', label: '3M' },
    { value: '6 Months', label: '6M' },
    { value: '12 Months', label: '12M' },
  ];

  return (
    <div style={{
      minHeight: 48,
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,9,18,0.98)',
      flexShrink: 0,
    }}>
      {/* Main Filter Row */}
      <div style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 4,
        overflowX: 'auto',
      }}>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 2, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          {['Assets', 'Regions'].map(m => (
            <button
              key={m}
              onClick={() => onFilterChange('viewMode', m)}
              style={{
                padding: '4px 10px', fontSize: 9, fontWeight: 800, borderRadius: 4,
                border: 'none', cursor: 'pointer',
                background: filters.viewMode === m ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: filters.viewMode === m ? '#3b82f6' : '#475569',
                transition: 'all 0.2s',
              }}
            >{m.toUpperCase()}</button>
          ))}
        </div>

        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        {/* Timeframe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#334155', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Period:</span>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
            {TIMEFRAME_OPTIONS.map(tf => {
              const isActive = filters.timeframe === tf.value;
              return (
                <button key={tf.value} onClick={() => onFilterChange('timeframe', tf.value)} style={{
                  padding: '4px 10px', fontSize: 10, fontWeight: 800, borderRadius: 4,
                  border: 'none', cursor: 'pointer',
                  background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: isActive ? '#3b82f6' : '#475569',
                  transition: 'all 0.2s', letterSpacing: '0.05em',
                }}>{tf.label}</button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        {/* Standard risk/asset filters */}
        {filterDefs.map(({ key, label, options }) => (
          <FilterDropdown
            key={key}
            label={label}
            value={filters[key] || options[0]}
            options={options}
            onChange={v => onFilterChange(key, v)}
            highlighted={filters[key] && filters[key] !== 'All' && filters[key] !== options[0]}
          />
        ))}

        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        {/* Spacer */}
        <div style={{ flex: 1 }} />


        {/* Analyse Button */}
        {depth >= 1 && (
          <button
            onClick={onAnalyze}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 14px',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
              border: '1px solid rgba(99,102,241,0.5)',
              borderRadius: 7, color: '#a5b4fc', cursor: 'pointer',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: '0 0 12px rgba(99,102,241,0.2)',
              animation: 'analysisPulse 2.5s ease-in-out infinite',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4))';
              e.currentTarget.style.color = '#c7d2fe';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))';
              e.currentTarget.style.color = '#a5b4fc';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(99,102,241,0.2)';
            }}
          >
            <span style={{ fontSize: 11 }}>⬡</span>
            ANALYZE
            <span style={{
              fontSize: 8, fontWeight: 900, padding: '1px 5px', borderRadius: 3,
              background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.4)',
              color: '#a5b4fc'
            }}>{levelInfo.tag}</span>
          </button>
        )}

        {/* Reset */}
        <button
          onClick={() => onFilterChange('reset')}
          title="Reset all filters"
          style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 5, padding: '4px 10px', color: '#475569', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>

      {/* ── Geographic Level Breadcrumb Bar ── */}
      {depth >= 1 && (
        <div style={{
          height: 26,
          display: 'flex', alignItems: 'center', gap: 0,
          padding: '0 16px',
          background: 'rgba(99,102,241,0.04)',
          borderTop: '1px solid rgba(99,102,241,0.1)',
          overflowX: 'auto',
        }}>
          <style>{`
            @keyframes analysisPulse {
              0%, 100% { box-shadow: 0 0 12px rgba(99,102,241,0.2); }
              50% { box-shadow: 0 0 22px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.15); }
            }
          `}</style>
          {/* Level indicator */}
          <span style={{ fontSize: 9, fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em', marginRight: 10, whiteSpace: 'nowrap' }}>
            {levelInfo.tag}: {levelInfo.name}
          </span>
          <span style={{ fontSize: 9, color: '#334155', marginRight: 10 }}>—</span>

          {/* Breadcrumb path */}
          {geoPath.map((seg, i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 9, color: i === geoPath.length - 1 ? '#94a3b8' : '#475569', fontWeight: i === geoPath.length - 1 ? 700 : 500, whiteSpace: 'nowrap' }}>
                {seg}
              </span>
              {i < geoPath.length - 1 && (
                <span style={{ fontSize: 9, color: '#1e293b', margin: '0 6px' }}>›</span>
              )}
            </React.Fragment>
          ))}

          <span style={{ fontSize: 9, color: '#334155', marginLeft: 8 }}>·</span>
          <span style={{ fontSize: 9, color: '#334155', marginLeft: 8, whiteSpace: 'nowrap' }}>{levelInfo.desc}</span>
        </div>
      )}
    </div>
  );
};

const FilterDropdown = ({ label, value, options, onChange, highlighted }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative', flexShrink: 0 }}>
    <span style={{ fontSize: 10, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{label}:</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance: 'none', background: 'transparent', border: 'none',
        color: highlighted ? '#3b82f6' : '#e2e8f0',
        fontSize: 10, fontWeight: highlighted ? 700 : 600,
        fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none', paddingRight: 14,
      }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: '#0d0e1c', color: '#e2e8f0' }}>{o}</option>)}
    </select>
    <ChevronDown size={9} style={{ color: '#334155', position: 'absolute', right: 0, pointerEvents: 'none' }} />
  </div>
);

const GeoDropdown = ({ label, levelTag, value, options, onChange, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative', flexShrink: 0 }}>
    <span style={{
      fontSize: 8, fontWeight: 900, padding: '1px 5px', borderRadius: 3, marginRight: 2,
      background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
      color: active ? '#818cf8' : '#334155',
      letterSpacing: '0.05em', whiteSpace: 'nowrap',
    }}>{levelTag}</span>
    <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#818cf8' : '#334155', whiteSpace: 'nowrap' }}>{label}:</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance: 'none', background: 'transparent', border: 'none',
        color: active ? '#818cf8' : '#94a3b8',
        fontSize: 10, fontWeight: active ? 700 : 500,
        fontFamily: 'Inter, sans-serif', cursor: 'pointer', outline: 'none', paddingRight: 14,
        maxWidth: 120,
      }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: '#0d0e1c', color: '#e2e8f0' }}>{o}</option>)}
    </select>
    <ChevronDown size={9} style={{ color: active ? '#6366f1' : '#334155', position: 'absolute', right: 0, pointerEvents: 'none' }} />
  </div>
);

export default ControlBar;
