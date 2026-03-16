import React from 'react';
import { ShieldCheck, ChevronRight, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { STATUS_CONFIG } from '../data/assets';

const SidebarLeft = ({ assets, onAssetClick }) => {
  const criticalCount = assets.filter(a => a.status === 'CRITICAL').length;
  const safeCount = assets.filter(a => a.status === 'SAFE').length;
  const totalValue = '$372.5M';
  const confidence = Math.round((safeCount / Math.max(assets.length, 1)) * 100) || 35;

  return (
    <aside style={{
      width: 290,
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(6,6,14,0.97)',
      backdropFilter: 'blur(12px)',
      height: '100%',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Confidence Section */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <ShieldCheck size={13} color="#475569" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Confidence</span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8,
          padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#2ecc71', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>GOOD</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                {confidence}% <span style={{ fontSize: 11, color: '#2ecc71', fontWeight: 600 }}>▲5%</span>
              </div>
            </div>
            {/* Confidence bars */}
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 10, height: 6, borderRadius: 2, background: i < Math.round(confidence / 20) ? '#2ecc71' : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
          </div>

          {/* Portfolio Data Quality */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Portfolio Data Quality</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '65%', background: '#2ecc71' }} />
                <div style={{ width: '20%', background: '#ffcd3c' }} />
                <div style={{ width: '15%', background: '#ff4d4d' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>65%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '7%', background: '#94a3b8' }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Triage Stack */}
      <button style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer', width: '100%', color: 'inherit',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', color: '#94a3b8', textTransform: 'uppercase' }}>Triage Stack</span>
        </div>
        <ChevronRight size={13} color="#334155" />
      </button>

      {/* Assets Title */}
      <div style={{ padding: '10px 18px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{assets.length} Assets</span>
        {criticalCount > 0 && (
          <span style={{ fontSize: 9, color: '#ff4d4d', fontWeight: 700, background: 'rgba(255,77,77,0.12)', padding: '2px 7px', borderRadius: 4 }}>
            {criticalCount} CRITICAL
          </span>
        )}
      </div>

      {/* Asset List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {assets.length === 0 && (
          <div style={{ padding: '40px 18px', textAlign: 'center', color: '#334155', fontSize: 12 }}>
            No assets match current filters
          </div>
        )}
        {assets.map((asset) => {
          const cfg = STATUS_CONFIG[asset.status];
          const TrendIcon = asset.trendDir === 'up' ? TrendingUp : TrendingDown;
          const trendColor = asset.trendDir === 'up' ? '#ff9f43' : '#2ecc71';

          return (
            <div
              key={asset.id}
              onClick={() => onAssetClick && onAssetClick(asset)}
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <AlertTriangle size={13} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1', marginBottom: 2 }}>{asset.name}</div>
                  <div style={{ fontSize: 9, color: '#475569', marginBottom: 6 }}>{asset.city} · {asset.assetType}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{asset.score}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, fontWeight: 700, color: trendColor }}>
                      <TrendIcon size={9} />{asset.trend}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 8, fontWeight: 800, marginTop: 4, letterSpacing: '0.12em',
                    color: cfg.color, background: cfg.bg,
                    display: 'inline-block', padding: '2px 7px', borderRadius: 3,
                  }}>
                    {asset.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 18px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: 9, fontWeight: 700, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {assets.length} Total Assets · {totalValue}
      </div>
    </aside>
  );
};

export default SidebarLeft;
