// ── Analysis Data Generators ──────────────────────────────────────────────────
// All data is dummy/randomized for POC. Architecture supports plugging in real sources later.

const STORAGE_PREFIX = 'sedai_analysis_';
const REFRESH_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// ── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getStatus = (score) => {
  if (score >= 65) return 'CRITICAL';
  if (score >= 50) return 'ELEVATED';
  if (score >= 35) return 'MODERATE';
  return 'SAFE';
};

// ── Geographic Level Labels (L1-L10) ──────────────────────────────────────────
export const GEO_LEVEL_LABELS = {
  1:  { tag: 'L1',  name: 'Country',             desc: 'Strategic Allocation' },
  2:  { tag: 'L2',  name: 'State',               desc: 'Regional Macro-Analysis' },
  3:  { tag: 'L3',  name: 'Admin Region',        desc: 'Administrative Oversight' },
  4:  { tag: 'L4',  name: 'District',            desc: 'Sub-Regional Yield Drivers' },
  5:  { tag: 'L5',  name: 'Municipality',        desc: 'Urban Market Dynamics' },
  6:  { tag: 'L6',  name: 'Borough',             desc: 'Subdivision Specificity' },
  7:  { tag: 'L7',  name: 'Locality',            desc: 'Neighborhood Risk Profile' },
  8:  { tag: 'L8',  name: 'Street',              desc: 'Micro-Location Precision' },
  9:  { tag: 'L9',  name: 'House Number',        desc: 'Asset-Specific Surroundings' },
  10: { tag: 'L10', name: 'Postal Code',         desc: 'Granular Demographic Filter' },
};

// ── News Headlines Pool ──────────────────────────────────────────────────────
const NEWS_HEADLINES = [
  { headline: 'Central bank signals rate pause amid cooling inflation data', source: 'Financial Times', category: 'Financial' },
  { headline: 'Prime office rents surge 8% in CBD driven by tech sector demand', source: 'CBRE Research', category: 'Market' },
  { headline: 'New transit line approval expected to boost adjacent property values', source: 'Bloomberg', category: 'Infrastructure' },
  { headline: 'Government announces stricter energy efficiency standards for commercial buildings', source: 'Reuters', category: 'Regulatory' },
  { headline: 'Major logistics tenant signs 15-year pre-lease in emerging corridor', source: 'JLL Insights', category: 'Market' },
  { headline: 'Climate risk scoring now mandatory for institutional real estate portfolios', source: 'The Economist', category: 'Climate' },
  { headline: 'Vacancy rates in secondary markets drop to historic lows', source: 'Savills', category: 'Market' },
  { headline: 'Foreign direct investment in commercial real estate hits 5-year high', source: 'Cushman & Wakefield', category: 'Financial' },
  { headline: 'Residential conversion wave reshaping downtown office districts', source: 'Urban Land Institute', category: 'Market' },
  { headline: 'Supply chain resilience drives demand for last-mile distribution centers', source: 'Prologis Research', category: 'Market' },
  { headline: 'PropTech adoption accelerates with AI-driven tenant screening platforms', source: 'TechCrunch', category: 'Technology' },
  { headline: 'Green building certifications command 12% rental premium in core locations', source: 'MSCI Real Estate', category: 'ESG' },
  { headline: 'Population growth forecasts signal long-term housing demand in suburban markets', source: 'Eurostat', category: 'Demographic' },
  { headline: 'Rising construction costs squeeze developer margins on new projects', source: 'Construction Week', category: 'Market' },
  { headline: 'Cross-border capital flows rotate toward value-add opportunities', source: 'PGIM Real Estate', category: 'Financial' },
  { headline: 'Flood risk mapping updated — several commercial zones reclassified', source: 'EU Climate Agency', category: 'Climate' },
  { headline: 'Coworking sector consolidation continues with major merger announcement', source: 'CoStar', category: 'Market' },
  { headline: 'Retail leasing activity rebounds as consumer confidence improves', source: 'Colliers', category: 'Market' },
  { headline: 'Infrastructure spending bill set to transform regional connectivity', source: 'Der Spiegel', category: 'Infrastructure' },
  { headline: 'Tenant default rates declining across European office markets', source: 'AEW Research', category: 'Tenant' },
  { headline: 'Mixed-use developments lead investment pipeline for 2026', source: 'Knight Frank', category: 'Market' },
  { headline: 'Smart building technology adoption linked to higher tenant retention', source: 'Deloitte', category: 'Technology' },
  { headline: 'Political stability index improves following coalition agreement', source: 'The Guardian', category: 'Political' },
  { headline: 'Suburban office parks see renewed interest from enterprise tenants', source: 'Newmark', category: 'Market' },
];

