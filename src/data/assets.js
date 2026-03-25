const generateRisks = (baseScore, baseStatus, baseTrend, baseTrendDir) => ({
  Market: { score: baseScore, trend: baseTrend, trendDir: baseTrendDir, status: baseStatus },
  Political: { score: Math.round((Math.random() * 40 + 20) * 10) / 10, trend: '0%', trendDir: 'up', status: 'SAFE' },
  Climate: { score: Math.round((Math.random() * 50 + 30) * 10) / 10, trend: '+2%', trendDir: 'up', status: 'MODERATE' },
  Financial: { score: Math.round((Math.random() * 40 + 40) * 10) / 10, trend: '+3%', trendDir: 'up', status: 'ELEVATED' },
  Social: { score: Math.round((Math.random() * 30 + 10) * 10) / 10, trend: '-1%', trendDir: 'down', status: 'SAFE' },
  Other: { score: Math.round((Math.random() * 20 + 20) * 10) / 10, trend: '0%', trendDir: 'down', status: 'SAFE' }
});

const generateStatus = (score) => {
  if (score >= 65) return 'CRITICAL';
  if (score >= 50) return 'ELEVATED';
  if (score >= 35) return 'MODERATE';
  return 'SAFE';
};

const adjustRisks = (risks) => {
  ['Political', 'Climate', 'Financial', 'Social', 'Other'].forEach(r => {
    risks[r].status = generateStatus(risks[r].score);
    const tg = Math.floor(Math.random() * 5) + 1;
    risks[r].trendDir = Math.random() > 0.5 ? 'up' : 'down';
    risks[r].trend = risks[r].trendDir === 'up' ? `+${tg}%` : `-${tg}%`;
  });
  return risks;
};

// Specific premium architectural photo IDs from Unsplash
const IMG_IDS = [
  '1486406146926-c627a92ad1ab', // Modern office
  '1464938050520-ef2270bb8ce8', // Glass skyscraper
  '1554995207-c18c20360b59', // Industrial complex
  '1497366216548-37526070297c', // Modern interior/office
  '1449156003143-bc0868f0294e', // Retail/Street
  '1577494165997-897d9e4e6d45', // Mixed use
  '1504307651254-3b5b19ef99fc', // Tech center
  '1582035210969-9051897c8808', // Luxury building
  '1479839672679-a46483c0e7c8', // Waterfront
  '1497215728101-856f4ea42174', // Workspace
  '1531834316654-e74c87895e6f', // Modern building
  '1486406146926-c627a92ad1ab'  // Repeat first
];

const getBuildingImg = (id) => `https://images.unsplash.com/photo-${IMG_IDS[(id - 1) % IMG_IDS.length]}?auto=format&fit=crop&q=80&w=600&h=400`;

const getGoogleMapsUrl = (coords) => `https://www.google.com/maps/@${coords[1]},${coords[0]},17z`;

