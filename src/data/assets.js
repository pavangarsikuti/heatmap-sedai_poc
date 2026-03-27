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

export const calculateRentalScore = (occupancy, growth, stability) => {
  // Rental Score = composite metric combining occupancy, rent growth, and tenant stability
  return Math.round((occupancy * 0.4 + growth * 0.3 + stability * 0.3));
};

const generateHistory = (base) => {
  return Array.from({ length: 12 }, (_, i) => {
    const noise = Math.random() * 4 - 2;
    return Math.round((base + noise) * 10) / 10;
  });
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
      { label: 'Tenant Roll Risk', desc: 'lease expiry', value: 47, color: '#94a3b8', weight: 0.5 },
      { label: 'Debt Stress', desc: 'DSCR hit', value: 31, color: '#f97316', weight: 0.3 },
      { label: 'Net Operational Income Down', desc: '', value: 22, color: '#eab308', weight: 0.2 },
    ],
    history: generateHistory(71.9),
    prevQuarterScore: 75.2,
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
      { label: 'Occupancy Drop', desc: 'vacancy rate up', value: 52, color: '#f97316', weight: 0.6 },
      { label: 'Rent Rolldown', desc: 'below market', value: 30, color: '#eab308', weight: 0.25 },
      { label: 'Maintenance Backlog', desc: 'deferred capex', value: 18, color: '#94a3b8', weight: 0.15 },
    ],
    history: generateHistory(62.3),
    prevQuarterScore: 58.1,
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
      { label: 'Tech Sector Downturn', desc: 'tenant risk', value: 41, color: '#f97316', weight: 0.4 },
      { label: 'Lease Rollover', desc: '2024-2025', value: 35, color: '#eab308', weight: 0.4 },
      { label: 'Market Softening', desc: 'Q4 data', value: 24, color: '#94a3b8', weight: 0.2 },
    ],
    history: generateHistory(58.6),
    prevQuarterScore: 56.2,
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
      { label: 'Strong Occupancy', desc: '97% rate', value: 60, color: '#2ecc71', weight: 0.5 },
      { label: 'Lease Renewals', desc: 'secured 2026', value: 25, color: '#2ecc71', weight: 0.3 },
      { label: 'NOI Growth', desc: '3.2% YoY', value: 15, color: '#2ecc71', weight: 0.2 },
    ],
    history: generateHistory(35.2),
    prevQuarterScore: 38.5,
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
      { label: 'Interest Rate Exposure', desc: 'variable rate', value: 48, color: '#eab308', weight: 0.5 },
      { label: 'Tenant Concentration', desc: 'single-tenant 60%', value: 32, color: '#f97316', weight: 0.3 },
      { label: 'FX Risk', desc: 'EUR/GBP', value: 20, color: '#94a3b8', weight: 0.2 },
    ],
    history: generateHistory(44.1),
    prevQuarterScore: 42.8,
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
      { label: 'Long Term Leases', desc: '8yr avg', value: 55, color: '#2ecc71', weight: 0.6 },
      { label: 'E-Commerce Demand', desc: 'growing', value: 30, color: '#2ecc71', weight: 0.3 },
      { label: 'Low Vacancy', desc: '2.1%', value: 15, color: '#2ecc71', weight: 0.1 },
    ],
    history: generateHistory(29.8),
    prevQuarterScore: 31.5,
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
      { label: 'Macro Slowdown', desc: 'GDP risk', value: 39, color: '#f97316', weight: 0.4 },
      { label: 'Refinancing Risk', desc: '2025 maturity', value: 36, color: '#eab308', weight: 0.4 },
      { label: 'Tenant Defaults', desc: '2 pending', value: 25, color: '#94a3b8', weight: 0.2 },
    ],
    history: generateHistory(52.4),
    prevQuarterScore: 49.8,
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
      { label: 'Tourism Recovery', desc: 'post-COVID', value: 45, color: '#eab308', weight: 0.5 },
      { label: 'Luxury Brand Demand', desc: 'stable', value: 35, color: '#2ecc71', weight: 0.3 },
      { label: 'Renovation Costs', desc: 'Q3 planned', value: 20, color: '#94a3b8', weight: 0.2 },
    ],
    history: generateHistory(38.7),
    prevQuarterScore: 36.4,
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
      { label: 'Green Energy Focus', desc: 'ESG positive', value: 60, color: '#2ecc71', weight: 0.5 },
      { label: 'Stable Tenants', desc: 'Tech giants', value: 30, color: '#2ecc71', weight: 0.3 },
      { label: 'Utility Costs Down', desc: 'Subsidy', value: 10, color: '#2ecc71', weight: 0.2 },
    ],
    history: generateHistory(32.1),
    prevQuarterScore: 33.5,
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
      { label: 'Supply Chain Shifts', desc: 'nearshoring', value: 45, color: '#eab308', weight: 0.4 },
      { label: 'Labor Shortage', desc: 'wage inflation', value: 35, color: '#f97316', weight: 0.4 },
      { label: 'Border Tariffs', desc: 'export risk', value: 20, color: '#eab308', weight: 0.2 },
    ],
    history: generateHistory(55.8),
    prevQuarterScore: 52.1,
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
      { label: 'Foreign Investment', desc: 'Golden Visa end', value: 50, color: '#f97316', weight: 0.5 },
      { label: 'Tourism Boom', desc: 'retail boost', value: 30, color: '#2ecc71', weight: 0.3 },
      { label: 'Interest Rates', desc: 'ECB hikes', value: 20, color: '#eab308', weight: 0.2 },
    ],
    history: generateHistory(48.0),
    prevQuarterScore: 45.5,
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
      { label: 'Gov Contracts', desc: 'guaranteed rent', value: 70, color: '#2ecc71', weight: 0.6 },
      { label: 'Low Competitors', desc: 'niche market', value: 20, color: '#2ecc71', weight: 0.25 },
      { label: 'Demographics', desc: 'aging pop', value: 10, color: '#2ecc71', weight: 0.15 },
    ],
    history: generateHistory(28.5),
    prevQuarterScore: 30.2,
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

