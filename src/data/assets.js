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

// ── Geographic Level Constants ────────────────────────────────────────────────
// L1: Country | L2: Region | L3: City | L4: District | L5: Locality | L6: Micro Market
export const GEO_LEVELS = ['country', 'region', 'city', 'district', 'locality', 'microMarket'];

// ── Regional Hierarchy (L1→L6) ───────────────────────────────────────────────
// Priority: Germany + Switzerland (full depth), others (L1-L3 stubs)
export const REGIONAL_DATA = {
  // ════════════════════════════════════════════════════════════════════════════
  // GERMANY — Full L1→L6
  // ════════════════════════════════════════════════════════════════════════════
  'Germany': {
    center: [10.4515, 51.1657], zoom: 5,
    regions: {
      'Bavaria': {
        center: [11.5580, 48.3953], zoom: 7,
        cities: {
          'Munich': {
            center: [11.5820, 48.1351], zoom: 10,
            districts: {
              'Altstadt-Lehel': {
                center: [11.5750, 48.1380], zoom: 13,
                localities: {
                  'Altstadt': {
                    center: [11.5755, 48.1370], zoom: 15,
                    microMarkets: {
                      'Marienplatz Area': { center: [11.5760, 48.1374], zoom: 17 },
                      'Viktualienmarkt': { center: [11.5768, 48.1350], zoom: 17 },
                    }
                  },
                  'Lehel': {
                    center: [11.5870, 48.1410], zoom: 15,
                    microMarkets: {
                      'Eisbach Quarter': { center: [11.5880, 48.1430], zoom: 17 },
                      'St-Anna-Strasse': { center: [11.5850, 48.1400], zoom: 17 },
                    }
                  }
                }
              },
              'Maxvorstadt': {
                center: [11.5680, 48.1520], zoom: 13,
                localities: {
                  'Königsplatz': {
                    center: [11.5650, 48.1460], zoom: 15,
                    microMarkets: {
                      'Museum Quarter': { center: [11.5640, 48.1470], zoom: 17 },
                      'Brienner Strasse': { center: [11.5700, 48.1450], zoom: 17 },
                    }
                  },
                  'Universität': {
                    center: [11.5800, 48.1510], zoom: 15,
                    microMarkets: {
                      'Ludwigstrasse': { center: [11.5790, 48.1520], zoom: 17 },
                      'Schellingstrasse': { center: [11.5730, 48.1530], zoom: 17 },
                    }
                  }
                }
              },
              'Schwabing-West': {
                center: [11.5600, 48.1600], zoom: 13,
                localities: {
                  'Hohenzollernplatz': {
                    center: [11.5620, 48.1620], zoom: 15,
                    microMarkets: {
                      'Leopoldstrasse North': { center: [11.5640, 48.1640], zoom: 17 },
                    }
                  }
                }
              }
            }
          },
          'Nuremberg': {
            center: [11.0767, 49.4521], zoom: 11,
            districts: {
              'Altstadt': { center: [11.0770, 49.4540], zoom: 14, localities: {} },
              'St. Johannis': { center: [11.0600, 49.4570], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Berlin': {
        center: [13.4050, 52.5200], zoom: 8,
        cities: {
          'Berlin': {
            center: [13.4050, 52.5200], zoom: 11,
            districts: {
              'Mitte': {
                center: [13.3890, 52.5200], zoom: 13,
                localities: {
                  'Alexanderplatz': {
                    center: [13.4115, 52.5219], zoom: 15,
                    microMarkets: {
                      'Alexanderstrasse': { center: [13.4130, 52.5230], zoom: 17 },
                      'Karl-Marx-Allee': { center: [13.4200, 52.5200], zoom: 17 },
                    }
                  },
                  'Potsdamer Platz': {
                    center: [13.3760, 52.5096], zoom: 15,
                    microMarkets: {
                      'Sony Center': { center: [13.3740, 52.5100], zoom: 17 },
                      'Leipziger Platz': { center: [13.3810, 52.5110], zoom: 17 },
                    }
                  },
                  'Friedrichstrasse': {
                    center: [13.3880, 52.5200], zoom: 15,
                    microMarkets: {
                      'Checkpoint Charlie': { center: [13.3905, 52.5075], zoom: 17 },
                    }
                  }
                }
              },
              'Charlottenburg': {
                center: [13.2954, 52.5186], zoom: 13,
                localities: {
                  'Kurfürstendamm': {
                    center: [13.3280, 52.5040], zoom: 15,
                    microMarkets: {
                      'Breitscheidplatz': { center: [13.3350, 52.5050], zoom: 17 },
                      'Savignyplatz': { center: [13.3210, 52.5050], zoom: 17 },
                    }
                  }
                }
              },
              'Kreuzberg': {
                center: [13.4000, 52.4980], zoom: 13,
                localities: {
                  'Bergmannkiez': {
                    center: [13.3940, 52.4890], zoom: 15,
                    microMarkets: {
                      'Bergmannstrasse': { center: [13.3930, 52.4880], zoom: 17 },
                    }
                  }
                }
              }
            }
          }
        }
      },
      'North Rhine-Westphalia': {
        center: [7.6616, 51.4332], zoom: 7,
        cities: {
          'Düsseldorf': {
            center: [6.7735, 51.2277], zoom: 11,
            districts: {
              'Medienhafen': { center: [6.7600, 51.2170], zoom: 14, localities: {} },
              'Königsallee': { center: [6.7800, 51.2240], zoom: 14, localities: {} },
            }
          },
          'Cologne': {
            center: [6.9603, 50.9375], zoom: 11,
            districts: {
              'Innenstadt': { center: [6.9570, 50.9380], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Hamburg': {
        center: [9.9937, 53.5511], zoom: 9,
        cities: {
          'Hamburg': {
            center: [9.9937, 53.5511], zoom: 11,
            districts: {
              'HafenCity': { center: [10.0020, 53.5410], zoom: 14, localities: {} },
              'Eppendorf': { center: [9.9830, 53.5870], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Hesse': {
        center: [8.6821, 50.1109], zoom: 8,
        cities: {
          'Frankfurt': {
            center: [8.6821, 50.1109], zoom: 11,
            districts: {
              'Bankenviertel': { center: [8.6700, 50.1130], zoom: 14, localities: {} },
              'Westend': { center: [8.6600, 50.1200], zoom: 14, localities: {} },
            }
          }
        }
      }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SWITZERLAND — Full L1→L6
  // ════════════════════════════════════════════════════════════════════════════
  'Switzerland': {
    center: [8.2275, 46.8182], zoom: 7,
    regions: {
      'Zürich Canton': {
        center: [8.5417, 47.3769], zoom: 9,
        cities: {
          'Zürich': {
            center: [8.5417, 47.3769], zoom: 12,
            districts: {
              'Kreis 1 (Altstadt)': {
                center: [8.5400, 47.3720], zoom: 14,
                localities: {
                  'Lindenhof': {
                    center: [8.5390, 47.3730], zoom: 16,
                    microMarkets: {
                      'Bahnhofstrasse North': { center: [8.5391, 47.3740], zoom: 17 },
                      'Paradeplatz': { center: [8.5392, 47.3710], zoom: 17 },
                    }
                  },
                  'Rathaus': {
                    center: [8.5430, 47.3710], zoom: 16,
                    microMarkets: {
                      'Niederdorf': { center: [8.5440, 47.3720], zoom: 17 },
                    }
                  }
                }
              },
              'Kreis 2 (Enge)': {
                center: [8.5310, 47.3620], zoom: 14,
                localities: {
                  'Enge': {
                    center: [8.5310, 47.3600], zoom: 16,
                    microMarkets: {
                      'Bürkliplatz': { center: [8.5380, 47.3660], zoom: 17 },
                    }
                  }
                }
              },
              'Kreis 5 (Industriequartier)': {
                center: [8.5200, 47.3870], zoom: 14,
                localities: {
                  'Escher Wyss': {
                    center: [8.5150, 47.3900], zoom: 16,
                    microMarkets: {
                      'Prime Tower Area': { center: [8.5160, 47.3910], zoom: 17 },
                      'Turbinenplatz': { center: [8.5190, 47.3890], zoom: 17 },
                    }
                  },
                  'Gewerbeschule': {
                    center: [8.5260, 47.3840], zoom: 16,
                    microMarkets: {
                      'Langstrasse': { center: [8.5270, 47.3820], zoom: 17 },
                    }
                  }
                }
              },
              'Kreis 8 (Riesbach)': {
                center: [8.5560, 47.3550], zoom: 14,
                localities: {
                  'Seefeld': {
                    center: [8.5540, 47.3570], zoom: 16,
                    microMarkets: {
                      'Seefeldstrasse': { center: [8.5530, 47.3580], zoom: 17 },
                    }
                  }
                }
              }
            }
          },
          'Winterthur': {
            center: [8.7295, 47.4985], zoom: 12,
            districts: {
              'Altstadt': { center: [8.7290, 47.4990], zoom: 14, localities: {} },
              'Töss': { center: [8.7050, 47.4950], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Geneva Canton': {
        center: [6.1432, 46.2044], zoom: 10,
        cities: {
          'Geneva': {
            center: [6.1432, 46.2044], zoom: 12,
            districts: {
              'Eaux-Vives': {
                center: [6.1600, 46.2020], zoom: 14,
                localities: {
                  'Rue du Lac': {
                    center: [6.1580, 46.2030], zoom: 16,
                    microMarkets: {
                      'Jet d\'Eau Quarter': { center: [6.1560, 46.2070], zoom: 17 },
                    }
                  }
                }
              },
              'Plainpalais': { center: [6.1410, 46.1990], zoom: 14, localities: {} },
              'Nations': { center: [6.1350, 46.2230], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Bern Canton': {
        center: [7.4474, 46.9480], zoom: 10,
        cities: {
          'Bern': {
            center: [7.4474, 46.9480], zoom: 12,
            districts: {
              'Altstadt': { center: [7.4480, 46.9480], zoom: 14, localities: {} },
              'Kirchenfeld': { center: [7.4530, 46.9430], zoom: 14, localities: {} },
            }
          }
        }
      },
      'Basel-Stadt': {
        center: [7.5886, 47.5596], zoom: 11,
        cities: {
          'Basel': {
            center: [7.5886, 47.5596], zoom: 12,
            districts: {
              'Grossbasel': { center: [7.5850, 47.5550], zoom: 14, localities: {} },
              'Kleinbasel': { center: [7.5950, 47.5650], zoom: 14, localities: {} },
            }
          }
        }
      }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // POLAND — L1→L4
  // ════════════════════════════════════════════════════════════════════════════
  'Poland': {
    center: [19.1451, 51.9194], zoom: 6,
    regions: {
      'Masovian': {
        center: [21.0122, 52.2297], zoom: 8,
        cities: {
          'Warsaw': {
            center: [21.0122, 52.2297], zoom: 11,
            districts: {
              'Mokotów': { center: [21.0100, 52.1900], zoom: 13, localities: {} },
              'Służewiec': { center: [20.9904, 52.1797], zoom: 15, localities: {} },
              'Wola': { center: [20.9700, 52.2350], zoom: 13, localities: {} },
            }
          }
        }
      }
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // OTHER COUNTRIES — L1→L3 stubs (expandable later)
  // ════════════════════════════════════════════════════════════════════════════
  'France': {
    center: [2.3522, 46.6034], zoom: 5,
    regions: {
      'Île-de-France': {
        center: [2.3522, 48.8566], zoom: 9,
        cities: {
          'Paris': { center: [2.3522, 48.8566], zoom: 12, districts: {} },
        }
      }
    }
  },
  'UK': {
    center: [-1.2578, 52.3555], zoom: 5,
    regions: {
      'Greater London': {
        center: [-0.1276, 51.5074], zoom: 9,
        cities: {
          'London': { center: [-0.1276, 51.5074], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Netherlands': {
    center: [5.2913, 52.1326], zoom: 7,
    regions: {
      'North Holland': {
        center: [4.9041, 52.3676], zoom: 9,
        cities: {
          'Amsterdam': { center: [4.9041, 52.3676], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Spain': {
    center: [-3.7492, 40.4637], zoom: 5,
    regions: {
      'Community of Madrid': {
        center: [-3.7038, 40.4168], zoom: 9,
        cities: {
          'Madrid': { center: [-3.7038, 40.4168], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Italy': {
    center: [12.5674, 41.8719], zoom: 5,
    regions: {
      'Lombardy': {
        center: [9.1900, 45.4642], zoom: 8,
        cities: {
          'Milan': { center: [9.1900, 45.4642], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Sweden': {
    center: [18.0686, 59.3293], zoom: 5,
    regions: {
      'Stockholm County': {
        center: [18.0686, 59.3293], zoom: 9,
        cities: {
          'Stockholm': { center: [18.0686, 59.3293], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Portugal': {
    center: [-9.1393, 38.7223], zoom: 6,
    regions: {
      'Lisbon District': {
        center: [-9.1393, 38.7223], zoom: 9,
        cities: {
          'Lisbon': { center: [-9.1393, 38.7223], zoom: 12, districts: {} },
        }
      }
    }
  },
  'Austria': {
    center: [16.3738, 48.2082], zoom: 6,
    regions: {
      'Vienna': {
        center: [16.3738, 48.2082], zoom: 10,
        cities: {
          'Vienna': { center: [16.3738, 48.2082], zoom: 12, districts: {} },
        }
      }
    }
  },
};

export const DATA_VERSION = 'v2.4';
export const PORTFOLIO_VERSION = 'v1.3';
export const VERSION_HISTORY = [
  { id: 'v1.3', type: 'Portfolio', date: '01 Apr 2025', desc: 'Manual - after a recommended action is implemented and verified' },
  { id: 'v2.4', type: 'Data', date: '12 Mar 2025', desc: 'Scheduled refresh (weekly / monthly / quarterly)' }
];