export const ASSETS_DATA = [
  {
    id: 1, name: 'Zurich Industrial Complex', city: 'Zurich', country: 'Switzerland',
    coordinates: [8.5417, 47.3769], score: 71.9, trend: '+5%', trendDir: 'up', status: 'CRITICAL',
    fund: 'MLT Alpha', assetType: 'Industrial', units: '234 TEU', confidence: 'HIGH', value: '$89.2M',
    image: getBuildingImg(1), googleMapsUrl: getGoogleMapsUrl([8.5417, 47.3769]),
    predictions: { increase: 12, decrease: 5, stable: 83 },
    radarData: [
      { subject: 'Connectivity', A: 85 },
      { subject: 'Demographic', A: 65 },
      { subject: 'Infrastructure', A: 90 },
      { subject: 'Economy', A: 70 },
      { subject: 'Environment', A: 40 },
    ],
    drivers: [
      { label: 'Tenant Roll Risk', desc: 'lease expiry', value: 47, color: '#94a3b8' },
      { label: 'Debt Stress', desc: 'DSCR hit', value: 31, color: '#f97316' },
      { label: 'Net Operational Income Down', desc: '', value: 22, color: '#eab308' },
    ],
    risks: adjustRisks(generateRisks(71.9, 'CRITICAL', '+5%', 'up'))
  },
  {
    id: 2, name: 'Munich Retail Boxpark', city: 'Munich', country: 'Germany',
    coordinates: [11.5820, 48.1351], score: 62.3, trend: '+8%', trendDir: 'up', status: 'ELEVATED',
    fund: 'MLT Beta', assetType: 'Retail', units: '89 Assets', confidence: 'MEDIUM', value: '$45.7M',
    image: getBuildingImg(2), googleMapsUrl: getGoogleMapsUrl([11.5820, 48.1351]),
    predictions: { increase: 8, decrease: 15, stable: 77 },
    radarData: [
      { subject: 'Connectivity', A: 95 },
      { subject: 'Demographic', A: 80 },
      { subject: 'Infrastructure', A: 85 },
      { subject: 'Economy', A: 60 },
      { subject: 'Environment', A: 50 },
    ],
    drivers: [
      { label: 'Occupancy Drop', desc: 'vacancy rate up', value: 52, color: '#f97316' },
      { label: 'Rent Rolldown', desc: 'below market', value: 30, color: '#eab308' },
      { label: 'Maintenance Backlog', desc: 'deferred capex', value: 18, color: '#94a3b8' },
    ],
    risks: adjustRisks(generateRisks(62.3, 'ELEVATED', '+8%', 'up'))
  },
  {
    id: 3, name: 'Paris Innovation Campus', city: 'Paris', country: 'France',
    coordinates: [2.3522, 48.8566], score: 58.6, trend: '+4%', trendDir: 'up', status: 'ELEVATED',
    fund: 'MLT Alpha', assetType: 'Office', units: '450 Units', confidence: 'HIGH', value: '$112.3M',
    image: getBuildingImg(3), googleMapsUrl: getGoogleMapsUrl([2.3522, 48.8566]),
    predictions: { increase: 15, decrease: 3, stable: 82 },
    radarData: [
      { subject: 'Connectivity', A: 90 },
      { subject: 'Demographic', A: 88 },
      { subject: 'Infrastructure', A: 92 },
      { subject: 'Economy', A: 85 },
      { subject: 'Environment', A: 75 },
    ],
    drivers: [
      { label: 'Tech Sector Downturn', desc: 'tenant risk', value: 41, color: '#f97316' },
      { label: 'Lease Rollover', desc: '2024-2025', value: 35, color: '#eab308' },
      { label: 'Market Softening', desc: 'Q4 data', value: 24, color: '#94a3b8' },
    ],
    risks: adjustRisks(generateRisks(58.6, 'ELEVATED', '+4%', 'up'))
  },
  {
    id: 4, name: 'London Central Hub', city: 'London', country: 'UK',
    coordinates: [-0.1276, 51.5074], score: 35.2, trend: '-2%', trendDir: 'down', status: 'SAFE',
    fund: 'MLT Gamma', assetType: 'Mixed Use', units: '320 Units', confidence: 'HIGH', value: '$203.1M',
    image: getBuildingImg(4), googleMapsUrl: getGoogleMapsUrl([-0.1276, 51.5074]),
    predictions: { increase: 20, decrease: 2, stable: 78 },
    radarData: [
      { subject: 'Connectivity', A: 98 },
      { subject: 'Demographic', A: 95 },
      { subject: 'Infrastructure', A: 96 },
      { subject: 'Economy', A: 92 },
      { subject: 'Environment', A: 88 },
    ],
    drivers: [
      { label: 'Strong Occupancy', desc: '97% rate', value: 60, color: '#2ecc71' },
      { label: 'Lease Renewals', desc: 'secured 2026', value: 25, color: '#2ecc71' },
      { label: 'NOI Growth', desc: '3.2% YoY', value: 15, color: '#2ecc71' },
    ],
    risks: adjustRisks(generateRisks(35.2, 'SAFE', '-2%', 'down'))
  },
  {
    id: 5, name: 'Amsterdam Office Tower', city: 'Amsterdam', country: 'Netherlands',
    coordinates: [4.9041, 52.3676], score: 44.1, trend: '+1%', trendDir: 'up', status: 'MODERATE',
    fund: 'MLT Beta', assetType: 'Office', units: '210 Units', confidence: 'MEDIUM', value: '$78.4M',
    image: getBuildingImg(5), googleMapsUrl: getGoogleMapsUrl([4.9041, 52.3676]),
    predictions: { increase: 10, decrease: 10, stable: 80 },
    radarData: [
      { subject: 'Connectivity', A: 88 },
      { subject: 'Demographic', A: 75 },
      { subject: 'Infrastructure', A: 82 },
      { subject: 'Economy', A: 78 },
      { subject: 'Environment', A: 72 },
    ],
    drivers: [
      { label: 'Interest Rate Exposure', desc: 'variable rate', value: 48, color: '#eab308' },
      { label: 'Tenant Concentration', desc: 'single-tenant 60%', value: 32, color: '#f97316' },
      { label: 'FX Risk', desc: 'EUR/GBP', value: 20, color: '#94a3b8' },
    ],
    risks: adjustRisks(generateRisks(44.1, 'MODERATE', '+1%', 'up'))
  },
  {
    id: 6, name: 'Berlin Logistics Hub', city: 'Berlin', country: 'Germany',
    coordinates: [13.4050, 52.5200], score: 29.8, trend: '-5%', trendDir: 'down', status: 'SAFE',
    fund: 'MLT Gamma', assetType: 'Industrial', units: '150 Units', confidence: 'HIGH', value: '$56.9M',
    image: getBuildingImg(6), googleMapsUrl: getGoogleMapsUrl([13.4050, 52.5200]),
    predictions: { increase: 25, decrease: 1, stable: 74 },
    radarData: [
      { subject: 'Connectivity', A: 92 },
      { subject: 'Demographic', A: 85 },
      { subject: 'Infrastructure', A: 90 },
      { subject: 'Economy', A: 88 },
      { subject: 'Environment', A: 85 },
    ],
    drivers: [
      { label: 'Long Term Leases', desc: '8yr avg', value: 55, color: '#2ecc71' },
      { label: 'E-Commerce Demand', desc: 'growing', value: 30, color: '#2ecc71' },
      { label: 'Low Vacancy', desc: '2.1%', value: 15, color: '#2ecc71' },
    ],
    risks: adjustRisks(generateRisks(29.8, 'SAFE', '-5%', 'down'))
  },
  {
    id: 7, name: 'Madrid Business Park', city: 'Madrid', country: 'Spain',
    coordinates: [-3.7038, 40.4168], score: 52.4, trend: '+6%', trendDir: 'up', status: 'ELEVATED',
    fund: 'MLT Alpha', assetType: 'Office', units: '180 Units', confidence: 'MEDIUM', value: '$67.5M',
    image: getBuildingImg(7), googleMapsUrl: getGoogleMapsUrl([-3.7038, 40.4168]),
    predictions: { increase: 5, decrease: 20, stable: 75 },
    radarData: [
      { subject: 'Connectivity', A: 80 },
      { subject: 'Demographic', A: 70 },
      { subject: 'Infrastructure', A: 75 },
      { subject: 'Economy', A: 65 },
      { subject: 'Environment', A: 60 },
    ],
    drivers: [
      { label: 'Macro Slowdown', desc: 'GDP risk', value: 39, color: '#f97316' },
      { label: 'Refinancing Risk', desc: '2025 maturity', value: 36, color: '#eab308' },
      { label: 'Tenant Defaults', desc: '2 pending', value: 25, color: '#94a3b8' },
    ],
    risks: adjustRisks(generateRisks(52.4, 'ELEVATED', '+6%', 'up'))
  },
  {
    id: 8, name: 'Milan Luxury Retail', city: 'Milan', country: 'Italy',
    coordinates: [9.1900, 45.4642], score: 38.7, trend: '+2%', trendDir: 'up', status: 'MODERATE',
    fund: 'MLT Beta', assetType: 'Retail', units: '95 Units', confidence: 'HIGH', value: '$145.2M',
    image: getBuildingImg(8), googleMapsUrl: getGoogleMapsUrl([9.1900, 45.4642]),
    predictions: { increase: 15, decrease: 5, stable: 80 },
    radarData: [
      { subject: 'Connectivity', A: 96 },
      { subject: 'Demographic', A: 94 },
      { subject: 'Infrastructure', A: 92 },
      { subject: 'Economy', A: 90 },
      { subject: 'Environment', A: 85 },
    ],
    drivers: [
      { label: 'Tourism Recovery', desc: 'post-COVID', value: 45, color: '#eab308' },
      { label: 'Luxury Brand Demand', desc: 'stable', value: 35, color: '#2ecc71' },
      { label: 'Renovation Costs', desc: 'Q3 planned', value: 20, color: '#94a3b8' },
    ],
    risks: adjustRisks(generateRisks(38.7, 'MODERATE', '+2%', 'up'))
  },
  {
    id: 9, name: 'Stockholm Tech Center', city: 'Stockholm', country: 'Sweden',
    coordinates: [18.0686, 59.3293], score: 32.1, trend: '-1%', trendDir: 'down', status: 'SAFE',
    fund: 'MLT Gamma', assetType: 'Office', units: '140 Units', confidence: 'HIGH', value: '$88.5M',
    image: getBuildingImg(9), googleMapsUrl: getGoogleMapsUrl([18.0686, 59.3293]),
    predictions: { increase: 18, decrease: 2, stable: 80 },
    radarData: [
      { subject: 'Connectivity', A: 94 },
      { subject: 'Demographic', A: 90 },
      { subject: 'Infrastructure', A: 95 },
      { subject: 'Economy', A: 92 },
      { subject: 'Environment', A: 98 },
    ],
    drivers: [
      { label: 'Green Energy Focus', desc: 'ESG positive', value: 60, color: '#2ecc71' },
      { label: 'Stable Tenants', desc: 'Tech giants', value: 30, color: '#2ecc71' },
      { label: 'Utility Costs Down', desc: 'Subsidy', value: 10, color: '#2ecc71' },
    ],
    risks: adjustRisks(generateRisks(32.1, 'SAFE', '-1%', 'down'))
  },
  {
    id: 10, name: 'Warsaw Distribution', city: 'Warsaw', country: 'Poland',
    coordinates: [21.0122, 52.2297], score: 55.8, trend: '+4%', trendDir: 'up', status: 'ELEVATED',
    fund: 'MLT Beta', assetType: 'Industrial', units: '310 Units', confidence: 'MEDIUM', value: '$65.1M',
    image: getBuildingImg(10), googleMapsUrl: getGoogleMapsUrl([21.0122, 52.2297]),
    predictions: { increase: 12, decrease: 8, stable: 80 },
    radarData: [
      { subject: 'Connectivity', A: 85 },
      { subject: 'Demographic', A: 78 },
      { subject: 'Infrastructure', A: 82 },
      { subject: 'Economy', A: 75 },
      { subject: 'Environment', A: 70 },
    ],
    drivers: [
      { label: 'Supply Chain Shifts', desc: 'nearshoring', value: 45, color: '#eab308' },
      { label: 'Labor Shortage', desc: 'wage inflation', value: 35, color: '#f97316' },
      { label: 'Border Tariffs', desc: 'export risk', value: 20, color: '#eab308' },
    ],
    risks: adjustRisks(generateRisks(55.8, 'ELEVATED', '+4%', 'up'))
  },
  {
    id: 11, name: 'Lisbon Waterfront', city: 'Lisbon', country: 'Portugal',
    coordinates: [-9.1393, 38.7223], score: 48.0, trend: '+1%', trendDir: 'up', status: 'MODERATE',
    fund: 'MLT Alpha', assetType: 'Mixed Use', units: '115 Units', confidence: 'MEDIUM', value: '$54.0M',
    image: getBuildingImg(11), googleMapsUrl: getGoogleMapsUrl([-9.1393, 38.7223]),
    predictions: { increase: 7, decrease: 13, stable: 80 },
    radarData: [
      { subject: 'Connectivity', A: 82 },
      { subject: 'Demographic', A: 85 },
      { subject: 'Infrastructure', A: 80 },
      { subject: 'Economy', A: 75 },
      { subject: 'Environment', A: 88 },
    ],
    drivers: [
      { label: 'Foreign Investment', desc: 'Golden Visa end', value: 50, color: '#f97316' },
      { label: 'Tourism Boom', desc: 'retail boost', value: 30, color: '#2ecc71' },
      { label: 'Interest Rates', desc: 'ECB hikes', value: 20, color: '#eab308' },
    ],
    risks: adjustRisks(generateRisks(48.0, 'MODERATE', '+1%', 'up'))
  },
  {
    id: 12, name: 'Vienna Medical Plaza', city: 'Vienna', country: 'Austria',
    coordinates: [16.3738, 48.2082], score: 28.5, trend: '-3%', trendDir: 'down', status: 'SAFE',
    fund: 'MLT Gamma', assetType: 'Retail', units: '65 Units', confidence: 'HIGH', value: '$92.1M',
    image: getBuildingImg(12), googleMapsUrl: getGoogleMapsUrl([16.3738, 48.2082]),
    predictions: { increase: 5, decrease: 5, stable: 90 },
    radarData: [
      { subject: 'Connectivity', A: 88 },
      { subject: 'Demographic', A: 92 },
      { subject: 'Infrastructure', A: 90 },
      { subject: 'Economy', A: 85 },
      { subject: 'Environment', A: 82 },
    ],
    drivers: [
      { label: 'Gov Contracts', desc: 'guaranteed rent', value: 70, color: '#2ecc71' },
      { label: 'Low Competitors', desc: 'niche market', value: 20, color: '#2ecc71' },
      { label: 'Demographics', desc: 'aging pop', value: 10, color: '#2ecc71' },
    ],
    risks: adjustRisks(generateRisks(28.5, 'SAFE', '-3%', 'down'))
  }
];

export const FUNDS = ['All', 'MLT Alpha', 'MLT Beta', 'MLT Gamma'];
export const ASSET_TYPES = ['All', 'Office', 'Retail', 'Industrial', 'Mixed Use'];
export const STATUSES = ['All', 'CRITICAL', 'ELEVATED', 'MODERATE', 'SAFE'];

export const STATUS_CONFIG = {
  CRITICAL: { color: '#ff4d4d', bg: 'rgba(255,77,77,0.15)', label: 'CRITICAL' },
  ELEVATED: { color: '#ff9f43', bg: 'rgba(255,159,67,0.15)', label: 'ELEVATED' },
  MODERATE: { color: '#ffcd3c', bg: 'rgba(255,205,60,0.15)', label: 'MODERATE' },
  SAFE:     { color: '#2ecc71', bg: 'rgba(46,204,113,0.15)', label: 'SAFE' },
};
