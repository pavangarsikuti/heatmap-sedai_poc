import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import ControlBar from './components/ControlBar';
import Footer from './components/Footer';
import { ASSETS_DATA } from './data/assets';

const DEFAULT_FILTERS = {
  riskType: 'All Risks',
  timeframe: '12 Months',
  fund: 'All',
  assetType: 'All',
  status: 'All',
  country: 'All',
  percentage: 'All',
};

const App = () => {
  const [activeTab, setActiveTab] = useState('RISK RADAR');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [focusAsset, setFocusAsset] = useState(null);

  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleThemeChange = (newTheme) => setTheme(newTheme);
  const handleAssetClick = (asset) => setFocusAsset({ ...asset, _t: Date.now() });

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters(DEFAULT_FILTERS);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const filteredAssets = useMemo(() => {
    let processAssets = ASSETS_DATA.map(asset => {
      if (filters.riskType !== 'All Risks' && asset.risks && asset.risks[filters.riskType]) {
        const riskData = asset.risks[filters.riskType];
        return {
          ...asset,
          score: riskData.score,
          trend: riskData.trend,
          trendDir: riskData.trendDir,
          status: riskData.status,
        };
      }
      return asset;
    });

    return processAssets.filter(asset => {
      if (filters.fund !== 'All' && asset.fund !== filters.fund) return false;
      if (filters.assetType !== 'All' && asset.assetType !== filters.assetType) return false;
      if (filters.status !== 'All' && asset.status !== filters.status) return false;
      if (filters.country !== 'All' && asset.country !== filters.country) return false;
      if (filters.percentage !== 'All') {
        const [min, max] = filters.percentage.split('-').map(Number);
        if (asset.score < min || (max === 100 ? asset.score > max : asset.score >= max)) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#070710' }}>
      {/* Ambient glow blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '10%', width: '45%', height: '50%', background: 'rgba(59,130,246,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '5%', width: '45%', height: '50%', background: 'rgba(255,159,67,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'RISK RADAR' ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div style={{ 
              width: isSidebarOpen ? 290 : 0, 
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              overflow: 'hidden',
              flexShrink: 0,
              borderRight: isSidebarOpen ? '1px solid rgba(255,255,255,0.07)' : 'none'
            }}>
              <SidebarLeft 
                assets={filteredAssets} 
                isOpen={isSidebarOpen} 
                onToggle={handleToggleSidebar} 
                onAssetClick={handleAssetClick}
              />
            </div>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <ControlBar filters={filters} onFilterChange={handleFilterChange} />
              <MapView 
                filteredAssets={filteredAssets} 
                isSidebarOpen={isSidebarOpen} 
                onToggleSidebar={handleToggleSidebar}
                theme={theme}
                onThemeChange={handleThemeChange}
                focusAsset={focusAsset}
              />
              <Footer assets={filteredAssets} />
            </main>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 48, opacity: 0.08 }}>🛰</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{activeTab}</div>
            <div style={{ fontSize: 12, color: '#334155' }}>This view is coming soon</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
