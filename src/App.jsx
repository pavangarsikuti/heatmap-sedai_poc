import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import MapView from './components/MapView';
import ControlBar from './components/ControlBar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import ChangelogModal from './components/ChangelogModal';
import AnalysisRadarScanner from './components/AnalysisRadarScanner';
import AnalysisDetailView from './components/AnalysisDetailView';
import GeoFilterCard from './components/GeoFilterCard';
import { ASSETS_DATA, REGIONAL_DATA, DATA_VERSION, PORTFOLIO_VERSION, GEO_LEVELS } from './data/assets';
import {
  generateAnalysisForLevel,
  generateNewsArticles,
  generateForecast,
  generateInsightsSummary,
  saveAnalysisToStorage,
  loadAnalysisFromStorage,
  isDataStale,
  GEO_LEVEL_LABELS,
} from './data/analysisData';

const DEFAULT_FILTERS = {
  riskType: 'All Risks',
  timeframe: '3 Months',
  fund: 'All',
  assetType: 'All',
  status: 'All',
  country: 'All',
  percentage: 'All',
  viewMode: 'Regions',
};

// Resolve the center/zoom for a geoPath using recursive traversal
const resolveGeoTarget = (geoPath) => {
  if (geoPath.length <= 1) return null;
  let current = REGIONAL_DATA;
  let targetNode = null;

  for (let i = 1; i < geoPath.length; i++) {
    const name = geoPath[i];
    if (current && current[name]) {
      targetNode = current[name];
      current = targetNode.children;
    } else {
      break;
    }
  }
  return targetNode;
};

