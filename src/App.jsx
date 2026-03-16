import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import ControlBar from './components/ControlBar';
import Footer from './components/Footer';
import { ASSETS_DATA } from './data/assets';

const DEFAULT_FILTERS = {
  mode: 'Overall Risk',
  timeframe: '12 Months',
  fund: 'All',
  assetType: 'All',
  status: 'All',
  country: 'All',
};

const App = () => {
  const [activeTab, setActiveTab] = useState('RISK RADAR');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters(DEFAULT_FILTERS);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const filteredAssets = useMemo(() => {
    return ASSETS_DATA.filter(asset => {
      if (filters.fund !== 'All' && asset.fund !== filters.fund) return false;
      if (filters.assetType !== 'All' && asset.assetType !== filters.assetType) return false;
      if (filters.status !== 'All' && asset.status !== filters.status) return false;
      if (filters.country !== 'All' && asset.country !== filters.country) return false;
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
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <SidebarLeft assets={filteredAssets} />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <ControlBar filters={filters} onFilterChange={handleFilterChange} />
              <MapView filteredAssets={filteredAssets} />
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
