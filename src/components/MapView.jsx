import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { STATUS_CONFIG } from '../data/assets';
import { X, TrendingUp, TrendingDown, ChevronRight, Layers, Compass } from 'lucide-react';

// ── Tooltip ────────────────────────────────────────────────────────────────────
const MapTooltip = ({ asset, pos, riskKey, onClose }) => {
  if (!asset) return null;
  const riskData = asset.risks[riskKey];
  const cfg = STATUS_CONFIG[riskData.status];
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
          <span style={{ fontSize: 28, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{riskData.score}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor, fontSize: 10, fontWeight: 700 }}>
            <TrendIcon size={11} />{asset.trend}
          </div>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>{asset.units}</span>
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 4 }}>
            {riskData.status}
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



// ── Main MapView ───────────────────────────────────────────────────────────────
const MapView = ({
  filteredAssets,
  selectedRiskType = 'All Risks',
  hoveredAssetId, setHoveredAssetId,
  selectedAssetId, setSelectedAssetId
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [tooltip, setTooltip] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(2);
  const [selectedAssetPos, setSelectedAssetPos] = useState({ x: 0, y: 0 });

  const riskKey = selectedRiskType === 'All Risks' ? 'overall' : selectedRiskType.toLowerCase();

  // Europe-only filter (keeping global data in higher components as requested)
  const europeAssets = useMemo(() => {
    return filteredAssets.filter(a =>
      a.coordinates[0] >= -30 && a.coordinates[0] <= 50 &&
      a.coordinates[1] >= 30 && a.coordinates[1] <= 75
    );
  }, [filteredAssets]);

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

  // Render markers directly
  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (europeAssets.length === 0) return;

    const zoom = Math.floor(map.getZoom());
    setCurrentZoom(zoom);

    europeAssets.forEach(asset => {
      let [lng, lat] = asset.coordinates;
      const el = document.createElement('div');
      el.style.cssText = 'position:relative; cursor:pointer;';

      const riskData = asset.risks[riskKey];
      const cfg = STATUS_CONFIG[riskData.status];

      const isSelected = selectedAssetId === asset.id;
      const isHovered = hoveredAssetId === asset.id;
      const isActive = isSelected || isHovered;
      const isDimmed = (selectedAssetId || hoveredAssetId) && !isActive;
      const opacity = isDimmed ? 0.3 : 1;
      const ringOpacity = isDimmed ? 0.03 : 0.12;
      const sizeScale = isActive ? 1.5 : 1;
      const boxShadow = isActive
        ? `0 0 12px ${cfg.color}, 0 0 28px ${cfg.color}80`
        : `0 0 6px ${cfg.color}, 0 0 16px ${cfg.color}60`;

      el.style.opacity = opacity;
      el.style.transition = 'opacity 0.2s';
      el.style.zIndex = isActive ? 100 : 1;

      el.innerHTML = `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div class="pulse-ring" style="
            position:absolute; width:22px; height:22px; border-radius:3px;
            background:${cfg.color}; opacity:${ringOpacity};
            animation: pulseRing ${1.8 + asset.id * 0.15}s ease-in-out infinite;
          "></div>
          <div style="
            width:12px; height:12px; border-radius:2.5px;
            background:${cfg.color}; opacity:0.9;
            box-shadow:${boxShadow};
            transform:scale(${sizeScale});
            transition:transform .15s, box-shadow .15s;
            position:relative; z-index:1;
          " class="core"></div>
        </div>`;

      el.addEventListener('mouseenter', () => {
        setHoveredAssetId(asset.id);
        setTooltip(asset);
      });
      el.addEventListener('mouseleave', () => {
        setHoveredAssetId(null);
        setTooltip(null);
      });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedAssetId(isSelected ? null : asset.id);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [hoveredAssetId, selectedAssetId, riskKey, setHoveredAssetId, setSelectedAssetId, europeAssets]);

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
      center: [15, 50], // Focused on Europe
      zoom: 3.8,        // Zoomed in to fit Europe
      minZoom: 3,
      maxZoom: 18,
      maxBounds: [[-30, 30], [50, 75]], // Restrict movement to Europe area
      scrollZoom: true,
      pitchWithRotate: true,
      attributionControl: false,
      renderWorldCopies: false, // Prevents markers from jumping to other world copies at low zoom
    });

    mapRef.current = map;

    map.on('load', () => {
      renderMarkers();
    });

    // Re-render on move/zoom (clustering updates)
    map.on('moveend', renderMarkers);
    map.on('zoomend', renderMarkers);

    // Clear hovers when map is actively moving to prevent stuck floating tooltips
    const clearHovers = () => {
      setTooltip(null);
    };
    map.on('zoomstart', clearHovers);
    map.on('dragstart', clearHovers);
    map.on('pitchstart', clearHovers);

    // Add attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Dynamic position updates during map move to keep tooltips exactly on pins
  const updatePositions = useCallback(() => {
    if (!mapRef.current || !mapContainer.current) return;
    const map = mapRef.current;
    const rect = mapContainer.current.getBoundingClientRect();

    if (selectedAssetId) {
      const a = europeAssets.find(x => x.id === selectedAssetId);
      if (a) {
        const p = map.project(a.coordinates);
        setSelectedAssetPos({ x: p.x + rect.left, y: p.y + rect.top });
      }
    }
    if (tooltip) {
      const p = map.project(tooltip.coordinates);
      setHoverPos({ x: p.x + rect.left, y: p.y + rect.top });
    }
  }, [selectedAssetId, tooltip, europeAssets]);

  useEffect(() => {
    updatePositions();
    const map = mapRef.current;
    if (map) {
      map.on('move', updatePositions);
      return () => map.off('move', updatePositions);
    }
  }, [updatePositions]);

  // Re-render markers when data changes or selections change
  useEffect(() => {
    if (mapRef.current?.loaded()) {
      renderMarkers();
    }
  }, [europeAssets, renderMarkers]);

  const activeSelectedAsset = europeAssets.find(a => a.id === selectedAssetId);

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
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelectedAssetId(null)}
      />

      {/* Tooltips */}
      {activeSelectedAsset ? (
        <MapTooltip asset={activeSelectedAsset} pos={selectedAssetPos} riskKey={riskKey} onClose={() => setSelectedAssetId(null)} />
      ) : (
        <MapTooltip asset={tooltip} pos={hoverPos} riskKey={riskKey} onClose={() => setTooltip(null)} />
      )}

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
        {europeAssets.length} assets visible
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
