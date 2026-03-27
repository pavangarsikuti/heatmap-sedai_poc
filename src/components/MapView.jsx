import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { STATUS_CONFIG, REGIONAL_DATA } from '../data/assets';
import { X, TrendingUp, TrendingDown, ChevronRight, Layers, Compass, MapPin, Loader2, Star, Globe, Phone, Clock, ExternalLink, User, Quote, AlertCircle, Navigation } from 'lucide-react';

// ── Radar Chart ──────────────────────────────────────────────────────────────
const RadarChart = ({ data, size = 120, color = '#3b82f6' }) => {
  const padding = 20;
  const radius = (size / 2) - padding;
  const centerX = size / 2;
  const centerY = size / 2;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const r = (d.A / 100) * radius;
    const x = centerX + r * Math.sin(i * angleStep);
    const y = centerY - r * Math.cos(i * angleStep);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Grid */}
      {gridLevels.map(level => {
        const r = level * radius;
        const gridPoints = data.map((_, i) => {
          const x = centerX + r * Math.sin(i * angleStep);
          const y = centerY - r * Math.cos(i * angleStep);
          return `${x},${y}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={gridPoints}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Spokes */}
      {data.map((_, i) => {
        const x = centerX + radius * Math.sin(i * angleStep);
        const y = centerY - radius * Math.cos(i * angleStep);
        return (
          <line
            key={i}
            x1={centerX} y1={centerY} x2={x} y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Labels */}
      {data.map((d, i) => {
        const x = centerX + (radius + 10) * Math.sin(i * angleStep);
        const y = centerY - (radius + 10) * Math.cos(i * angleStep);
        return (
          <text
            key={i}
            x={x} y={y}
            fontSize="8"
            fill="#64748b"
            fontWeight="700"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {d.subject.toUpperCase()}
          </text>
        );
      })}
      {/* Data Polygon */}
      <polygon
        points={points}
        fill={`${color}30`}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

// ── Tooltip ────────────────────────────────────────────────────────────────────
const MapTooltip = ({ asset, pos, onClose, pinned }) => {
  if (!asset) return null;
  const cfg = STATUS_CONFIG[asset.status];
  const TrendIcon = asset.trendDir === 'up' ? TrendingUp : TrendingDown;
  const trendColor = asset.trendDir === 'up' ? '#ff9f43' : '#2ecc71';

  return (
    <div style={{
      position: 'fixed',
      left: Math.min(pos.x + 20, window.innerWidth - 620),
      top: Math.max(pos.y - 170, 8),
      zIndex: 9999,
      display: 'flex',
      gap: 0,
      background: 'rgba(7,8,17,0.95)',
      backdropFilter: 'blur(28px)',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: `0 32px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)`,
      animation: 'fadeIn .2s ease',
      pointerEvents: pinned ? 'auto' : 'none',
      width: 600,
    }}>
      {/* CARD 1: OVERVIEW (Original Data) */}
      <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 4, letterSpacing: '0.05em' }}>{asset.city}, {asset.country}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>{asset.name}</div>
            </div>
            {!asset.image && pinned && (
               <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: cfg.color, lineHeight: 1 }}>{asset.score}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor, fontSize: 11, fontWeight: 800 }}>
              <TrendIcon size={12} />{asset.trend}
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 5, display: 'inline-block' }}>
                {asset.status}
              </div>
              <div style={{ fontSize: 9, color: '#334155', fontWeight: 600, marginTop: 4 }}>{asset.units}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Key Risk Drivers</div>
          {asset.drivers.map((d, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                    {d.label} {d.desc && <span style={{ color: '#475569', fontSize: 10 }}>({d.desc})</span>}
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#f1f5f9' }}>{d.value}%</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: `${d.value}%`, height: '100%', background: d.color, borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <span style={{ fontSize: 10, color: '#475569' }}>
            Fund: <span style={{ color: '#94a3b8' }}>{asset.fund}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3b82f6', fontSize: 10, fontWeight: 800 }}>
            Full Report <ChevronRight size={10} />
          </span>
        </div>
      </div>

      {/* CARD 2: ANALYTICS (New Data) */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column' }}>
        {/* Building Image */}
        {asset.image && (
          <div style={{ height: 160, width: '100%', overflow: 'hidden', position: 'relative' }}>
            <img src={asset.image} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,8,17,0.9), transparent)' }} />
            {pinned && (
              <button
                onClick={onClose}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', padding: 6, borderRadius: '50%', display: 'flex' }}
              >
                <X size={14} />
              </button>
            )}
            <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', gap: 6, alignItems: 'center' }}>
               <div style={{ fontSize: 9, fontWeight: 800, color: '#3b82f6', background: 'rgba(59,130,246,0.15)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(59,130,246,0.3)', backdropFilter: 'blur(8px)' }}>
                SATELLITE VIEW
              </div>
              {asset.googleMapsUrl && (
                <a
                  href={asset.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontSize: 9, fontWeight: 800, color: '#2ecc71',
                    background: 'rgba(46,204,113,0.15)', padding: '2px 8px', borderRadius: 4,
                    border: '1px solid rgba(46,204,113,0.3)', backdropFilter: 'blur(8px)',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.15)'; }}
                >
                  📍 VIEW ON MAPS
                </a>
              )}
            </div>
          </div>
        )}

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <RadarChart data={asset.radarData || []} size={130} color={cfg.color} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>3-6M Predictive Forecast</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, background: 'rgba(46,204,113,0.05)', padding: '10px', borderRadius: 8, border: '1px solid rgba(46,204,113,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#2ecc71' }}>{asset.predictions?.increase}%</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', marginTop: 2 }}>INCREASE</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,77,77,0.05)', padding: '10px', borderRadius: 8, border: '1px solid rgba(255,77,77,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#ff4d4d' }}>{asset.predictions?.decrease}%</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', marginTop: 2 }}>DECREASE</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(148,163,184,0.05)', padding: '10px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>{asset.predictions?.stable}%</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', marginTop: 2 }}>STABLE</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 10, color: '#475569' }}>
            Confidence: <span style={{ color: '#2ecc71', fontWeight: 800 }}>{asset.confidence}</span>
          </div>
          <div style={{ fontSize: 10, color: '#475569' }}>
            Valuation: <span style={{ color: '#fff', fontWeight: 800 }}>{asset.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Location Detail Card ──────────────────────────────────────────────────────
const LocationDetailCard = ({ data, onClose, isRightSidebarOpen }) => {
  if (!data) return null;
  const { 
    name, address, type, photoUrl, lat, lng, loading, error,
    rating, user_ratings_total, opening_hours, website, formatted_phone_number, url,
    business_status, price_level, reviews, vicinity, plus_code
  } = data;

  // Determine type badge color
  const typeConfigs = {
    'residential': { color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
    'commercial': { color: '#ff9f43', bg: 'rgba(255,159,67,0.1)' },
    'industrial': { color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)' },
    'transit': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    'default': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
  };
  const typeKey = type?.toLowerCase().includes('res') ? 'residential' :
                  type?.toLowerCase().includes('com') ? 'commercial' :
                  type?.toLowerCase().includes('ind') ? 'industrial' :
                  type?.toLowerCase().includes('tran') || type?.toLowerCase().includes('hub') ? 'transit' : 'default';
  const tCfg = typeConfigs[typeKey];

  // Helper for Plus Code detection
  const isPlusCode = name?.includes('+') && !name?.includes(' ');
  const displayTitle = isPlusCode ? "Geographic Coordinate" : name;

  return (
    <div style={{
      position: 'fixed',
      right: isRightSidebarOpen ? 360 : 20,
      top: 80,
      bottom: 70,
      width: 340,
      background: 'rgba(7,8,17,0.95)',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 24,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 32px 72px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)',
      transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
      zIndex: 10000,
    }} className="location-detail-card">
      <style>{`
        @media (max-width: 768px) {
          .location-detail-card {
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            border-radius: 28px 28px 0 0 !important;
            max-height: 85vh !important;
          }
        }
        .detail-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .detail-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .detail-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .review-card {
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 12px;
        }
      `}</style>
      
      {/* Header Image Section */}
      <div style={{ height: 180, width: '100%', background: '#070811', position: 'relative', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={28} color="#3b82f6" />
          </div>
        ) : photoUrl ? (
          <>
            <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,8,17,0.9), transparent 60%)' }} />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <MapPin size={40} color="#27272a" />
            <span style={{ fontSize: 10, color: '#3f3f46', fontWeight: 800, letterSpacing: '0.1em' }}>SENSORS ACTIVE — NO VISUAL DATA</span>
          </div>
        )}
        
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', padding: 8, cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
        >
          <X size={18} />
        </button>

        {!loading && (
          <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 6 }}>
               {type && (
                <div style={{ 
                  background: tCfg.bg, color: tCfg.color, 
                  padding: '4px 10px', borderRadius: 8, 
                  fontSize: 9, fontWeight: 900, 
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  border: `1px solid ${tCfg.color}44`,
                  backdropFilter: 'blur(12px)'
                }}>
                  {type}
                </div>
              )}
              {price_level !== undefined && (
                <div style={{ 
                  background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', 
                  padding: '4px 10px', borderRadius: 8, 
                  fontSize: 10, fontWeight: 900,
                  border: `1px solid rgba(251, 191, 36, 0.3)`,
                  backdropFilter: 'blur(12px)'
                }}>
                  {'$'.repeat(price_level)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="detail-scroll" style={{ padding: '24px 20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {error ? (
          <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', padding: '40px 20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 16, border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <AlertCircle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontWeight: 600 }}>{error}</div>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ height: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 6, width: '70%' }} />
            <div style={{ height: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 4, width: '90%' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ height: 40, flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }} />
              <div style={{ height: 40, flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }} />
            </div>
            <div style={{ height: 100, background: 'rgba(255,255,255,0.01)', borderRadius: 16 }} />
          </div>
        ) : (
          <>
            {/* Title & Status */}
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{displayTitle}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(251,191,36,0.1)', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#fbbf24' }}>{rating}</span>
                    <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>({user_ratings_total})</span>
                  </div>
                )}
                {business_status && (
                  <div style={{ 
                    fontSize: 10, fontWeight: 900, 
                    color: business_status === 'OPERATIONAL' ? '#2ecc71' : '#ef4444',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {business_status.replace(/_/g, ' ')}
                  </div>
                )}
              </div>
            </div>

            {/* Address & Quick Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <MapPin size={16} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{address}</div>
              </div>
              
              {opening_hours && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Clock size={16} color={opening_hours.open_now ? "#2ecc71" : "#ef4444"} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: opening_hours.open_now ? "#2ecc71" : "#ef4444" }}>
                      {opening_hours.open_now ? "Operational Now" : "Currently Closed"}
                    </div>
                    {opening_hours.weekday_text && (
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                        {opening_hours.weekday_text[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {website && (
                <a href={website} target="_blank" rel="noreferrer" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 12, color: '#3b82f6', fontSize: 11, fontWeight: 900, textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}>
                  <Globe size={14} /> WEBSITE
                </a>
              )}
              {formatted_phone_number && (
                <a href={`tel:${formatted_phone_number}`} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, color: '#f1f5f9', fontSize: 11, fontWeight: 900, textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                  <Phone size={14} /> CALL
                </a>
              )}
            </div>

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Quote size={10} /> Community Intelligence
                </div>
                {reviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={10} color="#3b82f6" />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9' }}>{r.author_name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} size={8} fill={si < r.rating ? "#fbbf24" : "transparent"} color={si < r.rating ? "#fbbf24" : "#334155"} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, margin: 0, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{r.text}"
                    </p>
                    <div style={{ fontSize: 9, color: '#4b5563', marginTop: 6, textAlign: 'right' }}>{r.relative_time_description}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Google Maps Link */}
            {url && (
              <a href={url} target="_blank" rel="noreferrer" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px', background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(39,174,96,0.15))', 
                border: '1px solid rgba(46,204,113,0.25)',
                borderRadius: 14, color: '#2ecc71', fontSize: 12, fontWeight: 900, textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(46,204,113,0.1)'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(46,204,113,0.25)'; 
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(46,204,113,0.2)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(46,204,113,0.15)'; 
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(46,204,113,0.1)';
              }}>
                <Navigation size={16} /> VIEW ON GOOGLE MAPS
              </a>
            )}
          </>
        )}
      </div>

      {/* Footer Coords */}
      {!loading && !error && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 10, color: '#f8fafc', fontWeight: 800, letterSpacing: '0.02em' }}>{plus_code?.global_code || "COORDINATE LOCK"}</div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>
              {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
            </div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 15px rgba(59,130,246,0.8)', animation: 'pulseRing 2s infinite' }} />
        </div>
      )}
    </div>
  );
};

// ── Cluster Tooltip ───────────────────────────────────────────────────────────
const ClusterTooltip = ({ cluster, pos, assets }) => {
  if (!cluster) return null;
  const clusterAssets = assets.filter(a => cluster.ids?.includes(a.id));
  const criticalCount = clusterAssets.filter(a => a.status === 'CRITICAL').length;
  const elevatedCount = clusterAssets.filter(a => a.status === 'ELEVATED').length;

  return (
    <div style={{
      position: 'fixed',
      left: Math.min(pos.x + 20, window.innerWidth - 220),
      top: Math.max(pos.y - 120, 8),
      zIndex: 9999,
      width: 210,
      background: 'rgba(7,8,17,0.97)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: '12px 14px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
      animation: 'fadeIn .15s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
        {cluster.count} Assets nearby
      </div>
      <div style={{ fontSize: 9, color: '#475569', marginBottom: 8 }}>Zoom in to see individual assets</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {criticalCount > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: '#ff4d4d', background: 'rgba(255,77,77,0.12)', padding: '2px 7px', borderRadius: 3 }}>{criticalCount} Critical</span>}
        {elevatedCount > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: '#ff9f43', background: 'rgba(255,159,67,0.12)', padding: '2px 7px', borderRadius: 3 }}>{elevatedCount} Elevated</span>}
      </div>
    </div>
  );
};

// ── Main MapView ───────────────────────────────────────────────────────────────
const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Map asset country names to GeoJSON feature ADMIN names
const COUNTRY_NAME_MAP = {
  'UK': 'United Kingdom',
  'Switzerland': 'Switzerland',
  'Germany': 'Germany',
  'France': 'France',
  'Netherlands': 'Netherlands',
  'Spain': 'Spain',
  'Italy': 'Italy',
  'Sweden': 'Sweden',
  'Poland': 'Poland',
  'Portugal': 'Portugal',
  'Austria': 'Austria',
};

// Helper to resolve target node from geoPath
const resolveLatestNode = (path) => {
  if (!path || path.length <= 1) return null;
  let current = REGIONAL_DATA;
  let target = null;
  for (let i = 1; i < path.length; i++) {
    const name = path[i];
    if (current && current[name]) {
      target = current[name];
      current = target.children;
    } else {
      break;
    }
  }
  return target;
};

const MapView = ({ 
  filteredAssets, 
  viewMode, 
  isSidebarOpen, 
  isRightSidebarOpen,
  onToggleSidebar, 
  theme, 
  onThemeChange, 
  focusAsset,
  geoPath,
  onDrillDown,
  onStepUp
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const renderMarkersRef = useRef(null);
  const filteredAssetsRef = useRef(filteredAssets);
  const is3DRef = useRef(false);
  const geoJsonRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [pinnedAssetId, setPinnedAssetId] = useState(null);
  const [pinnedPos, setPinnedPos] = useState({ x: 0, y: 0 });
  const [clusterTooltip, setClusterTooltip] = useState(null);
  const [regionTooltip, setRegionTooltip] = useState(null); // Keep for future use or remove if absolutely sure
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(3.5);
  const [locationDetail, setLocationDetail] = useState(null);
  const locationMarkerRef = useRef(null);
  const lastClickRef = useRef(0);
  const geoPathRef = useRef(geoPath);

  // ── Auto-Zoom & Highlighting Logic ──
  useEffect(() => {
    if (!mapRef.current || !geoPath) return;
    const map = mapRef.current;

    const targetNode = resolveLatestNode(geoPath);
    if (targetNode && targetNode.center) {
      map.flyTo({
        center: targetNode.center,
        zoom: targetNode.zoom || 11,
        essential: true,
        duration: 2500,
        pitch: targetNode.zoom > 15 ? 45 : 0,
      });

      // Update highlight layer
      const highlightSource = map.getSource('region-highlight');
      if (highlightSource) {
        highlightSource.setData({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: targetNode.center }
          }]
        });
      }
    } else if (geoPath.length === 1 && geoPath[0] === 'Europe') {
      map.flyTo({ center: [10, 50], zoom: 3.8, essential: true });
      const highlightSource = map.getSource('region-highlight');
      if (highlightSource) {
        highlightSource.setData({ type: 'FeatureCollection', features: [] });
      }
    }
    
    geoPathRef.current = geoPath;
  }, [geoPath]);

  // Initial map setup for highlighting
  useEffect(() => {
    if (!mapRef.current) return;
    const m = mapRef.current;

    const setupLayers = () => {
      if (!m.getSource('region-highlight')) {
        m.addSource('region-highlight', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        m.addLayer({
          id: 'region-highlight-glow',
          type: 'circle',
          source: 'region-highlight',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 50, 18, 500],
            'circle-color': '#6366f1',
            'circle-opacity': 0.15,
            'circle-blur': 1,
          }
        });

        m.addLayer({
          id: 'region-highlight-ring',
          type: 'circle',
          source: 'region-highlight',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 10, 18, 100],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#818cf8',
            'circle-stroke-opacity': 0.8,
            'circle-color': 'transparent'
          }
        });
      }
    };

    if (m.isStyleLoaded()) setupLayers();
    else m.on('load', setupLayers);

    return () => {
      if (m) m.off('load', setupLayers);
    };
  }, []);

  // Map styles
  const LIGHT_STYLE = 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';
  const DARK_STYLE = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png';

  const getMapStyle = (t) => ({
    version: 8,
    sources: {
      'carto-base': {
        type: 'raster',
        tiles: [t],
        tileSize: 256,
        attribution: '© CARTO © OpenStreetMap',
        maxzoom: 19,
      },
    },
    layers: [{ id: 'carto-base-layer', type: 'raster', source: 'carto-base' }],
  });

  const MAP_STYLE = getMapStyle(theme === 'light' ? LIGHT_STYLE : DARK_STYLE);

  // Get the highest-severity color of all assets in a cluster
  const getClusterColor = useCallback((ids) => {
    const clusterAssets = filteredAssets.filter(a => ids.includes(a.id));
    const statuses = ['CRITICAL', 'ELEVATED', 'MODERATE', 'SAFE'];
    for (const s of statuses) {
      if (clusterAssets.some(a => a.status === s)) return STATUS_CONFIG[s].color;
    }
    return '#fff';
  }, [filteredAssets]);

  // ── Fetch Location Details ──
  const fetchLocationDetails = async (lng, lat) => {
    setLocationDetail({ lat, lng, loading: true, name: 'Loading...', address: 'Fetching address...' });
    
    try {
      if (!window.google || !window.google.maps) {
        throw new Error("Google Maps SDK not loaded");
      }

      // Initialize Geocoder and PlacesService (using a dummy div)
      const geocoder = new window.google.maps.Geocoder();
      const dummyDiv = document.createElement('div');
      const placesService = new window.google.maps.places.PlacesService(dummyDiv);

      // Step 1: Reverse Geocoding
      const geoData = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) resolve(results[0]);
          else reject(new Error(`Geocoding failed: ${status}`));
        });
      });

      let address = geoData.formatted_address || "No address found";
      let placeId = geoData.place_id;
      let types = geoData.types || [];
      
      let name = "Point of Interest";
      let photoUrl = null;
      let category = types[0] || 'Location';
      let moreData = {};

      if (placeId) {
        // Step 2: Place Details
        const fields = [
          'name', 'formatted_address', 'types', 'photos', 'rating', 
          'user_ratings_total', 'opening_hours', 'website', 
          'formatted_phone_number', 'url', 'business_status', 
          'price_level', 'reviews', 'vicinity', 'plus_code'
        ];
        
        const detailResult = await new Promise((resolve, reject) => {
          placesService.getDetails({ placeId, fields }, (result, status) => {
            if (status === 'OK' && result) resolve(result);
            else reject(new Error(`Place Details failed: ${status}`));
          });
        });
        
        if (detailResult) {
          name = detailResult.name || name;
          category = detailResult.types?.[0] || category;
          
          if (detailResult.photos && detailResult.photos.length > 0) {
            // Get URL from the photo object
            photoUrl = detailResult.photos[0].getUrl({ maxWidth: 800 });
          }

          // Map SDK data to the format used in UI
          moreData = {
            rating: detailResult.rating,
            user_ratings_total: detailResult.user_ratings_total,
            opening_hours: detailResult.opening_hours ? {
              open_now: typeof detailResult.opening_hours.isOpen === 'function' ? detailResult.opening_hours.isOpen() : undefined,
              weekday_text: detailResult.opening_hours.weekday_text
            } : undefined,
            website: detailResult.website,
            formatted_phone_number: detailResult.formatted_phone_number,
            url: detailResult.url,
            business_status: detailResult.business_status,
            price_level: detailResult.price_level,
            reviews: detailResult.reviews?.map(r => ({
              author_name: r.author_name,
              rating: r.rating,
              text: r.text,
              relative_time_description: r.relative_time_description
            })),
            vicinity: detailResult.vicinity,
            plus_code: detailResult.plus_code
          };
        }
      }

      // Fallback to Street View if no photo
      if (!photoUrl) {
        photoUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&fov=90&key=${GOOGLE_MAPS_API_KEY}`;
      }

      setLocationDetail({
        lng, lat, address, name, 
        type: category.replace(/_/g, ' '), 
        photoUrl, 
        loading: false,
        ...moreData
      });

    } catch (err) {
      console.error("Geocoding error:", err);
      setLocationDetail(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Could not load details — tap to retry",
        name: "Unknown Location",
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        photoUrl: `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&fov=90&key=${GOOGLE_MAPS_API_KEY}`
      }));
    }
  };

  const handleMapClick = useCallback((e) => {
    const now = Date.now();
    if (now - lastClickRef.current < 200) return;
    lastClickRef.current = now;

    // Check if tooltip is open (don't re-fetch if we're just clicking around the same area rapidly)
    // Removed viewMode === 'Regions' check to allow clicking in all modes

    const { lng, lat } = e.lngLat;
    
    // Close other tooltips
    setPinnedAssetId(null);
    setTooltip(null);
    setClusterTooltip(null);

    // Drop Pin
    const map = mapRef.current;
    if (locationMarkerRef.current) locationMarkerRef.current.remove();
    
    const el = document.createElement('div');
    el.innerHTML = `<div style="width:20px; height:20px; background:#3b82f6; border:3px solid #fff; border-radius:50%; box-shadow:0 0 20px rgba(59,130,246,0.6);"></div>`;
    
    locationMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lng, lat])
      .addTo(map);

    fetchLocationDetails(lng, lat);
  }, [viewMode, fetchLocationDetails]);

  const handleMapClickRef = useRef(handleMapClick);
  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  }, [handleMapClick]);

  // Keep refs updated for listeners
  useEffect(() => {
    filteredAssetsRef.current = filteredAssets;
  }, [filteredAssets]);

  // Render markers using Supercluster
  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.loaded()) return;

    const assets = filteredAssetsRef.current;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (assets.length === 0) return;

    const zoom = Math.floor(map.getZoom());
    setCurrentZoom(zoom);

    if (viewMode === 'Regions') {
      // ── Region Heatmap Mode ──
      // Calculate per-country risk aggregates
      const countryRiskMap = {};
      assets.forEach(a => {
        const geoName = COUNTRY_NAME_MAP[a.country] || a.country;
        if (!countryRiskMap[geoName]) {
          countryRiskMap[geoName] = { scores: [], count: 0, statuses: [], coords: [], assetCountry: a.country };
        }
        countryRiskMap[geoName].scores.push(a.score);
        countryRiskMap[geoName].count++;
        countryRiskMap[geoName].statuses.push(a.status);
        countryRiskMap[geoName].coords.push(a.coordinates);
      });

      // Build country fill colors
      const countryColors = {};
      Object.entries(countryRiskMap).forEach(([name, data]) => {
        const avg = data.scores.reduce((s, v) => s + v, 0) / data.scores.length;
        if (avg >= 55) countryColors[name] = 'rgba(255, 77, 77, 0.35)';      // Red
        else if (avg >= 35) countryColors[name] = 'rgba(255, 205, 60, 0.30)'; // Yellow
        else countryColors[name] = 'rgba(46, 204, 113, 0.25)';               // Green
      });

      // Add/update GeoJSON fill layer
      const addOrUpdateRegionLayer = (geojson) => {
        // Filter to only European countries that have assets
        const assetCountryNames = Object.keys(countryRiskMap);
        const filteredFeatures = geojson.features.filter(f => {
          const name = f.properties.ADMIN || f.properties.name;
          return assetCountryNames.includes(name);
        });

        // Add color property to each feature
        filteredFeatures.forEach(f => {
          const name = f.properties.ADMIN || f.properties.name;
          f.properties._riskColor = countryColors[name] || 'rgba(255,255,255,0)';
          const data = countryRiskMap[name];
          if (data) {
            f.properties._avgScore = Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length * 10) / 10;
            f.properties._count = data.count;
            f.properties._assetCountry = data.assetCountry;
          }
        });

        const filteredGeoJson = { type: 'FeatureCollection', features: filteredFeatures };

        if (map.getSource('region-risk')) {
          map.getSource('region-risk').setData(filteredGeoJson);
        } else {
          map.addSource('region-risk', { type: 'geojson', data: filteredGeoJson });
          map.addLayer({
            id: 'region-risk-fill',
            type: 'fill',
            source: 'region-risk',
            paint: {
              'fill-color': ['get', '_riskColor'],
              'fill-opacity': 1,
            },
          });
          map.addLayer({
            id: 'region-risk-outline',
            type: 'line',
            source: 'region-risk',
            paint: {
              'line-color': 'rgba(255,255,255,0.2)',
              'line-width': 1.5,
            },
          });
        }

        // Make layers visible
        map.setLayoutProperty('region-risk-fill', 'visibility', 'visible');
        map.setLayoutProperty('region-risk-outline', 'visibility', 'visible');

        // Add labels for each country with assets
        Object.entries(countryRiskMap).forEach(([geoName, data]) => {
          const avgLng = data.coords.reduce((s, c) => s + c[0], 0) / data.coords.length;
          const avgLat = data.coords.reduce((s, c) => s + c[1], 0) / data.coords.length;
          const avg = Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length * 10) / 10;
          const color = avg >= 55 ? '#ff4d4d' : avg >= 35 ? '#ffcd3c' : '#2ecc71';

          const el = document.createElement('div');
          el.style.cssText = 'width:0; height:0; display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;';
          el.innerHTML = `
            <div style="
              position:absolute; padding:8px 14px; border-radius:8px;
              background:rgba(7,8,17,0.88); backdrop-filter:blur(12px);
              border:1px solid ${color}44;
              box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 20px ${color}15;
              display:flex; flex-direction:column; align-items:center; gap:4px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events:auto;
            " class="region-label">
              <div style="font-size:8px; font-weight:800; color:${color}; letter-spacing:0.1em;">${data.assetCountry.toUpperCase()}</div>
              <div style="display:flex; align-items:baseline; gap:6px;">
                <span style="font-size:18px; font-weight:900; color:${color};">${avg}</span>
                <span style="font-size:9px; font-weight:700; color:#475569;">${data.count} asset${data.count > 1 ? 's' : ''}</span>
              </div>
            </div>`;

          el.addEventListener('mouseenter', (e) => {
            el.querySelector('.region-label').style.transform = 'scale(1.05)';
            el.querySelector('.region-label').style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 30px ${color}25`;
            // Redundant tooltip removed as per user feedback
            // setRegionTooltip({ name: data.assetCountry, count: data.count, avg, color });
            // setHoverPos({ x: e.clientX, y: e.clientY });
          });
          el.addEventListener('mouseleave', () => {
            el.querySelector('.region-label').style.transform = 'scale(1)';
            el.querySelector('.region-label').style.boxShadow = `0 4px 24px rgba(0,0,0,0.5), 0 0 20px ${color}15`;
            // setRegionTooltip(null);
          });
          el.addEventListener('click', () => {
            map.flyTo({ center: [avgLng, avgLat], zoom: 6, duration: 1500 });
          });

          const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([avgLng, avgLat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      };

      // Fetch GeoJSON (cached)
      if (geoJsonRef.current) {
        addOrUpdateRegionLayer(geoJsonRef.current);
      } else {
        fetch(GEOJSON_URL)
          .then(r => r.json())
          .then(data => {
            geoJsonRef.current = data;
            addOrUpdateRegionLayer(data);
          })
          .catch(err => console.error('Failed to load GeoJSON:', err));
      }
      return;
    }

    // Hide region layers if in Assets mode
    if (map.getLayer('region-risk-fill')) {
      map.setLayoutProperty('region-risk-fill', 'visibility', 'none');
      map.setLayoutProperty('region-risk-outline', 'visibility', 'none');
    }

    // ── Assets Mode (Clustered) ──
    // Build supercluster
    const sc = new Supercluster({ radius: 60, maxZoom: 14 });
    const points = assets.map(a => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: a.coordinates },
      properties: { id: a.id },
    }));
    sc.load(points);

    const bounds = map.getBounds();
    const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    const clusters = sc.getClusters(bbox, zoom);

    clusters.forEach(cluster => {
      const [lng, lat] = cluster.geometry.coordinates;
      const el = document.createElement('div');
      el.style.cssText = 'width:0; height:0; display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;';

      if (cluster.properties.cluster) {
        // ── Cluster marker ──
        const count = cluster.properties.point_count;
        const ids = sc.getLeaves(cluster.id, Infinity).map(l => l.properties.id);
        const color = getClusterColor(ids);
        const size = Math.min(20 + count * 5, 52);

        el.innerHTML = `
          <div style="
            width:${size}px; height:${size}px; border-radius:50%;
            background:${color}22; border:2px solid ${color}88;
            display:flex; align-items:center; justify-content:center;
            position:absolute;
            box-shadow: 0 0 16px ${color}44, 0 0 4px ${color}88;
            transition: transform .15s;
          " class="cluster-inner">
            <div style="
              position:absolute; width:${size * 0.55}px; height:${size * 0.55}px;
              border-radius:50%; background:${color}55;
              border:1.5px solid ${color};
              display:flex; align-items:center; justify-content:center;
              font-size:${Math.max(9, size * 0.28)}px; font-weight:800;
              color:#fff; font-family:Inter,sans-serif;
              box-shadow: 0 0 10px ${color};
            ">${count}</div>
          </div>`;

        el.addEventListener('mouseenter', (e) => {
          el.querySelector('.cluster-inner').style.transform = 'scale(1.15)';
          setClusterTooltip({ count, ids });
          setHoverPos({ x: e.clientX, y: e.clientY });
          setTooltip(null);
        });
        el.addEventListener('mouseleave', () => {
          el.querySelector('.cluster-inner').style.transform = 'scale(1)';
          setClusterTooltip(null);
        });
        el.addEventListener('mousemove', (e) => {
          setHoverPos({ x: e.clientX, y: e.clientY });
        });
        el.addEventListener('click', () => {
          map.flyTo({ center: [lng, lat], zoom: zoom + 2, duration: 1000, essential: true });
        });

      } else {
        // ── Single asset marker ──
        const asset = assets.find(a => a.id === cluster.properties.id);
        if (!asset) return;
        const cfg = STATUS_CONFIG[asset.status];

        el.innerHTML = `
          <div style="position:absolute; display:flex; align-items:center; justify-content:center;">
            <div class="pulse-ring" style="
              position:absolute; width:22px; height:22px; border-radius:3px;
              background:${cfg.color}; opacity:.12;
              animation: pulseRing ${1.8 + asset.id * 0.15}s ease-in-out infinite;
            "></div>
            <div style="
              width:12px; height:12px; border-radius:2.5px;
              background:${cfg.color}; opacity:.9;
              box-shadow:0 0 6px ${cfg.color}, 0 0 16px ${cfg.color}60;
              transition:transform .15s, box-shadow .15s;
              position:relative; z-index:1;
            " class="core"></div>
          </div>`;

        el.addEventListener('mouseenter', (e) => {
          el.querySelector('.core').style.transform = 'scale(1.5)';
          el.querySelector('.core').style.boxShadow = `0 0 12px ${cfg.color}, 0 0 28px ${cfg.color}80`;
          if (!pinnedAssetId) {
            setTooltip(asset);
            setHoverPos({ x: e.clientX, y: e.clientY });
            setClusterTooltip(null);
          }
        });
        el.addEventListener('mouseleave', () => {
          el.querySelector('.core').style.transform = 'scale(1)';
          el.querySelector('.core').style.boxShadow = `0 0 6px ${cfg.color}, 0 0 16px ${cfg.color}60`;
          if (!pinnedAssetId) {
            setTooltip(null);
          }
        });
        el.addEventListener('mousemove', (e) => {
          if (!pinnedAssetId) {
            setHoverPos({ x: e.clientX, y: e.clientY });
          }
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setPinnedAssetId(asset.id);
          // Calculate project position manually to ensure tooltip is correctly placed
          const projectPos = map.project(asset.coordinates);
          const rect = mapContainer.current.getBoundingClientRect();
          setPinnedPos({ x: rect.left + projectPos.x, y: rect.top + projectPos.y });
          
          setTooltip(null);
          setClusterTooltip(null);
          map.flyTo({ center: asset.coordinates, zoom: 16, duration: 2000, essential: true });
        });
      }

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [getClusterColor, viewMode, pinnedAssetId]);

  // Keep renderMarkersRef updated
  useEffect(() => {
    renderMarkersRef.current = renderMarkers;
  }, [renderMarkers]);

  // Toggle 3D pitch
  const toggle3D = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else {
      map.easeTo({ pitch: 55, bearing: -20, duration: 800 });
    }
    setIs3D(v => {
      const next = !v;
      is3DRef.current = next;
      return next;
    });
  }, [is3D]);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [10, 50],
      zoom: 3.5,
      minZoom: 3,
      maxZoom: 18,
      maxBounds: [
        [-35, 30], // Southwest coordinates (approx below Spain/Portugal)
        [45, 75]   // Northeast coordinates (approx past Finland/Moscow)
      ],
      projection: { name: 'globe' }, // ← Enable 3D Globe
      scrollZoom: true,
      pitchWithRotate: true,
      attributionControl: false,
    });

    map.on('click', (e) => handleMapClickRef.current(e));

    mapRef.current = map;

    map.on('load', () => {
      renderMarkers();
    });

    const onMove = () => {
      if (renderMarkersRef.current) renderMarkersRef.current();
    };

    // Re-render on move/zoom (clustering updates)
    map.on('moveend', onMove);
    map.on('zoomend', onMove);

    // Add attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    // ── Globe Rotation Logic ──
    let userInteracting = false;
    const spinEnabled = true;

    const onInteractionStart = () => { userInteracting = true; };
    const onInteractionEnd = () => { userInteracting = false; };

    map.on('mousedown', onInteractionStart);
    map.on('mouseup', onInteractionEnd);
    map.on('dragstart', onInteractionStart);
    map.on('dragend', onInteractionEnd);
    map.on('zoomstart', onInteractionStart);
    map.on('zoomend', onInteractionEnd);

    const rotateGlobe = () => {
      if (spinEnabled && !userInteracting && is3DRef.current && map.getZoom() < 5) {
        const center = map.getCenter();
        center.lng += 0.12; // Speed
        map.setCenter(center);
      }
      requestAnimationFrame(rotateGlobe);
    };

    rotateGlobe();

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render markers when data changes
  useEffect(() => {
    if (mapRef.current?.loaded()) {
      renderMarkers();
    }
  }, [filteredAssets, renderMarkers]);

  // Resize map when sidebar toggles
  // Theme effect
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.loaded()) {
      map.setStyle(getMapStyle(theme === 'light' ? LIGHT_STYLE : DARK_STYLE));
    }
  }, [theme]);

  // Resize map when sidebar toggles
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.resize(), 350); // wait for CSS transition
    }
  }, [isSidebarOpen]);

  // Focus asset from sidebar
  useEffect(() => {
    if (focusAsset && mapRef.current && mapRef.current.loaded()) {
      mapRef.current.flyTo({ center: focusAsset.coordinates, zoom: 16, duration: 2500 });
      setPinnedAssetId(focusAsset.id);
      setTooltip(null);
      setClusterTooltip(null);
      
      const updatePinnedPos = () => {
        if (!mapRef.current || !mapContainer.current) return;
        const pos = mapRef.current.project(focusAsset.coordinates);
        const rect = mapContainer.current.getBoundingClientRect();
        setPinnedPos({ x: rect.left + pos.x, y: rect.top + pos.y });
      };
      updatePinnedPos();
      mapRef.current.once('moveend', updatePinnedPos);
    }
  }, [focusAsset]);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes pulseRing {
          0%,100% { transform: scale(1); opacity: .12; }
          50%      { transform: scale(2); opacity: .04; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        .maplibregl-ctrl-attrib { font-size:9px !important; }
        .maplibregl-ctrl-bottom-left { bottom:8px !important; left:8px !important; }
      `}</style>

      {/* Map container */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Tooltips */}
      <MapTooltip 
        asset={pinnedAssetId ? filteredAssets.find(a => a.id === pinnedAssetId) : tooltip} 
        pos={pinnedAssetId ? pinnedPos : hoverPos} 
        onClose={() => { setTooltip(null); setPinnedAssetId(null); }} 
        pinned={!!pinnedAssetId}
      />
      <ClusterTooltip cluster={clusterTooltip} pos={hoverPos} assets={filteredAssets} />

      {/* Location Detail Card */}
      <LocationDetailCard 
        data={locationDetail} 
        onClose={() => {
          setLocationDetail(null);
          if (locationMarkerRef.current) {
            locationMarkerRef.current.remove();
            locationMarkerRef.current = null;
          }
        }} 
        isRightSidebarOpen={isRightSidebarOpen}
      />

      {/* Region Tooltip */}
      {/* {regionTooltip && (
        <div style={{
          position: 'fixed',
          left: Math.min(regionTooltip ? hoverPos.x + 20 : 0, window.innerWidth - 200),
          top: Math.max(hoverPos.y - 80, 8),
          zIndex: 9999,
          width: 180,
          background: 'rgba(7,8,17,0.97)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${regionTooltip.color}44`,
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: `0 24px 60px rgba(0,0,0,0.8), 0 0 20px ${regionTooltip.color}15`,
          animation: 'fadeIn .15s ease',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: regionTooltip.color, marginBottom: 4, letterSpacing: '0.08em' }}>
            {regionTooltip.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>Avg Risk Score</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: regionTooltip.color }}>{regionTooltip.avg}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>Assets</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{regionTooltip.count}</div>
            </div>
          </div>
        </div>
      )} */}

      {/* Top-right controls */}
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Theme Toggle */}
        <button
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 8,
            background: 'rgba(8,9,18,0.88)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7, color: '#64748b', cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          {theme === 'light' ? <span style={{ fontSize: 13 }}>🌙</span> : <span style={{ fontSize: 13 }}>☀️</span>}
        </button>

        {/* 3D Toggle */}
        {/* <button
          onClick={toggle3D}
          title="Toggle 3D view"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px',
            background: is3D ? 'rgba(59,130,246,0.25)' : 'rgba(8,9,18,0.88)',
            border: `1px solid ${is3D ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 7, color: is3D ? '#3b82f6' : '#64748b', cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all .2s',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
          }}
        >
          <Layers size={12} />
          {is3D ? '3D ON' : '3D OFF'}
        </button> */}

        {/* Zoom level badge */}
        <div style={{
          textAlign: 'center', fontSize: 9, fontWeight: 700, color: '#334155',
          background: 'rgba(8,9,18,0.75)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 5, padding: '4px 8px',
        }}>
          Z{Math.round(currentZoom)}
        </div>
      </div>

      {/* Asset count badge */}
      <div style={{
        position: 'absolute', top: 14, left: isSidebarOpen ? 14 : 52, zIndex: 10,
        fontSize: 10, fontWeight: 700, color: '#475569',
        background: 'rgba(8,9,18,0.8)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6, padding: '4px 10px', backdropFilter: 'blur(10px)',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {filteredAssets.length} assets visible
      </div>

      {/* Open Sidebar Button (when closed) */}
      {!isSidebarOpen && (
        <button
          onClick={onToggleSidebar}
          style={{
            position: 'absolute', top: 14, left: 14, zIndex: 11,
            width: 30, height: 30, borderRadius: 6,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease',
          }}
          title="Open Sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 24, right: 14, zIndex: 10,
        background: 'rgba(7,8,17,0.90)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 14px',
      }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: cfg.color, boxShadow: `0 0 5px ${cfg.color}80` }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em' }}>{key}</span>
          </div>
        ))}
        <div style={{ fontSize: 8, color: '#1e293b', marginTop: 4 }}>Scroll · Drag · Click cluster</div>
      </div>
    </div>
  );
};

export default MapView;
