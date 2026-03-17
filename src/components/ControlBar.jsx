import React from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { FUNDS, ASSET_TYPES, STATUSES, ASSETS_DATA, RISK_TYPES } from '../data/assets';

const COUNTRIES = [
  'All',
  ...Array.from(new Set(
    ASSETS_DATA
      .filter(a => 
        a.coordinates[0] >= -30 && a.coordinates[0] <= 50 &&
        a.coordinates[1] >= 30 && a.coordinates[1] <= 75
      )
      .map(a => a.country)
  )).sort()
];

const ControlBar = ({ filters, onFilterChange }) => {
  const filterDefs = [
    { key: 'mode', label: 'Mode', options: ['Overall Risk', 'Portfolio Risk', 'Asset Risk'] },
    { key: 'riskType', label: 'Risk Type', options: RISK_TYPES },
    { key: 'timeframe', label: 'Timeframe', options: ['3 Months', '6 Months', '12 Months', '24 Months'] },
    { key: 'fund', label: 'Funds', options: FUNDS },
    { key: 'assetType', label: 'Asset Types', options: ASSET_TYPES },
    { key: 'status', label: 'Risk Level', options: STATUSES },
    { key: 'country', label: 'Country', options: COUNTRIES },
  ];

  const activeFilters = Object.entries(filters).filter(
    ([k, v]) => !['mode', 'riskType', 'timeframe'].includes(k) && v !== 'All'
  ).length;

  return (
    <div style={{
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,9,18,0.98)',
      flexShrink: 0,
      gap: 4,
      overflowX: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {activeFilters > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 800, color: '#3b82f6',
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            padding: '2px 7px', borderRadius: 10,
          }}>{activeFilters} active</span>
        )}
        <button
          onClick={() => onFilterChange('reset')}
          title="Reset all filters"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 5, padding: '4px 10px', color: '#475569', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
            transition: 'color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, value, options, onChange, highlighted }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5, position: 'relative' }}>
    <span style={{ fontSize: 10, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{label}:</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        color: highlighted ? '#3b82f6' : '#e2e8f0',
        fontSize: 10,
        fontWeight: highlighted ? 700 : 600,
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
        outline: 'none',
        paddingRight: 14,
      }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: '#0d0e1c', color: '#e2e8f0' }}>{o}</option>)}
    </select>
    <ChevronDown size={9} style={{ color: '#334155', position: 'absolute', right: 0, pointerEvents: 'none' }} />
  </div>
);

export default ControlBar;
