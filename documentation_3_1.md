# Section 3.1: System Strategy & Value Addition

## Overview
The SedAI Risk Intelligence Platform is designed to bridge the gap between static asset reporting and dynamic, regionalized risk monitoring. By implementing a hierarchical geographic drill-down and a dual versioning system, the platform ensures that both market data and internal portfolio decisions are tracked with high fidelity.

---

## 1. Technical Strategy

### 1.1 Hierarchical Geographic Intelligence
The system follows a strict 6-layer drill-down path to ensure granular risk discovery:
- **L1: Country** (Strategic Allocation)
- **L2: Region** (State/Canton level analysis)
- **L3: City** (Urban macro-market dynamics)
- **L4: District** (Neighborhood level risk drivers)
- **L5: Locality** (Micro-location specificity)
- **L6: Micro Market** (Asset-specific immediate surroundings)

**Value Addition:** Users can identify risk "pockets" at a district level that might be obscured by city-level averages.

### 1.2 Dual Versioning System (lifecycle tracking)
- **Data Version (e.g., v2.4):** Reflects the last scheduled refresh of underlying market indices, sentiment data, and third-party risk feeds.
- **Portfolio Version (e.g., v1.3):** Reflects internal state changes. Increments only when a human analyst verifies a risk recommendation or updates an asset's status.

**Value Addition:** Audit-ready transparency. Differentiates between "The market changed" and "We took action."

---

## 2. Risk Scoring & Indicator Logic

### 2.1 Composite Scoring
Scores are calculated on a 0-100 scale using weighted primary drivers:
- **Tenant Roll Risk (50%)**: Weighted by lease expiry and credit rating.
- **Debt Stress (30%)**: Weighted by DSCR and interest rate exposure.
- **NOI Volatility (20%)**: Historical vs. Projected income stability.

### 2.2 Property-Specific Indicators
The system dynamically switches indicator sets based on `propertyType`:
- **Commercial:** Focuses on WALT (Weighted Average Lease Term) and Tenant concentration.
- **Rental/Residential:** Focuses on Occupancy Resilience and Rent Growth vs. Market Index.

---

## 3. Implementation Status (Current Sprint)

| Feature | Status | Value Delivered |
| :--- | :--- | :--- |
| Hierarchical Map | **IMPLEMENTED** | Contextual zoom and breadcrumb navigation. |
| Timeframe Toggle | **IMPLEMENTED** | 3/6/12 Month predictive risk overlays. |
| Version Controls | **IMPLEMENTED** | Manual portfolio bumping and changelog tracking. |
| KPI History Cards | **IMPLEMENTED** | Multi-point trend analysis with confidence bands. |

---

## 4. Future Value: Predictive KPIs
The next phase will introduce machine-learning driven forecasts (Flat/Up/Down) with a drill-down into "Assets at Risk" within the forecast window (3-6 months).