// ── Geographic Level Constants (L1-L10) ──────────────────────────────────────
export const GEO_LEVELS = [
  'country',       // L1: Land
  'state',         // L2: Bundesland
  'adminRegion',   // L3: Regierungsbezirk
  'district',      // L4: Landkreis
  'municipality',  // L5: Gemeinde
  'borough',       // L6: Stadtteil
  'locality',      // L7: Quartier
  'street',        // L8: Straße
  'houseNumber',   // L9: Hausnummer
  'postalCode',    // L10: PLZ
];

// ── Regional Hierarchy (Recursive Structure) ─────────────────────────────────
// Each node: { name, center: [lng, lat], zoom, children: { name: node } }
export const REGIONAL_DATA = {
  'Germany': {
    name: 'Germany', center: [10.4515, 51.1657], zoom: 5.5,
    children: {
      'Bavaria': {
        name: 'Bavaria', center: [11.5580, 48.3953], zoom: 7.5,
        children: {
          'Upper Bavaria': {
            name: 'Upper Bavaria', center: [11.5820, 48.1351], zoom: 8.5,
            children: {
              'Munich': {
                name: 'Munich', center: [11.5820, 48.1351], zoom: 11,
                children: {
                  'Munich City': {
                    name: 'Munich City', center: [11.5750, 48.1380], zoom: 12,
                    children: {
                      'Schwabing': {
                        name: 'Schwabing', center: [11.5820, 48.1630], zoom: 14,
                        children: {
                          'Schwabing-West': {
                            name: 'Schwabing-West', center: [11.5680, 48.1650], zoom: 15,
                            children: {
                              'Leopoldstraße': {
                                name: 'Leopoldstraße', center: [11.5850, 48.1600], zoom: 16.5,
                                children: {
                                  'Hausnummer 10': {
                                    name: 'Hausnummer 10', center: [11.5855, 48.1605], zoom: 18,
                                    children: {
                                      '80802': { name: '80802', center: [11.5855, 48.1605], zoom: 18.5 }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'Berlin': {
        name: 'Berlin', center: [13.4050, 52.5200], zoom: 11,
        children: {
          'Berlin-Mitte': {
            name: 'Berlin-Mitte', center: [13.3890, 52.5200], zoom: 13,
            children: {
              'Mitte': {
                name: 'Mitte', center: [13.3890, 52.5200], zoom: 14,
                children: {
                  'Alexanderplatz Area': {
                    name: 'Alexanderplatz Area', center: [13.4115, 52.5219], zoom: 16,
                    children: {
                      'Alexanderstraße': {
                        name: 'Alexanderstraße', center: [13.4130, 52.5230], zoom: 17,
                        children: {
                          '1': {
                            name: '1', center: [13.4132, 52.5232], zoom: 18,
                            children: { '10178': { name: '10178', center: [13.4132, 52.5232], zoom: 18.5 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Switzerland': {
    name: 'Switzerland', center: [8.2275, 46.8182], zoom: 7.5,
    children: {
      'Zürich Canton': {
        name: 'Zürich Canton', center: [8.5417, 47.3769], zoom: 9.5,
        children: {
          'Zürich Region': {
            name: 'Zürich Region', center: [8.5417, 47.3769], zoom: 11,
            children: {
              'Zürich City': {
                name: 'Zürich City', center: [8.5417, 47.3769], zoom: 12.5,
                children: {
                  'District 1': {
                    name: 'District 1', center: [8.5400, 47.3720], zoom: 14.5,
                    children: {
                      'Altstadt': {
                        name: 'Altstadt', center: [8.5400, 47.3720], zoom: 16,
                        children: {
                          'Lindenhof': {
                            name: 'Lindenhof', center: [8.5390, 47.3730], zoom: 17,
                            children: {
                              'Bahnhofstrasse': {
                                name: 'Bahnhofstrasse', center: [8.5391, 47.3740], zoom: 17.5,
                                children: {
                                  '70': {
                                    name: '70', center: [8.5392, 47.3742], zoom: 18.5,
                                    children: { '8001': { name: '8001', center: [8.5392, 47.3742], zoom: 19 } }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'UK': {
    name: 'UK', center: [-1.1743, 52.3555], zoom: 6,
    children: {
      'Greater London': {
        name: 'Greater London', center: [-0.1276, 51.5074], zoom: 10,
        children: {
          'Westminster': {
            name: 'Westminster', center: [-0.1372, 51.4975], zoom: 13,
            children: {
              'Marylebone': {
                name: 'Marylebone', center: [-0.1548, 51.5175], zoom: 15,
                children: {
                  'Baker Street Area': {
                    name: 'Baker Street Area', center: [-0.1585, 51.5237], zoom: 16,
                    children: {
                      'Baker St': {
                        name: 'Baker St', center: [-0.1585, 51.5237], zoom: 17,
                        children: {
                          '221B': {
                            name: '221B', center: [-0.1585, 51.5237], zoom: 18,
                            children: { 'NW1 6XE': { name: 'NW1 6XE', center: [-0.1585, 51.5237], zoom: 19 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'France': {
    name: 'France', center: [2.2137, 46.2276], zoom: 6,
    children: {
      'Île-de-France': {
        name: 'Île-de-France', center: [2.3522, 48.8566], zoom: 10,
        children: {
          'Paris': {
            name: 'Paris', center: [2.3522, 48.8566], zoom: 12,
            children: {
              '8th Arrondissement': {
                name: '8th Arrondissement', center: [2.3126, 48.8775], zoom: 14,
                children: {
                  'Champs-Élysées': {
                    name: 'Champs-Élysées', center: [2.3017, 48.8719], zoom: 16,
                    children: {
                      'Avenue des Champs-Élysées': {
                        name: 'Avenue des Champs-Élysées', center: [2.3017, 48.8719], zoom: 17,
                        children: {
                          '101': {
                            name: '101', center: [2.3017, 48.8719], zoom: 18.5,
                            children: { '75008': { name: '75008', center: [2.3017, 48.8719], zoom: 19 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Netherlands': {
    name: 'Netherlands', center: [5.2913, 52.1326], zoom: 7.5,
    children: {
      'North Holland': {
        name: 'North Holland', center: [4.9041, 52.3676], zoom: 10,
        children: {
          'Amsterdam': {
            name: 'Amsterdam', center: [4.9041, 52.3676], zoom: 12,
            children: {
              'Centrum': {
                name: 'Centrum', center: [4.8970, 52.3740], zoom: 14,
                children: {
                  'Grachtengordel': {
                    name: 'Grachtengordel', center: [4.8844, 52.3700], zoom: 16,
                    children: {
                      'Prinsengracht': {
                        name: 'Prinsengracht', center: [4.8844, 52.3700], zoom: 17,
                        children: {
                          '263': {
                            name: '263', center: [4.8844, 52.3700], zoom: 18,
                            children: { '1016 GV': { name: '1016 GV', center: [4.8844, 52.3700], zoom: 18.5 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Spain': {
    name: 'Spain', center: [-3.7038, 40.4168], zoom: 6,
    children: {
      'Madrid Community': {
        name: 'Madrid Community', center: [-3.7038, 40.4168], zoom: 10,
        children: {
          'Madrid': {
            name: 'Madrid', center: [-3.7038, 40.4168], zoom: 12,
            children: {
              'Centro': {
                name: 'Centro', center: [-3.7038, 40.4168], zoom: 14,
                children: {
                  'Sol': {
                    name: 'Sol', center: [-3.7035, 40.4167], zoom: 16,
                    children: {
                      'Calle de Alcalá': {
                        name: 'Calle de Alcalá', center: [-3.7000, 40.4170], zoom: 17,
                        children: {
                          '1': {
                            name: '1', center: [-3.7000, 40.4170], zoom: 18,
                            children: { '28014': { name: '28014', center: [-3.7000, 40.4170], zoom: 18.5 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Italy': {
    name: 'Italy', center: [12.5674, 41.8719], zoom: 6,
    children: {
      'Lazio': {
        name: 'Lazio', center: [12.4964, 41.9028], zoom: 9,
        children: {
          'Rome': {
            name: 'Rome', center: [12.4964, 41.9028], zoom: 12,
            children: {
              'Municipio I': {
                name: 'Municipio I', center: [12.4800, 41.8900], zoom: 14,
                children: {
                  'Historic Centre': {
                    name: 'Historic Centre', center: [12.4830, 41.8930], zoom: 15.5,
                    children: {
                      'Via del Corso': {
                        name: 'Via del Corso', center: [12.4800, 41.9000], zoom: 17,
                        children: {
                          '1': {
                            name: '1', center: [12.4800, 41.9000], zoom: 18,
                            children: { '00186': { name: '00186', center: [12.4800, 41.9000], zoom: 18.5 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Sweden': {
    name: 'Sweden', center: [18.6435, 60.1282], zoom: 5,
    children: {
      'Stockholm County': {
        name: 'Stockholm County', center: [18.0686, 59.3293], zoom: 10,
        children: {
          'Stockholm': {
            name: 'Stockholm', center: [18.0686, 59.3293], zoom: 12,
            children: {
              'Norrmalm': {
                name: 'Norrmalm', center: [18.0650, 59.3330], zoom: 14.5,
                children: {
                  'City': {
                    name: 'City', center: [18.0650, 59.3330], zoom: 16,
                    children: {
                      'Drottninggatan': {
                        name: 'Drottninggatan', center: [18.0640, 59.3340], zoom: 17,
                        children: {
                          '1': {
                            name: '1', center: [18.0641, 59.3341], zoom: 18.5,
                            children: { '111 51': { name: '111 51', center: [18.0641, 59.3341], zoom: 19 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Poland': {
    name: 'Poland', center: [19.1451, 51.9194], zoom: 6,
    children: {
      'Masovian Voivodeship': {
        name: 'Masovian Voivodeship', center: [21.0122, 52.2297], zoom: 9,
        children: {
          'Warsaw': {
            name: 'Warsaw', center: [21.0122, 52.2297], zoom: 12,
            children: {
              'Śródmieście': {
                name: 'Śródmieście', center: [21.0122, 52.2297], zoom: 14,
                children: {
                  'City Center': {
                    name: 'City Center', center: [21.0122, 52.2297], zoom: 15.5,
                    children: {
                      'Nowy Świat': {
                        name: 'Nowy Świat', center: [21.0375, 52.2331], zoom: 17,
                        children: {
                          '1': {
                            name: '1', center: [21.0375, 52.2331], zoom: 18,
                            children: { '00-001': { name: '00-001', center: [21.0375, 52.2331], zoom: 18.5 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Portugal': {
    name: 'Portugal', center: [-8.2245, 39.3999], zoom: 7,
    children: {
      'Lisbon District': {
        name: 'Lisbon District', center: [-9.1393, 38.7223], zoom: 10,
        children: {
          'Lisbon': {
            name: 'Lisbon', center: [-9.1393, 38.7223], zoom: 12,
            children: {
              'Santa Maria Maior': {
                name: 'Santa Maria Maior', center: [-9.1333, 38.7100], zoom: 15,
                children: {
                  'Baixa': {
                    name: 'Baixa', center: [-9.1375, 38.7115], zoom: 16.5,
                    children: {
                      'Rua Augusta': {
                        name: 'Rua Augusta', center: [-9.1375, 38.7115], zoom: 17.5,
                        children: {
                          '1': {
                            name: '1', center: [-9.1375, 38.7115], zoom: 18.5,
                            children: { '1100-053': { name: '1100-053', center: [-9.1375, 38.7115], zoom: 19 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  'Austria': {
    name: 'Austria', center: [14.5501, 47.5162], zoom: 7.5,
    children: {
      'Vienna State': {
        name: 'Vienna State', center: [16.3738, 48.2082], zoom: 11,
        children: {
          'Vienna': {
            name: 'Vienna', center: [16.3738, 48.2082], zoom: 12.5,
            children: {
              'Innere Stadt': {
                name: 'Innere Stadt', center: [16.3700, 48.2100], zoom: 15,
                children: {
                  'City center': {
                    name: 'City center', center: [16.3700, 48.2100], zoom: 16,
                    children: {
                      'Graben': {
                        name: 'Graben', center: [16.3680, 48.2090], zoom: 17.5,
                        children: {
                          '21': {
                            name: '21', center: [16.3681, 48.2091], zoom: 18.5,
                            children: { '1010': { name: '1010', center: [16.3681, 48.2091], zoom: 19 } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const DATA_VERSION = 'v2.4';
export const PORTFOLIO_VERSION = 'v1.3';
export const VERSION_HISTORY = [
  { id: 'v1.3', type: 'Portfolio', date: '01 Apr 2025', desc: 'Manual - after a recommended action is implemented and verified' },
  { id: 'v2.4', type: 'Data', date: '12 Mar 2025', desc: 'Scheduled refresh (weekly / monthly / quarterly)' }
];
