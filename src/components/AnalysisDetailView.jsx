import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, RotateCcw, ExternalLink, ChevronRight, AlertTriangle, Info, Clock } from 'lucide-react';

// ── Mini Radar Chart ──────────────────────────────────────────────────────────
const RadarChart = ({ data, size = 130, color = '#6366f1' }) => {
  if (!data || data.length === 0) return null;
  const padding = 22;
  const radius = (size / 2) - padding;
  const cx = size / 2, cy = size / 2;
  const step = (Math.PI * 2) / data.length;

  const pts = data.map((d, i) => {
    const r = (d.A / 100) * radius;
    return `${cx + r * Math.sin(i * step)},${cy - r * Math.cos(i * step)}`;
  }).join(' ');

  const grid = [0.25, 0.5, 0.75, 1];
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {grid.map(l => {
        const gp = data.map((_, i) => {
          const r = l * radius;
          return `${cx + r * Math.sin(i * step)},${cy - r * Math.cos(i * step)}`;
        }).join(' ');
        return <polygon key={l} points={gp} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />;
      })}
      {data.map((_, i) => {
        const x = cx + radius * Math.sin(i * step);
        const y = cy - radius * Math.cos(i * step);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />;
      })}
      {data.map((d, i) => {
        const lx = cx + (radius + 12) * Math.sin(i * step);
        const ly = cy - (radius + 12) * Math.cos(i * step);
        return <text key={i} x={lx} y={ly} fontSize="7" fill="#475569" fontWeight="700" textAnchor="middle" alignmentBaseline="middle">{d.subject.toUpperCase()}</text>;
      })}
      <polygon points={pts} fill={`${color}25`} stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

// ── Mini Sparkline ─────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#6366f1', height = 36, width = 120 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={`${color}15`} stroke="none" />
    </svg>
  );
};

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  CRITICAL: '#ff4d4d', ELEVATED: '#ff9f43', MODERATE: '#ffcd3c', SAFE: '#2ecc71'
};
const OUTLOOK_COLORS = { Bullish: '#2ecc71', Neutral: '#94a3b8', Bearish: '#ff4d4d' };

