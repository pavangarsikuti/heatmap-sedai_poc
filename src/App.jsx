import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import ControlBar from './components/ControlBar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import ChangelogModal from './components/ChangelogModal';
import { ASSETS_DATA, REGIONAL_DATA, DATA_VERSION, PORTFOLIO_VERSION } from './data/assets';

const DEFAULT_FILTERS = {
  riskType: 'All Risks',
  timeframe: '12 Months',
  fund: 'All',
  assetType: 'All',
  status: 'All',
  country: 'All',
  percentage: 'All',
  viewMode: 'Assets',
};

const App = () => {
  const [activeTab, setActiveTab] = useState('RISK RADAR');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [focusAsset, setFocusAsset] = useState(null);
  const [geoPath, setGeoPath] = useState(['Europe']);
  const [portfolioVersion, setPortfolioVersion] = useState(PORTFOLIO_VERSION);
  const [dataVersion] = useState(DATA_VERSION);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const handleToggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const handleThemeChange = (newTheme) => setTheme(newTheme);
  const handleAssetClick = (asset) => setFocusAsset({ ...asset, _t: Date.now() });

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters(DEFAULT_FILTERS);
      setGeoPath(['Europe']);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleDrillDown = (name, level) => {
    setGeoPath(prev => [...prev, name]);
  };

  const handleStepUp = (index) => {
    setGeoPath(prev => prev.slice(0, index + 1));
  };

  const handlePortfolioUpdate = () => {
    if (window.confirm("Mark recommended action as verified and bump portfolio version?")) {
      setPortfolioVersion(prev => {
        const [major, minor] = prev.replace('v', '').split('.').map(Number);
        return `v${major}.${minor + 1}`;
      });
    }
  };

  const filteredAssets = useMemo(() => {
    let processAssets = ASSETS_DATA.map(asset => {
      let finalAsset = { ...asset };
      
      // Simulate timeframe impact
      const tfMultiplier = filters.timeframe === '3 Months' ? 0.8 : filters.timeframe === '6 Months' ? 0.9 : 1.0;
      finalAsset.score = Math.round(finalAsset.score * tfMultiplier * 10) / 10;

      if (filters.riskType !== 'All Risks' && asset.risks && asset.risks[filters.riskType]) {
        const riskData = asset.risks[filters.riskType];
        finalAsset = {
          ...finalAsset,
          score: Math.round(riskData.score * tfMultiplier * 10) / 10,
          trend: riskData.trend,
          trendDir: riskData.trendDir,
          status: riskData.status,
        };
      }
      return finalAsset;
    });

    return processAssets.filter(asset => {
      // Geographic filtering based on geoPath
      if (geoPath.length > 1) {
        const [,, country, region, city, district] = geoPath; // Europe is index 0
        if (geoPath.includes('Germany') && asset.country !== 'Germany') return false;
        if (geoPath.includes('Switzerland') && asset.country !== 'Switzerland') return false;
        if (geoPath.includes('Poland') && asset.country !== 'Poland') return false;
        
        // Finer grain filtering if we have city/district info
        if (city && asset.city !== city) return false;
      }

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
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                <MapView 
                  filteredAssets={filteredAssets} 
                  viewMode={filters.viewMode}
                  isSidebarOpen={isSidebarOpen} 
                  isRightSidebarOpen={isRightSidebarOpen}
                  onToggleSidebar={handleToggleSidebar}
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  focusAsset={focusAsset}
                  geoPath={geoPath}
                  onDrillDown={handleDrillDown}
                  onStepUp={handleStepUp}
                />
                <RightSidebar 
                  isOpen={isRightSidebarOpen}
                  onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  assets={filteredAssets}
                  filters={filters}
                  portfolioVersion={portfolioVersion}
                  dataVersion={dataVersion}
                  onUpdatePortfolio={handlePortfolioUpdate}
                  onShowChangelog={() => setShowChangelog(true)}
                />
              </div>
              <Footer 
                assets={filteredAssets} 
                filters={filters} 
              />
              <ChangelogModal 
                isOpen={showChangelog} 
                onClose={() => setShowChangelog(false)} 
              />
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
