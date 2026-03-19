import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { STATUS_CONFIG } from '../data/assets';
import { X, TrendingUp, TrendingDown, ChevronRight, Layers, Compass } from 'lucide-react';

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
            <img src={asset.image} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,8,17,0.9), transparent)' }} />
            {pinned && (
              <button
                onClick={onClose}
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', padding: 6, borderRadius: '50%', display: 'flex' }}
              >
                <X size={14} />
              </button>
            )}
            <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
               <div style={{ fontSize: 9, fontWeight: 800, color: '#3b82f6', background: 'rgba(59,130,246,0.15)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(59,130,246,0.3)', backdropFilter: 'blur(8px)' }}>
                SATELLITE VIEW
              </div>
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
const MapView = ({ filteredAssets, viewMode, isSidebarOpen, onToggleSidebar, theme, onThemeChange, focusAsset }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const renderMarkersRef = useRef(null);
  const filteredAssetsRef = useRef(filteredAssets);
  const is3DRef = useRef(false);
  const [tooltip, setTooltip] = useState(null);
  const [pinnedAssetId, setPinnedAssetId] = useState(null);
  const [pinnedPos, setPinnedPos] = useState({ x: 0, y: 0 });
  const [clusterTooltip, setClusterTooltip] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(3.5);

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
      // ── Region Mode ──
      const countries = Array.from(new Set(assets.map(a => a.country)));
      countries.forEach(country => {
        const countryAssets = assets.filter(a => a.country === country);
        const count = countryAssets.length;
        
        // Calculate average coordinates for the country marker
        const avgLng = countryAssets.reduce((sum, a) => sum + a.coordinates[0], 0) / count;
        const avgLat = countryAssets.reduce((sum, a) => sum + a.coordinates[1], 0) / count;
        
        // Get highest severity for color
        const statuses = ['CRITICAL', 'ELEVATED', 'MODERATE', 'SAFE'];
        let color = STATUS_CONFIG.SAFE.color;
        for (const s of statuses) {
          if (countryAssets.some(a => a.status === s)) {
            color = STATUS_CONFIG[s].color;
            break;
          }
        }

        const el = document.createElement('div');
        el.style.cssText = 'width:0; height:0; display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer;';
        
        const size = Math.min(40 + count * 8, 80);
        el.innerHTML = `
          <div style="
            width:${size}px; height:${size}px; border-radius:50%;
            background:${color}15; border:1px solid ${color}44;
            display:flex; flex-direction:column; align-items:center; justify-content:center;
            position:absolute; backdrop-filter:blur(4px);
            box-shadow: 0 0 30px ${color}15, inset 0 0 20px ${color}10;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          " class="region-marker">
            <div style="font-size:9px; font-weight:800; color:${color}; margin-bottom:2px; letter-spacing:0.05em;">${country.toUpperCase()}</div>
            <div style="font-size:16px; font-weight:800; color:#fff;">${count}</div>
            <div style="font-size:7px; font-weight:700; color:#475569; margin-top:2px;">ASSETS</div>
          </div>`;

        el.addEventListener('mouseenter', () => {
          el.querySelector('.region-marker').style.transform = 'scale(1.1)';
          el.querySelector('.region-marker').style.background = `${color}25`;
          el.querySelector('.region-marker').style.boxShadow = `0 0 50px ${color}30, inset 0 0 30px ${color}20`;
        });
        el.addEventListener('mouseleave', () => {
          el.querySelector('.region-marker').style.transform = 'scale(1)';
          el.querySelector('.region-marker').style.background = `${color}15`;
          el.querySelector('.region-marker').style.boxShadow = `0 0 30px ${color}15, inset 0 0 20px ${color}10`;
        });
        el.addEventListener('click', () => {
          map.flyTo({ center: [avgLng, avgLat], zoom: 6, duration: 1500 });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([avgLng, avgLat])
          .addTo(map);
        markersRef.current.push(marker);
      });
      return;
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

    map.on('click', () => {
      setPinnedAssetId(null);
    });

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