// Build a storage key from geoPath
const buildStorageKey = (geoPath) => geoPath.slice(1).join('__').replace(/\s+/g, '_');

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

  // Analysis state
  const [analysisState, setAnalysisState] = useState({
    isScanning: false,
    results: null,
    news: null,
    forecast: null,
    summary: null,
    showDetail: false,
    levelName: '',
    levelDepth: 1,
  });

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

  // Cascading geographic selection handler
  const handleGeoSelect = (level, value) => {
    setGeoPath(prev => {
      const idx = GEO_LEVELS.indexOf(level) + 1; // +1 because geoPath[0] is 'Europe'
      if (idx < 1) return prev;

      if (!value) {
        // Clear this level and below
        return prev.slice(0, idx);
      }
      const next = [...prev.slice(0, idx), value];
      return next;
    });
  };

  const handleDrillDown = (name) => {
    setGeoPath(prev => {
      if (prev.includes(name)) return prev;
      return [...prev, name];
    });
  };

  const handleStepUp = (index) => {
    setGeoPath(prev => prev.slice(0, index + 1));
  };

  // Trigger analysis for current geoPath level
  const handleAnalyze = () => {
    const levelName = geoPath[geoPath.length - 1];
    const levelDepth = geoPath.length - 1; // L10 check
    const storageKey = buildStorageKey(geoPath);

    // Check local storage first
    const cached = loadAnalysisFromStorage(storageKey);
    if (cached && !isDataStale(cached.timestamp)) {
      setAnalysisState({
        isScanning: false,
        results: cached.data.results,
        news: cached.data.news,
        forecast: cached.data.forecast,
        summary: cached.data.summary,
        showDetail: false,
        levelName,
        levelDepth,
      });
      return;
    }

    // Start radar scanner
    setAnalysisState(prev => ({
      ...prev,
      isScanning: true,
      showDetail: false,
      levelName,
      levelDepth,
    }));

    // Simulate scan delay then generate data
    setTimeout(() => {
      const results = generateAnalysisForLevel(levelName, levelDepth);
      const news = generateNewsArticles(levelName);
      const forecast = generateForecast(levelName);
      const summary = generateInsightsSummary(levelName, levelDepth);

      const data = { results, news, forecast, summary };
      saveAnalysisToStorage(storageKey, data);

      setAnalysisState({
        isScanning: false,
        results,
        news,
        forecast,
        summary,
        showDetail: false,
        levelName,
        levelDepth,
      });
    }, 4200);
  };

  const handlePortfolioUpdate = () => {
    if (window.confirm('Mark recommended action as verified and bump portfolio version?')) {
      setPortfolioVersion(prev => {
        const [major, minor] = prev.replace('v', '').split('.').map(Number);
        return `v${major}.${minor + 1}`;
      });
    }
  };

  const filteredAssets = useMemo(() => {
    let processAssets = ASSETS_DATA.map(asset => {
      let finalAsset = { ...asset };
      const tfMultiplier = filters.timeframe === '3 Months' ? 0.8 : filters.timeframe === '6 Months' ? 0.9 : 1.0;
      finalAsset.score = Math.round(finalAsset.score * tfMultiplier * 10) / 10;

      if (filters.riskType !== 'All Risks' && asset.risks && asset.risks[filters.riskType]) {
        const riskData = asset.risks[filters.riskType];
        finalAsset = { ...finalAsset, score: Math.round(riskData.score * tfMultiplier * 10) / 10, trend: riskData.trend, trendDir: riskData.trendDir, status: riskData.status };
      }
      return finalAsset;
    });

    return processAssets.filter(asset => {
      // Geographic filtering from geoPath
      const [, country, region, city, district] = geoPath;
      if (country && asset.country !== country) return false;
      if (city && asset.city !== city) return false;

      if (filters.fund !== 'All' && asset.fund !== filters.fund) return false;
      if (filters.assetType !== 'All' && asset.assetType !== filters.assetType) return false;
      if (filters.status !== 'All' && asset.status !== filters.status) return false;
      if (filters.percentage !== 'All') {
        const [min, max] = filters.percentage.split('-').map(Number);
        if (asset.score < min || (max === 100 ? asset.score > max : asset.score >= max)) return false;
      }
      return true;
    });
  }, [filters, geoPath]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#070710' }}>
      {/* Ambient glow blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '10%', width: '45%', height: '50%', background: 'rgba(59,130,246,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '5%', width: '45%', height: '50%', background: 'rgba(255,159,67,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '40%', width: '30%', height: '40%', background: 'rgba(99,102,241,0.03)', borderRadius: '50%', filter: 'blur(100px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'RISK RADAR' ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: isSidebarOpen ? 290 : 0,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden', flexShrink: 0,
              borderRight: isSidebarOpen ? '1px solid rgba(255,255,255,0.07)' : 'none'
            }}>
              <SidebarLeft assets={filteredAssets} isOpen={isSidebarOpen} onToggle={handleToggleSidebar} onAssetClick={handleAssetClick} />
            </div>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <ControlBar
                filters={filters}
                onFilterChange={handleFilterChange}
                geoPath={geoPath}
                onGeoSelect={handleGeoSelect}
                onAnalyze={handleAnalyze}
              />
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
                  onAnalyze={handleAnalyze}
                />

                {/* ── Floating Geo Filter Card ── */}
                {filters.viewMode === 'Regions' && geoPath.length > 0 && (
                  <GeoFilterCard 
                    geoPath={geoPath} 
                    onGeoSelect={handleGeoSelect} 
                    onAnalyze={handleAnalyze}
                    isSidebarOpen={isSidebarOpen}
                  />
                )}

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
              <Footer assets={filteredAssets} filters={filters} />
              <ChangelogModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
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

      {/* ── Analysis Radar Scanner Overlay ── */}
      {analysisState.isScanning && (
        <AnalysisRadarScanner
          levelName={analysisState.levelName}
          levelDepth={analysisState.levelDepth}
          levelLabel={GEO_LEVEL_LABELS[analysisState.levelDepth] || GEO_LEVEL_LABELS[1]}
          onCancel={() => setAnalysisState(prev => ({ ...prev, isScanning: false }))}
        />
      )}

      {/* ── Analysis Results Panel ── */}
      {!analysisState.isScanning && analysisState.results && !analysisState.showDetail && (
        <AnalysisDetailView
          results={analysisState.results}
          news={analysisState.news}
          forecast={analysisState.forecast}
          summary={analysisState.summary}
          levelName={analysisState.levelName}
          levelDepth={analysisState.levelDepth}
          levelLabel={GEO_LEVEL_LABELS[analysisState.levelDepth] || GEO_LEVEL_LABELS[1]}
          onClose={() => setAnalysisState(prev => ({ ...prev, results: null }))}
          onAnalyzeAgain={handleAnalyze}
        />
      )}
    </div>
  );
};

export default App;
