import React, { useEffect, useState, useRef } from 'react';
import { X, Zap, Globe, TrendingUp, BarChart2, Users, Building } from 'lucide-react';

// Dummy news snippets for scanning animation
const SCAN_HEADLINES = [
  'Analyzing market risk signals…',
  'Processing rental trend data…',
  'Cross-referencing tenant indicators…',
  'Evaluating supply-demand dynamics…',
  'Scanning financial risk vectors…',
  'Aggregating climate exposure data…',
  'Calibrating political risk index…',
  'Reading infrastructure signals…',
  'Synthesizing investment flows…',
  'Validating confidence intervals…',
];

const SCAN_SOURCES = ['FT Data', 'CBRE', 'JLL', 'Bloomberg RE', 'Savills', 'Cushman', 'MSCI', 'AEW'];

const CATEGORY_COLORS = {
  'Market Risk':     '#ff9f43',
  'Financial Risk':  '#3b82f6',
  'Climate Risk':    '#06b6d4',
  'Political Risk':  '#8b5cf6',
  'Social Risk':     '#2ecc71',
  'Regulatory Risk': '#ef4444',
};

const AnalysisRadarScanner = ({ levelName, levelDepth, levelLabel, onCancel }) => {
  const [tick, setTick] = useState(0);
  const [visibleTiles, setVisibleTiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const categories = Object.keys(CATEGORY_COLORS);

  useEffect(() => {
    // Rotate sweep tick
    const sweep = setInterval(() => setTick(t => t + 1), 50);
    // Progress bar
    const prog = setInterval(() => setProgress(p => Math.min(p + 1.5, 99)), 60);
    // Spawn news tiles
    let tileId = 0;
    const spawnTile = setInterval(() => {
      tileId++;
      const headline = SCAN_HEADLINES[tileId % SCAN_HEADLINES.length];
      const source = SCAN_SOURCES[Math.floor(Math.random() * SCAN_SOURCES.length)];
      const angle = Math.random() * 360;
      const id = `tile_${tileId}`;
      setVisibleTiles(prev => [...prev.slice(-6), { id, headline, source, angle }]);
    }, 620);

    timerRef.current = { sweep, prog, spawnTile };
    return () => { clearInterval(sweep); clearInterval(prog); clearInterval(spawnTile); };
  }, []);

  const sweepAngle = (tick * 3) % 360;
  const sweepRad = (sweepAngle - 90) * (Math.PI / 180);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50000,
      background: 'rgba(4, 5, 14, 0.97)',
      backdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeInScanner 0.4s ease',
    }}>
      <style>{`
        @keyframes fadeInScanner { from { opacity: 0; } to { opacity: 1; } }
        @keyframes floatTile {
          0%   { opacity: 0; transform: translateY(10px) scale(0.9); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; transform: translateY(-8px) scale(1); }
          100% { opacity: 0; transform: translateY(-18px) scale(0.95); }
        }
        @keyframes radarPing {
          0%   { r: 0; opacity: 0.7; }
          100% { r: 180; opacity: 0; }
        }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes categoryBlink {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        style={{
          position: 'absolute', top: 24, right: 24,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', zIndex: 10,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div style={{ position: 'absolute', top: 28, left: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#6366f1',
            boxShadow: '0 0 12px rgba(99,102,241,0.8)', animation: 'scanPulse 1.2s infinite',
          }} />
          <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.15em' }}>
            SEDAI ANALYSIS ENGINE ACTIVE
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginTop: 8, letterSpacing: '-0.02em' }}>
          Analyzing <span style={{ color: '#818cf8' }}>{levelName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 900, padding: '2px 8px', borderRadius: 4,
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8',
          }}>{levelLabel.tag}: {levelLabel.name}</span>
          <span style={{ fontSize: 11, color: '#475569' }}>{levelLabel.desc}</span>
        </div>
      </div>

      {/* Main Radar Container */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* SVG Radar */}
        <svg width={420} height={420} style={{ position: 'relative', zIndex: 2 }}>
          <defs>
            {/* Sweep gradient */}
            <linearGradient id="sweepGrad" gradientTransform={`rotate(${sweepAngle})`}>
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            {/* Radial glow */}
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background circles */}
          {[200, 150, 100, 60, 25].map((r, i) => (
            <circle key={i} cx={210} cy={210} r={r}
              fill="none"
              stroke={i === 0 ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'}
              strokeWidth={i === 0 ? 1.5 : 0.8}
              strokeDasharray={i % 2 === 1 ? '4 8' : 'none'}
            />
          ))}

          {/* Cross hairs */}
          <line x1={210} y1={10} x2={210} y2={410} stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
          <line x1={10} y1={210} x2={410} y2={210} stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
          <line x1={68} y1={68} x2={352} y2={352} stroke="rgba(99,102,241,0.04)" strokeWidth="0.8" />
          <line x1={352} y1={68} x2={68} y2={352} stroke="rgba(99,102,241,0.04)" strokeWidth="0.8" />

          {/* Inner glow disc */}
          <circle cx={210} cy={210} r={200} fill="url(#innerGlow)" />

          {/* Animated ping rings */}
          {[0, 1, 2].map(i => (
            <circle
              key={`ping_${i}`}
              cx={210} cy={210} r={i * 50 + 20}
              fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1"
              style={{ animation: `radarPing 3s ${i * 1}s infinite` }}
            />
          ))}

          {/* Sweep sector */}
          <path
            d={`M 210 210 L ${210 + 200 * Math.cos(sweepRad - 0.6)} ${210 + 200 * Math.sin(sweepRad - 0.6)}
                A 200 200 0 0 1 ${210 + 200 * Math.cos(sweepRad)} ${210 + 200 * Math.sin(sweepRad)} Z`}
            fill="rgba(99,102,241,0.12)"
          />
          {/* Sweep leading edge */}
          <line
            x1={210} y1={210}
            x2={210 + 200 * Math.cos(sweepRad)}
            y2={210 + 200 * Math.sin(sweepRad)}
            stroke="#6366f1" strokeWidth="2" strokeOpacity="0.9"
          />
          {/* Sweep tip dot */}
          <circle
            cx={210 + 198 * Math.cos(sweepRad)}
            cy={210 + 198 * Math.sin(sweepRad)}
            r={4} fill="#818cf8"
            style={{ filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.9))' }}
          />

          {/* Radar blips — random dots that flicker */}
          {categories.map((cat, i) => {
            const angle = (i / categories.length) * Math.PI * 2;
            const dist = 80 + (i * 17) % 100;
            const bx = 210 + dist * Math.cos(angle);
            const by = 210 + dist * Math.sin(angle);
            const isLit = Math.abs((sweepAngle % 360) - ((i / categories.length) * 360)) < 25;
            const color = Object.values(CATEGORY_COLORS)[i];
            return (
              <g key={cat}>
                <circle cx={bx} cy={by} r={isLit ? 6 : 3} fill={color} opacity={isLit ? 0.9 : 0.3}
                  style={{ filter: isLit ? `drop-shadow(0 0 6px ${color})` : 'none', transition: 'all 0.2s' }}
                />
                {isLit && <circle cx={bx} cy={by} r={12} fill="none" stroke={color} strokeWidth="1" opacity="0.4" />}
              </g>
            );
          })}

          {/* Center crosshair */}
          <circle cx={210} cy={210} r={8} fill="none" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" />
          <circle cx={210} cy={210} r={3} fill="#6366f1" />
        </svg>

        {/* Floating news tiles inside radar */}
        {visibleTiles.map((tile, i) => {
          const angle = (tile.angle * Math.PI) / 180;
          const dist = 60 + (i * 22) % 90;
          const tx = 210 + dist * Math.cos(angle) - 90;
          const ty = 210 + dist * Math.sin(angle) - 16;
          return (
            <div key={tile.id} style={{
              position: 'absolute',
              left: tx, top: ty,
              width: 180,
              background: 'rgba(7,8,17,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 8, padding: '6px 10px',
              animation: 'floatTile 3.5s ease forwards',
              pointerEvents: 'none', zIndex: 3,
            }}>
              <div style={{ fontSize: 8, color: '#6366f1', fontWeight: 800, marginBottom: 2, letterSpacing: '0.06em' }}>{tile.source}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1.3, fontWeight: 500 }}>{tile.headline}</div>
            </div>
          );
        })}
      </div>

      {/* Right panel — category scan status */}
      <div style={{
        position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200,
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: '0.1em', marginBottom: 4 }}>SCANNING CATEGORIES</div>
        {categories.map((cat, i) => {
          const color = Object.values(CATEGORY_COLORS)[i];
          const isActive = (tick * 3 % 360) > (i / categories.length) * 360;
          return (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0,
                boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                opacity: isActive ? 1 : 0.3, transition: 'all 0.3s',
              }} />
              <span style={{ fontSize: 10, color: isActive ? '#94a3b8' : '#334155', fontWeight: isActive ? 600 : 400, transition: 'all 0.3s', flex: 1 }}>{cat}</span>
              <span style={{ fontSize: 9, color: isActive ? color : '#1e293b', fontWeight: 700 }}>
                {isActive ? '✓' : '…'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Left panel — data sources */}
      <div style={{
        position: 'absolute', left: 48, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160,
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#334155', letterSpacing: '0.1em', marginBottom: 4 }}>DATA SOURCES</div>
        {SCAN_SOURCES.map((src, i) => {
          const icons = [Globe, BarChart2, TrendingUp, Building, Users, Zap, Globe, BarChart2];
          const Icon = icons[i % icons.length];
          const isLit = (tick + i * 3) % 16 < 8;
          return (
            <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={10} style={{ color: isLit ? '#6366f1' : '#1e293b', transition: 'all 0.3s' }} />
              <span style={{ fontSize: 10, color: isLit ? '#64748b' : '#1e293b', transition: 'all 0.3s' }}>{src}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom progress bar */}
      <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>Analysis in progress…</span>
          <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #4f46e5, #818cf8, #6366f1)',
            borderRadius: 3, transition: 'width 0.1s linear',
            boxShadow: '0 0 12px rgba(99,102,241,0.6)',
          }} />
        </div>
        <div style={{ fontSize: 9, color: '#1e293b', marginTop: 8, textAlign: 'center' }}>
          Powered by SedAI Multi-Agent Intelligence Engine
        </div>
      </div>
    </div>
  );
};

export default AnalysisRadarScanner;
