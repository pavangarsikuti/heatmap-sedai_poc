import React, { useMemo } from 'react';
import { ChevronRight, ChevronLeft, Activity, Info } from 'lucide-react';
import HistoryCard from './HistoryCard';
import { VersionControl } from './VersioningUI';

const RightSidebar = ({ 
  isOpen, 
  onToggle, 
  assets, 
  filters, 
  portfolioVersion, 
  dataVersion, 
  onUpdatePortfolio, 
  onShowChangelog 
}) => {
  const metrics = useMemo(() => {
    if (!assets.length) return null;

    const avgScore = Math.round(assets.reduce((sum, a) => sum + a.score, 0) / assets.length);
    const prevAvg = assets.reduce((sum, a) => sum + (a.prevQuarterScore || a.score), 0) / assets.length;
    const trendPercent = Math.round(((avgScore - prevAvg) / (prevAvg || 1)) * 100);

    const aggregateHistory = (key) => {
      const historyLen = 12;
      const result = Array(historyLen).fill(0);
      assets.forEach(a => {
        if (a[key]) {
          a[key].forEach((v, i) => { result[i] += v; });
        }
      });
      return result.map(v => Math.round((v / assets.length) * 10) / 10);
    };

    const riskHistory = aggregateHistory('history');
    
    const driverMap = {};
    assets.forEach(a => {
      a.drivers?.forEach(d => {
        if (!driverMap[d.label]) driverMap[d.label] = { val: 0, color: d.color, count: 0 };
        driverMap[d.label].val += d.value;
        driverMap[d.label].count++;
      });
    });

    const topDrivers = Object.entries(driverMap)
      .map(([label, d]) => ({ label, value: Math.round(d.val / d.count), color: d.color }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    return { avgScore, trendPercent, riskHistory, topDrivers };
  }, [assets]);

  return (
    <div style={{
      position: 'relative',
      width: isOpen ? 340 : 0,
      height: '100%',
      background: 'rgba(7, 8, 17, 0.95)',
      backdropFilter: 'blur(48px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'width 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      zIndex: 100,
    }}>
      {/* Dynamic Toggle Button - Always Visible */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 32,
          height: 32,
          background: 'rgba(7, 8, 17, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3b82f6',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 101,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <div style={{
          transform: `rotate(${isOpen ? 0 : 180}deg)`,
          transition: 'transform 0.4s',
          display: 'flex'
        }}>
          <ChevronRight size={16} />
        </div>
      </button>

      {isOpen && metrics && (
        <div className="detail-scroll" style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 32, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Activity size={16} color="#3b82f6" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.1em', color: '#f8fafc' }}>RISK INTELLIGENCE</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
              <VersionControl 
                portfolioVersion={portfolioVersion} 
                dataVersion={dataVersion} 
                onUpdatePortfolio={onUpdatePortfolio}
                onShowChangelog={onShowChangelog}
              />
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.05)' }} />

          {/* Metrics Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <HistoryCard 
              title="Composite Risk Index"
              value={metrics.avgScore}
              unit=""
              history={metrics.riskHistory}
              projection={metrics.avgScore + (metrics.trendPercent / 2)}
              source="SedAI Engine"
              confidence="High"
              trendPercent={metrics.trendPercent}
            />

            <HistoryCard 
              title="Occupancy Resilience"
              value={92.4}
              unit="%"
              history={[91, 91.5, 92, 92.2, 92.4, 92.3, 92.5, 92.6, 92.4, 92.5, 92.4, 92.4]}
              projection={92.8}
              source="Portfolio Data"
              confidence="Medium"
              trendPercent={+1.2}
            />

            {filters.propertyType === 'Rental' && (
              <HistoryCard 
                title="Avg Rent Growth"
                value={+4.2}
                unit="%"
                history={[3.2, 3.5, 3.8, 4.0, 4.2, 3.9, 4.1, 4.3, 4.0, 4.2, 4.1, 4.2]}
                projection={4.5}
                source="Market Index"
                confidence="High"
                trendPercent={+0.8}
              />
            )}
          </div>

          {/* Predictive Outlook */}
          <div style={{ 
            padding: 16, 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>PREDICTIVE OUTLOOK (6M)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Forecast Up', val: '12%', color: '#2ecc71', count: 4 },
                { label: 'Forecast Down', val: '8%', color: '#ff4d4d', count: 2 },
                { label: 'Flat / Stable', val: '80%', color: '#94a3b8', count: 28 }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: item.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{item.val}</span>
                      <span style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{item.count} assets</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Risk Drivers */}
          <div style={{ 
            padding: 16, 
            borderRadius: 12, 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: '0.05em' }}>PRIMARY RISK DRIVERS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metrics.topDrivers.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.value}%</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 1.5 }}>
                    <div style={{ width: `${d.value}%`, height: '100%', background: d.color, borderRadius: 1.5, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563', padding: '0 4px' }}>
            <Info size={14} color="#3b82f6" />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>Intelligence feeds updated every week.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