// ── AnalysisDetailView ─────────────────────────────────────────────────────────
const AnalysisDetailView = ({
  results, news, forecast, summary,
  levelName, levelDepth, levelLabel,
  onClose, onAnalyzeAgain,
}) => {
  const [forecastTab, setForecastTab] = useState(0);
  const [newsExpanded, setNewsExpanded] = useState(false);

  const { riskOverview, rentalInsights, tenantIndicators, commercialInsights, keyDrivers, radarData } = results;
  const statusColor = STATUS_COLORS[riskOverview.status] || '#94a3b8';
  const isTrendUp = riskOverview.trendDir === 'up';
  const TrendIcon = isTrendUp ? TrendingUp : TrendingDown;
  const trendColor = isTrendUp ? '#ff9f43' : '#2ecc71';

  const activePeriod = forecast?.periods?.[forecastTab];
  const outlookColor = OUTLOOK_COLORS[activePeriod?.investmentOutlook] || '#94a3b8';

  const lastUpdated = new Date(results.meta?.generatedAt || Date.now()).toLocaleTimeString();

  const displayNews = newsExpanded ? news : (news || []).slice(0, 4);

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0,
      width: 520,
      background: 'rgba(5, 6, 15, 0.97)',
      backdropFilter: 'blur(48px)',
      borderLeft: '1px solid rgba(99,102,241,0.2)',
      display: 'flex', flexDirection: 'column',
      zIndex: 20000,
      animation: 'slideInDetail 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      boxShadow: '-20px 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)',
    }}>
      <style>{`
        @keyframes slideInDetail {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .detail-scroll::-webkit-scrollbar { width: 3px; }
        .detail-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
        @keyframes barFill {
          from { width: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 9, fontWeight: 900, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8',
              }}>{levelLabel.tag}: {levelLabel.name}</span>
              <span style={{ fontSize: 9, color: '#334155' }}>·</span>
              <span style={{ fontSize: 9, color: '#334155' }}>{levelLabel.desc}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {levelName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <Clock size={10} color="#334155" />
              <span style={{ fontSize: 9, color: '#334155' }}>Updated {lastUpdated}</span>
              <button onClick={onAnalyzeAgain} style={{
                display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                color: '#6366f1', cursor: 'pointer', fontSize: 9, fontWeight: 700, padding: 0,
              }}>
                <RotateCcw size={9} /> Refresh
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%', width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div className="detail-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Risk Overview Cards Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {/* Overall Risk Score */}
          <div style={cardStyle('#6366f1', 'span 1')}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>RISK SCORE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: statusColor, lineHeight: 1 }}>{riskOverview.score}</span>
              <span style={{ fontSize: 9, color: '#475569' }}>/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: statusColor, background: `${statusColor}20`, padding: '2px 7px', borderRadius: 4 }}>
                {riskOverview.status}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: trendColor, fontWeight: 700 }}>
                <TrendIcon size={10} />{riskOverview.trend}
              </span>
            </div>
            {/* Mini gauge */}
            <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${riskOverview.score}%`, height: '100%', background: statusColor,
                borderRadius: 3, animation: 'barFill 1s ease',
                boxShadow: `0 0 8px ${statusColor}80`,
              }} />
            </div>
            <div style={{ fontSize: 8, color: '#334155', marginTop: 4 }}>Confidence: {riskOverview.confidence}</div>
          </div>

          {/* Rental Insights */}
          <div style={cardStyle('#ff9f43')}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 6 }}>AVG RENT</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#ff9f43' }}>{rentalInsights.currency}{rentalInsights.avgRentPerSqm}</div>
            <div style={{ fontSize: 8, color: '#475569', marginBottom: 6 }}>per sqm/month</div>
            <Sparkline data={rentalInsights.historicalTrend} color="#ff9f43" height={28} width={80} />
            <div style={{ fontSize: 9, color: rentalInsights.yoyGrowth >= 0 ? '#2ecc71' : '#ff4d4d', fontWeight: 700, marginTop: 4 }}>
              {rentalInsights.yoyGrowth >= 0 ? '+' : ''}{rentalInsights.yoyGrowth}% YoY
            </div>
          </div>

          {/* Occupancy */}
          <div style={cardStyle('#2ecc71')}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 6 }}>OCCUPANCY</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#2ecc71' }}>{commercialInsights.occupancyPct}%</div>
            {/* Ring */}
            <div style={{ margin: '6px 0', display: 'flex', justifyContent: 'center' }}>
              <svg width={52} height={52}>
                <circle cx={26} cy={26} r={20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx={26} cy={26} r={20} fill="none" stroke="#2ecc71" strokeWidth="5"
                  strokeDasharray={`${(commercialInsights.occupancyPct / 100) * 125.6} 125.6`}
                  strokeLinecap="round" transform="rotate(-90 26 26)"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(46,204,113,0.6))' }}
                />
              </svg>
            </div>
            <div style={{ fontSize: 8, color: '#475569' }}>Cap Rate: {commercialInsights.capRate}%</div>
          </div>
        </div>

        {/* ── Tenant + Commercial row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Tenant Indicators */}
          <div style={cardStyle('#06b6d4')}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 10 }}>TENANT INDICATORS</div>
            {[
              { label: 'Stability', val: `${tenantIndicators.stabilityPct}%`, color: '#2ecc71' },
              { label: 'Vacancy Rate', val: `${tenantIndicators.vacancyRate}%`, color: '#ff9f43' },
              { label: 'Avg Lease', val: `${tenantIndicators.avgLeaseTerm}yr`, color: '#06b6d4' },
              { label: 'Turnover', val: `${tenantIndicators.turnoverRate}%`, color: '#94a3b8' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.val}</span>
              </div>
            ))}
            <div style={{ marginTop: 4, fontSize: 9, color: '#475569' }}>
              Vacancy Trend: <span style={{ color: tenantIndicators.vacancyTrend === 'Decreasing' ? '#2ecc71' : tenantIndicators.vacancyTrend === 'Increasing' ? '#ff4d4d' : '#94a3b8', fontWeight: 700 }}>
                {tenantIndicators.vacancyTrend}
              </span>
            </div>
          </div>

          {/* Commercial Insights */}
          <div style={cardStyle('#8b5cf6')}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 10 }}>COMMERCIAL</div>
            {[
              { label: 'D/S Ratio', val: `${commercialInsights.demandSupplyRatio.toFixed(2)}x`, color: commercialInsights.demandSupplyRatio >= 1 ? '#2ecc71' : '#ff9f43' },
              { label: 'Biz Activity', val: `${commercialInsights.businessActivityIndex}`, color: '#8b5cf6' },
              { label: 'Price/sqm', val: `€${commercialInsights.pricePerSqm.toLocaleString()}`, color: '#94a3b8' },
              { label: 'Inv. Volume', val: commercialInsights.investmentVolume, color: '#3b82f6' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Key Drivers + Radar ── */}
        <div style={{ ...cardStyle('#ff4d4d'), display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 12 }}>KEY RISK DRIVERS</div>
            {keyDrivers.map((d, i) => (
              <div key={i} style={{ marginBottom: 10, animation: `cardIn 0.4s ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{d.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: d.color }}>{d.score}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${d.score}%`, height: '100%', background: d.color, borderRadius: 3,
                    animation: 'barFill 1s ease', boxShadow: `0 0 6px ${d.color}60`,
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <RadarChart data={radarData} size={130} color="#6366f1" />
            <span style={{ fontSize: 8, color: '#334155' }}>Risk Radar</span>
          </div>
        </div>

        {/* ── Forecast Tabs ── */}
        <div style={cardStyle('#3b82f6')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em' }}>FORECAST BREAKDOWN</div>
            <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
              {['3M', '6M', '12M'].map((t, i) => (
                <button key={t} onClick={() => setForecastTab(i)} style={{
                  padding: '3px 12px', fontSize: 10, fontWeight: 800, borderRadius: 4, border: 'none',
                  cursor: 'pointer',
                  background: forecastTab === i ? 'rgba(59,130,246,0.25)' : 'transparent',
                  color: forecastTab === i ? '#60a5fa' : '#475569',
                  transition: 'all 0.2s',
                }}>{t}</button>
              ))}
            </div>
          </div>
          {activePeriod && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: STATUS_COLORS[results.riskOverview.status] || '#94a3b8' }}>{activePeriod.projectedRiskScore}</div>
                <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, marginTop: 4 }}>RISK SCORE</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: activePeriod.rentalGrowth >= 0 ? '#2ecc71' : '#ff4d4d' }}>
                  {activePeriod.rentalGrowth >= 0 ? '+' : ''}{activePeriod.rentalGrowth}%
                </div>
                <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, marginTop: 4 }}>RENTAL GROWTH</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: outlookColor }}>{activePeriod.investmentOutlook}</div>
                <div style={{ fontSize: 8, color: '#475569', fontWeight: 700, marginTop: 4 }}>OUTLOOK</div>
              </div>
            </div>
          )}
          {activePeriod?.keyAssumptions && (
            <div style={{ marginTop: 12, padding: 10, background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.1)' }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: '#334155', letterSpacing: '0.08em', marginBottom: 6 }}>KEY ASSUMPTIONS</div>
              {activePeriod.keyAssumptions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: '#64748b' }}>{a}</span>
                </div>
              ))}
              <div style={{ marginTop: 6, fontSize: 8, color: '#1e293b' }}>
                Range: {activePeriod.confidenceInterval?.low?.toFixed(1)} – {activePeriod.confidenceInterval?.high?.toFixed(1)}
              </div>
            </div>
          )}
        </div>

        {/* ── Insights Summary ── */}
        <div style={cardStyle('#10b981')}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em', marginBottom: 10 }}>AI INSIGHTS SUMMARY</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={12} color="#6366f1" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{summary}</p>
          </div>
        </div>

        {/* ── News & Research ── */}
        <div style={cardStyle('#f59e0b')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.1em' }}>NEWS & RESEARCH SOURCES</div>
            <span style={{ fontSize: 8, color: '#334155' }}>Analyzed {(news || []).length} signals</span>
          </div>
          {displayNews.map((article, i) => (
            <div key={article.id} style={{
              marginBottom: 10, padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)',
              animation: `cardIn 0.3s ${i * 0.06}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{
                  fontSize: 8, fontWeight: 800, padding: '1px 6px', borderRadius: 3,
                  background: `${article.categoryColor}20`, color: article.categoryColor,
                  border: `1px solid ${article.categoryColor}30`,
                }}>{article.category}</span>
                <span style={{ fontSize: 8, color: '#334155' }}>{article.source}</span>
                <span style={{ marginLeft: 'auto', fontSize: 8, color: '#1e293b' }}>
                  {new Date(article.date).toLocaleDateString()}
                </span>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: article.sentiment === 'positive' ? '#2ecc71' : article.sentiment === 'negative' ? '#ff4d4d' : '#94a3b8',
                  flexShrink: 0,
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{article.headline}</div>
              <div style={{ fontSize: 9, color: '#334155', marginTop: 4 }}>Relevance: {article.relevanceScore}%</div>
            </div>
          ))}
          {(news || []).length > 4 && (
            <button onClick={() => setNewsExpanded(!newsExpanded)} style={{
              width: '100%', padding: '8px', fontSize: 10, fontWeight: 700, color: '#6366f1',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {newsExpanded ? 'Show Less' : `Show ${(news || []).length - 4} More`}
              <ChevronRight size={12} style={{ transform: newsExpanded ? 'rotate(270deg)' : 'rotate(90deg)' }} />
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: 'rgba(245,158,11,0.05)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.1)' }}>
          <AlertTriangle size={12} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: '#64748b', lineHeight: 1.5 }}>
            Analysis generated by SedAI's multi-agent intelligence engine using simulated market signals. Data refreshes automatically every hour. For investment decisions, always verify with primary sources.
          </span>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
};

// ── Shared card style ─────────────────────────────────────────────────────────
const cardStyle = (accentColor, gridColumn) => ({
  padding: '14px 16px',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: 14,
  border: `1px solid rgba(255,255,255,0.05)`,
  borderTop: `2px solid ${accentColor}40`,
  boxShadow: `0 0 20px ${accentColor}08`,
  ...(gridColumn ? { gridColumn } : {}),
});

export default AnalysisDetailView;
