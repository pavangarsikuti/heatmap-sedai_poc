import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const HistoryCard = ({ title, value, unit, history, projection, source, confidence, trendPercent, prevValue }) => {
  const isIncrease = trendPercent >= 0;
  const TrendIcon = isIncrease ? TrendingUp : TrendingDown;
  const trendColor = isIncrease ? '#ff4d4d' : '#2ecc71'; // In risk terms, increase is red

  // SVG Sparkline Logic
  const width = 200;
  const height = 40;
  const padding = 5;
  const max = Math.max(...history, projection || 0);
  const min = Math.min(...history, projection || 0);
  const range = max - min || 1;

  const points = history.map((val, i) => {
    const x = (i / (history.length - 1)) * (width - 20) + 10;
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Projection Point
  const projX = width - 10;
  const projY = height - padding - ((projection - min) / range) * (height - 2 * padding);
  const lastX = (history.length - 1) / (history.length - 1) * (width - 20) + 10;
  const lastY = height - padding - ((history[history.length - 1] - min) / range) * (height - 2 * padding);

  const confidenceColors = {
    'High': '#2ecc71',
    'Medium': '#ffcd3c',
    'Low': '#ff4d4d'
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'transform 0.2s, background 0.2s',
      cursor: 'default',
      minWidth: 260
    }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
       onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>{value}{unit}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor, fontSize: 11, fontWeight: 800 }}>
            <TrendIcon size={12} /> {isIncrease ? '+' : ''}{trendPercent}%
          </div>
          <div style={{ fontSize: 9, color: '#334155', fontWeight: 600, marginTop: 2 }}>vs last period</div>
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ height: height, position: 'relative', margin: '8px 0' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(59,130,246,0.1)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(59,130,246,0)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <polyline
            points={points}
            fill="none"
            stroke="rgba(59,130,246,0.5)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Projection Dashed Line */}
          {projection && (
            <line 
              x1={lastX} y1={lastY} x2={projX} y2={projY}
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          )}
          {/* Projection Confidence Band */}
          {projection && (
            <path 
              d={`M ${lastX} ${lastY} L ${projX} ${projY - 5} L ${projX} ${projY + 5} Z`}
              fill="rgba(59,130,246,0.05)"
            />
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
           <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColors[confidence] }} />
           <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{confidence} Confidence</span>
        </div>
        <div style={{ fontSize: 9, color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          SOURCE: {source.toUpperCase()} <Info size={10} />
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
