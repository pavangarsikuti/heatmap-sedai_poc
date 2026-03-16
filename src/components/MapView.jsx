import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';
import { STATUS_CONFIG } from '../data/assets';
import { X, TrendingUp, TrendingDown, ChevronRight, Layers, Compass } from 'lucide-react';

// ── Tooltip ────────────────────────────────────────────────────────────────────
const MapTooltip = ({ asset, pos, onClose }) => {
  if (!asset) return null;
  const cfg = STATUS_CONFIG[asset.status];
  const TrendIcon = asset.trendDir === 'up' ? TrendingUp : TrendingDown;
  const trendColor = asset.trendDir === 'up' ? '#ff9f43' : '#2ecc71';

  return (
    <div style={{
      position: 'fixed',
      left: Math.min(pos.x + 20, window.innerWidth - 314),
      top: Math.max(pos.y - 170, 8),
      zIndex: 9999,
      width: 294,
      background: 'rgba(7,8,17,0.97)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${cfg.color}35`,
      borderTop: `3px solid ${cfg.color}`,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: `0 32px 72px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), 0 0 50px ${cfg.color}12`,
      animation: 'fadeIn .15s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ padding: '13px 15px 10px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', marginBottom: 3 }}>{asset.city}, {asset.country}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{asset.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{asset.score}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor, fontSize: 10, fontWeight: 700 }}>
            <TrendIcon size={11} />{asset.trend}
          </div>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>{asset.units}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 4 }}>
            {asset.status}
          </span>
        </div>
      </div>

      <div style={{ padding: '11px 15px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 9 }}>Key Drivers</div>
        {asset.drivers.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#94a3b8' }}>
                {d.label}{d.desc && <span style={{ color: '#475569' }}> ({d.desc})</span>}
              </span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{d.value}%</span>
          </div>
        ))}
        <div style={{ marginTop: 8 }}>
          {asset.drivers.map((d, i) => (
            <div key={i} style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 999, marginBottom: 4, overflow: 'hidden' }}>
              <div style={{ width: `${d.value}%`, height: '100%', background: d.color, borderRadius: 999 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '9px 15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: '#334155' }}>
          Confidence – <span style={{ color: '#64748b' }}>{asset.confidence}</span>
          &nbsp;·&nbsp;Fund: <span style={{ color: '#64748b' }}>{asset.fund}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#3b82f6', fontSize: 9, fontWeight: 700 }}>
          Stats <ChevronRight size={9} />
        </span>
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
const MapView = ({ filteredAssets }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [tooltip, setTooltip] = useState(null);
  const [clusterTooltip, setClusterTooltip] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(2);

  // Night-vision dark map style
  const MAP_STYLE = {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '© CARTO © OpenStreetMap',
        maxzoom: 19,
      },
    },
    layers: [{ id: 'carto-dark-layer', type: 'raster', source: 'carto-dark' }],
  };

  // Get the highest-severity color of all assets in a cluster
  const getClusterColor = useCallback((ids) => {
    const clusterAssets = filteredAssets.filter(a => ids.includes(a.id));
    const statuses = ['CRITICAL', 'ELEVATED', 'MODERATE', 'SAFE'];
    for (const s of statuses) {
      if (clusterAssets.some(a => a.status === s)) return STATUS_CONFIG[s].color;
    }
    return '#fff';
  }, [filteredAssets]);

  // Render markers using Supercluster
  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (filteredAssets.length === 0) return;

    const zoom = Math.floor(map.getZoom());
    setCurrentZoom(zoom);

    // Build supercluster
    const sc = new Supercluster({ radius: 60, maxZoom: 14 });
    const points = filteredAssets.map(a => ({
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
      el.style.cssText = 'position:relative; cursor:pointer;';

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
            position:relative;
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
          map.flyTo({ center: [lng, lat], zoom: zoom + 2, duration: 700 });
        });

      } else {
        // ── Single asset marker ──
        const asset = filteredAssets.find(a => a.id === cluster.properties.id);
        if (!asset) return;
        const cfg = STATUS_CONFIG[asset.status];

        el.innerHTML = `
          <div style="position:relative; display:flex; align-items:center; justify-content:center;">
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
          setTooltip(asset);
          setHoverPos({ x: e.clientX, y: e.clientY });
          setClusterTooltip(null);
        });
        el.addEventListener('mouseleave', () => {
          el.querySelector('.core').style.transform = 'scale(1)';
          el.querySelector('.core').style.boxShadow = `0 0 6px ${cfg.color}, 0 0 16px ${cfg.color}60`;
          setTooltip(null);
        });
        el.addEventListener('mousemove', (e) => {
          setHoverPos({ x: e.clientX, y: e.clientY });
        });
      }

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [filteredAssets, getClusterColor]);

  // Toggle 3D pitch
  const toggle3D = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else {
      map.easeTo({ pitch: 55, bearing: -20, duration: 800 });
    }
    setIs3D(v => !v);
  }, [is3D]);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [15, 40],
      zoom: 2,
      minZoom: 1,
      maxZoom: 18,
      scrollZoom: true, // ← native scroll zoom enabled
      pitchWithRotate: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      renderMarkers();
    });

    // Re-render on move/zoom (clustering updates)
    map.on('moveend', renderMarkers);
    map.on('zoomend', renderMarkers);

    // Add attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

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
      <MapTooltip asset={tooltip} pos={hoverPos} onClose={() => setTooltip(null)} />
      <ClusterTooltip cluster={clusterTooltip} pos={hoverPos} assets={filteredAssets} />

      {/* Top-right controls */}
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* 3D Toggle */}
        <button
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
        </button>

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
        position: 'absolute', top: 14, left: 14, zIndex: 10,
        fontSize: 10, fontWeight: 700, color: '#475569',
        background: 'rgba(8,9,18,0.8)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6, padding: '4px 10px', backdropFilter: 'blur(10px)',
      }}>
        {filteredAssets.length} assets visible
      </div>

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