const SENTIMENT_OPTIONS = ['positive', 'negative', 'neutral'];
const CATEGORY_COLORS = {
  Financial: '#3b82f6',
  Market: '#ff9f43',
  Infrastructure: '#2ecc71',
  Regulatory: '#8b5cf6',
  Climate: '#06b6d4',
  Technology: '#ec4899',
  ESG: '#10b981',
  Demographic: '#f59e0b',
  Tenant: '#6366f1',
  Political: '#ef4444',
};

// ── Main Analysis Generator ──────────────────────────────────────────────────
export const generateAnalysisForLevel = (levelName, levelDepth) => {
  const riskScore = rand(15, 85);
  const status = getStatus(riskScore);
  const trendDir = Math.random() > 0.5 ? 'up' : 'down';
  const trendVal = rand(0.5, 8);

  return {
    meta: {
      levelName,
      levelDepth,
      levelLabel: GEO_LEVEL_LABELS[levelDepth] || GEO_LEVEL_LABELS[1],
      generatedAt: Date.now(),
    },
    riskOverview: {
      score: riskScore,
      status,
      trend: `${trendDir === 'up' ? '+' : '-'}${trendVal}%`,
      trendDir,
      confidence: pick(['High', 'Medium', 'Low']),
      previousScore: rand(riskScore - 10, riskScore + 10),
    },
    rentalInsights: {
      avgRentPerSqm: rand(12, 65),
      currency: '€',
      historicalTrend: Array.from({ length: 12 }, () => rand(10, 70)),
      volatility: rand(2, 18),
      yoyGrowth: rand(-3, 12),
      primeRent: rand(40, 120),
      secondaryRent: rand(8, 35),
    },
    tenantIndicators: {
      stabilityPct: rand(60, 98),
      vacancyTrend: pick(['Decreasing', 'Stable', 'Increasing']),
      vacancyRate: rand(2, 20),
      turnoverRate: rand(5, 25),
      avgLeaseTerm: rand(2, 12),
      netAbsorption: rand(-5, 15),
    },
    commercialInsights: {
      demandSupplyRatio: rand(0.6, 1.8),
      occupancyPct: rand(70, 98),
      businessActivityIndex: rand(40, 95),
      investmentVolume: `€${randInt(50, 800)}M`,
      capRate: rand(3, 8),
      pricePerSqm: rand(1500, 12000),
    },
    keyDrivers: [
      { label: 'Market Risk', score: rand(10, 90), color: '#ff9f43', weight: rand(0.1, 0.3) },
      { label: 'Political Risk', score: rand(5, 70), color: '#8b5cf6', weight: rand(0.05, 0.2) },
      { label: 'Climate Risk', score: rand(10, 80), color: '#06b6d4', weight: rand(0.05, 0.2) },
      { label: 'Financial Risk', score: rand(15, 85), color: '#3b82f6', weight: rand(0.1, 0.25) },
      { label: 'Social Risk', score: rand(5, 60), color: '#2ecc71', weight: rand(0.05, 0.15) },
      { label: 'Regulatory Risk', score: rand(10, 70), color: '#ef4444', weight: rand(0.05, 0.15) },
    ],
    radarData: [
      { subject: 'Market', A: randInt(30, 95) },
      { subject: 'Political', A: randInt(20, 90) },
      { subject: 'Climate', A: randInt(25, 85) },
      { subject: 'Financial', A: randInt(30, 95) },
      { subject: 'Social', A: randInt(20, 80) },
      { subject: 'Regulatory', A: randInt(15, 85) },
    ],
  };
};

// ── News Generator ───────────────────────────────────────────────────────────
export const generateNewsArticles = (levelName) => {
  const count = randInt(5, 8);
  const shuffled = [...NEWS_HEADLINES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((n, i) => ({
    id: `news_${Date.now()}_${i}`,
    headline: n.headline.replace(/some|the/i, levelName ? levelName : 'the'),
    source: n.source,
    category: n.category,
    categoryColor: CATEGORY_COLORS[n.category] || '#94a3b8',
    sentiment: pick(SENTIMENT_OPTIONS),
    relevanceScore: rand(60, 99),
    date: new Date(Date.now() - randInt(1, 72) * 3600000).toISOString(),
    snippet: `Analysis of ${levelName || 'regional'} market conditions based on latest ${n.category.toLowerCase()} data signals...`,
  }));
};

// ── Forecast Generator ───────────────────────────────────────────────────────
export const generateForecast = (levelName, months = 3) => {
  const base = rand(20, 75);
  const generateProjection = (m) => {
    const drift = rand(-5, 8) * (m / 3);
    return {
      months: m,
      label: `${m}M`,
      projectedRiskScore: Math.max(5, Math.min(95, Math.round((base + drift) * 10) / 10)),
      rentalGrowth: rand(-2, 8),
      vacancyForecast: rand(3, 18),
      investmentOutlook: pick(['Bullish', 'Neutral', 'Bearish']),
      confidenceInterval: { low: rand(base - 15, base - 5), high: rand(base + 5, base + 15) },
      keyAssumptions: [
        `${pick(['Stable', 'Rising', 'Declining'])} interest rate environment`,
        `${pick(['Strong', 'Moderate', 'Weak'])} tenant demand expected`,
        `${pick(['No major', 'Potential', 'Expected'])} regulatory changes`,
      ],
    };
  };

  return {
    levelName,
    generatedAt: Date.now(),
    periods: [generateProjection(3), generateProjection(6), generateProjection(12)],
  };
};

// ── Insights Summary Generator ───────────────────────────────────────────────
export const generateInsightsSummary = (levelName, levelDepth) => {
  const templates = [
    `${levelName} demonstrates ${pick(['strong', 'moderate', 'mixed'])} market fundamentals with ${pick(['improving', 'stable', 'deteriorating'])} demand-supply dynamics. The ${GEO_LEVEL_LABELS[levelDepth]?.name || 'area'}-level analysis reveals ${pick(['significant', 'moderate', 'limited'])} investment opportunities driven by ${pick(['infrastructure development', 'demographic shifts', 'policy changes', 'tech sector growth'])}.`,
    `Current market conditions in ${levelName} indicate ${pick(['resilient', 'vulnerable', 'transitional'])} fundamentals. Key drivers include ${pick(['rental yield compression', 'occupancy stabilization', 'capital value appreciation', 'tenant diversification'])}. The ${pick(['3-month', '6-month', '12-month'])} outlook suggests ${pick(['upside potential', 'downside risks', 'range-bound performance'])}.`,
    `The ${levelName} market is characterized by ${pick(['robust', 'moderate', 'softening'])} tenant demand and ${pick(['limited', 'adequate', 'excess'])} supply pipeline. ${pick(['Institutional', 'Cross-border', 'Domestic'])} investors remain ${pick(['active', 'cautious', 'selective'])} in the region, with a focus on ${pick(['core assets', 'value-add opportunities', 'development sites'])}.`,
  ];
  return pick(templates);
};

// ── Local Storage Persistence ────────────────────────────────────────────────
export const saveAnalysisToStorage = (key, data) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to save analysis to storage:', e);
  }
};

export const loadAnalysisFromStorage = (key) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn('Failed to load analysis from storage:', e);
    return null;
  }
};

export const isDataStale = (timestamp) => {
  if (!timestamp) return true;
  return Date.now() - timestamp > REFRESH_INTERVAL_MS;
};

export const clearAllAnalysisData = () => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
};
