/**
 * Economic Valuation Tool Service
 *
 * Calculate blue economy contributions and economic value
 * for NARA Digital Ocean Platform - Phase 5
 *
 * Service Modules:
 * 1. Blue Economy Calculator - GDP contribution
 * 2. Tourism Revenue Tracker - Tourism economics
 * 3. Fisheries Value Assessment - Fisheries economics
 * 4. Employment Impact Analyzer - Job creation metrics
 * 5. Investment Return Modeler - Investment analysis
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== 1. BLUE ECONOMY CALCULATOR SERVICE ==========

export const blueEconomyCalculatorService = {
  /**
   * Calculate blue economy GDP contribution
   */
  calculate: async (economicData, year) => {
    try {
      const {
        fisheries,
        tourism,
        shipping,
        aquaculture,
        research,
        conservation
      } = economicData;

      // Direct economic value
      const directValue = {
        fisheries: fisheries?.directRevenue || 0,
        tourism: tourism?.directRevenue || 0,
        shipping: shipping?.directRevenue || 0,
        aquaculture: aquaculture?.directRevenue || 0,
        research: research?.directRevenue || 0,
        conservation: conservation?.directRevenue || 0
      };

      const totalDirect = Object.values(directValue).reduce((a, b) => a + b, 0);

      // Indirect value (multiplier effect = 1.5x)
      const indirectMultiplier = 1.5;
      const totalIndirect = totalDirect * indirectMultiplier;

      // Ecosystem services value
      const ecosystemServices = {
        carbonSequestration: conservation?.carbonValue || 0,
        biodiversity: conservation?.biodiversityValue || 0,
        coastalProtection: conservation?.coastalProtectionValue || 0,
        waterPurification: conservation?.waterPurificationValue || 0
      };

      const totalEcosystemServices = Object.values(ecosystemServices).reduce((a, b) => a + b, 0);

      // Total blue economy value
      const totalValue = totalDirect + totalIndirect + totalEcosystemServices;

      // Calculate as % of GDP (assuming Sri Lanka GDP ~80 billion USD)
      const nationalGDP = 80000000000; // 80 billion USD
      const gdpContribution = (totalValue / nationalGDP) * 100;

      const valuationData = {
        valuationId: `ECON-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        year,
        directValue: {
          ...directValue,
          total: totalDirect
        },
        indirectValue: totalIndirect,
        ecosystemServices: {
          ...ecosystemServices,
          total: totalEcosystemServices
        },
        totalValue,
        gdpContribution: gdpContribution.toFixed(3),
        breakdown: calculateBreakdown(directValue, totalDirect),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'economic_valuations'), valuationData);

      return {
        data: {
          id: docRef.id,
          ...valuationData
        },
        error: null
      };
    } catch (error) {
      console.error('Error calculating blue economy value:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get economic valuations by year
   */
  getByYear: async (year) => {
    try {
      const q = query(
        collection(db, 'economic_valuations'),
        where('year', '==', year),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const valuations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: valuations, error: null };
    } catch (error) {
      console.error('Error fetching valuations:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Compare year-over-year growth
   */
  compareYears: async (year1, year2) => {
    try {
      const { data: val1 } = await blueEconomyCalculatorService.getByYear(year1);
      const { data: val2 } = await blueEconomyCalculatorService.getByYear(year2);

      if (!val1 || val1.length === 0 || !val2 || val2.length === 0) {
        return { data: null, error: 'Insufficient data for comparison' };
      }

      const value1 = val1[0].totalValue;
      const value2 = val2[0].totalValue;

      const growth = ((value2 - value1) / value1) * 100;

      return {
        data: {
          year1,
          year2,
          value1,
          value2,
          growth: growth.toFixed(2),
          trend: growth > 0 ? 'increasing' : 'decreasing'
        },
        error: null
      };
    } catch (error) {
      console.error('Error comparing years:', error);
      return { data: null, error: error.message };
    }
  }
};

/**
 * Calculate sector breakdown percentages
 */
const calculateBreakdown = (directValue, total) => {
  const breakdown = {};
  Object.keys(directValue).forEach(sector => {
    breakdown[sector] = total > 0 ? ((directValue[sector] / total) * 100).toFixed(2) : 0;
  });
  return breakdown;
};

// ========== 2. TOURISM REVENUE TRACKER SERVICE ==========

export const tourismRevenueTrackerService = {
  /**
   * Track tourism revenue
   */
  track: async (revenueData) => {
    try {
      const {
        period, // monthly, quarterly, annual
        marineAttractions,
        divingSnorkeling,
        boatTours,
        resorts,
        restaurants,
        transportation
      } = revenueData;

      const totalRevenue = (marineAttractions || 0) + (divingSnorkeling || 0) +
                           (boatTours || 0) + (resorts || 0) +
                           (restaurants || 0) + (transportation || 0);

      const revenueRecord = {
        recordId: `TOURISM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        period,
        revenue: {
          marineAttractions: marineAttractions || 0,
          divingSnorkeling: divingSnorkeling || 0,
          boatTours: boatTours || 0,
          resorts: resorts || 0,
          restaurants: restaurants || 0,
          transportation: transportation || 0,
          total: totalRevenue
        },
        recordedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'tourism_revenue'), revenueRecord);

      return {
        data: {
          id: docRef.id,
          ...revenueRecord
        },
        error: null
      };
    } catch (error) {
      console.error('Error tracking tourism revenue:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get revenue projections
   */
  project: async (historicalData, periodsAhead = 12) => {
    try {
      if (historicalData.length < 6) {
        return { data: null, error: 'Insufficient historical data for projection' };
      }

      const revenues = historicalData.map(d => d.revenue.total);

      // Simple linear projection
      const avgGrowth = (revenues[revenues.length - 1] - revenues[0]) / revenues.length;
      const projections = [];

      for (let i = 1; i <= periodsAhead; i++) {
        const projectedValue = revenues[revenues.length - 1] + (avgGrowth * i);
        projections.push({
          period: i,
          projected: Math.max(0, projectedValue),
          confidence: 1 - (i / periodsAhead) * 0.3 // Decreasing confidence
        });
      }

      return {
        data: {
          historicalAvg: revenues.reduce((a, b) => a + b, 0) / revenues.length,
          projections,
          avgGrowth
        },
        error: null
      };
    } catch (error) {
      console.error('Error projecting tourism revenue:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 3. FISHERIES VALUE ASSESSMENT SERVICE ==========

export const fisheriesValueAssessmentService = {
  /**
   * Assess fisheries economic value
   */
  assess: async (fisheriesData) => {
    try {
      const {
        catchVolume, // in tons
        avgPricePerTon,
        exportValue,
        domesticSales,
        processingValue,
        employedFishermen
      } = fisheriesData;

      // Calculate direct value
      const totalCatchValue = (catchVolume || 0) * (avgPricePerTon || 0);
      const directValue = totalCatchValue + (exportValue || 0) + (domesticSales || 0);

      // Value added through processing
      const valueAdded = processingValue || (totalCatchValue * 0.3); // 30% value addition

      // Economic multiplier (fisheries typically 2.5x)
      const multiplierEffect = directValue * 2.5;

      // Per-fisher productivity
      const perFisherValue = employedFishermen > 0 ? directValue / employedFishermen : 0;

      const assessmentData = {
        assessmentId: `FISH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        catchVolume,
        avgPricePerTon,
        directValue,
        valueAdded,
        multiplierEffect,
        totalEconomicValue: directValue + valueAdded + multiplierEffect,
        employmentMetrics: {
          employedFishermen,
          perFisherValue,
          productivityRating: perFisherValue > 50000 ? 'high' : perFisherValue > 30000 ? 'medium' : 'low'
        },
        assessedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'fisheries_valuations'), assessmentData);

      return {
        data: {
          id: docRef.id,
          ...assessmentData
        },
        error: null
      };
    } catch (error) {
      console.error('Error assessing fisheries value:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Calculate sustainability index
   */
  calculateSustainabilityIndex: async (catchData, stockLevels) => {
    try {
      // Compare catch vs sustainable yield
      const sustainableYield = stockLevels.msy || 0; // Maximum Sustainable Yield
      const actualCatch = catchData.catchVolume || 0;

      const utilizationRate = sustainableYield > 0 ? (actualCatch / sustainableYield) * 100 : 0;

      const sustainability = {
        utilizationRate: utilizationRate.toFixed(2),
        status: utilizationRate < 70 ? 'underfished' :
                utilizationRate < 90 ? 'optimal' :
                utilizationRate < 110 ? 'near_limit' : 'overfished',
        recommendation: utilizationRate > 90 ?
          'Reduce fishing pressure to maintain stocks' :
          'Current levels sustainable'
      };

      return { data: sustainability, error: null };
    } catch (error) {
      console.error('Error calculating sustainability index:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 4. EMPLOYMENT IMPACT ANALYZER SERVICE ==========

export const employmentImpactAnalyzerService = {
  /**
   * Analyze employment impact
   */
  analyze: async (employmentData) => {
    try {
      const {
        sector,
        directJobs,
        indirectJobs,
        avgSalary,
        seasonalWorkers,
        region
      } = employmentData;

      const totalJobs = (directJobs || 0) + (indirectJobs || 0) + (seasonalWorkers || 0);

      // Calculate economic impact
      const directWageImpact = (directJobs || 0) * (avgSalary || 0);
      const indirectWageImpact = (indirectJobs || 0) * (avgSalary * 0.8); // 80% of direct
      const seasonalWageImpact = (seasonalWorkers || 0) * (avgSalary * 0.6); // 60% of direct

      const totalWageImpact = directWageImpact + indirectWageImpact + seasonalWageImpact;

      // Multiplier effect on local economy (jobs typically 1.8x)
      const economicMultiplier = totalWageImpact * 1.8;

      const analysisData = {
        analysisId: `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        sector,
        region,
        employment: {
          directJobs,
          indirectJobs,
          seasonalWorkers,
          totalJobs
        },
        economicImpact: {
          directWageImpact,
          indirectWageImpact,
          seasonalWageImpact,
          totalWageImpact,
          economicMultiplier,
          totalEconomicImpact: totalWageImpact + economicMultiplier
        },
        perJobValue: totalJobs > 0 ? (totalWageImpact + economicMultiplier) / totalJobs : 0,
        rating: totalJobs > 10000 ? 'major' : totalJobs > 5000 ? 'significant' : totalJobs > 1000 ? 'moderate' : 'small',
        analyzedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'employment_analyses'), analysisData);

      return {
        data: {
          id: docRef.id,
          ...analysisData
        },
        error: null
      };
    } catch (error) {
      console.error('Error analyzing employment impact:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Get aggregated employment statistics
   */
  getAggregated: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'employment_analyses'));
      const analyses = snapshot.docs.map(doc => doc.data());

      const totalJobs = analyses.reduce((sum, a) => sum + (a.employment?.totalJobs || 0), 0);
      const totalEconomicImpact = analyses.reduce((sum, a) => sum + (a.economicImpact?.totalEconomicImpact || 0), 0);

      const bySector = {};
      analyses.forEach(a => {
        if (!bySector[a.sector]) {
          bySector[a.sector] = { jobs: 0, impact: 0 };
        }
        bySector[a.sector].jobs += a.employment?.totalJobs || 0;
        bySector[a.sector].impact += a.economicImpact?.totalEconomicImpact || 0;
      });

      return {
        data: {
          totalJobs,
          totalEconomicImpact,
          avgPerJobValue: totalJobs > 0 ? totalEconomicImpact / totalJobs : 0,
          bySector
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting aggregated employment stats:', error);
      return { data: null, error: error.message };
    }
  }
};

// ========== 5. INVESTMENT RETURN MODELER SERVICE ==========

export const investmentReturnModelerService = {
  /**
   * Model investment returns
   */
  model: async (investmentData) => {
    try {
      const {
        investmentAmount,
        projectType,
        timeframe, // years
        expectedAnnualReturn,
        riskLevel // low, medium, high
      } = investmentData;

      // Calculate returns
      const annualReturns = [];
      let cumulativeReturn = investmentAmount;

      for (let year = 1; year <= timeframe; year++) {
        const yearReturn = cumulativeReturn * (expectedAnnualReturn / 100);
        cumulativeReturn += yearReturn;

        annualReturns.push({
          year,
          return: yearReturn,
          cumulative: cumulativeReturn,
          roi: ((cumulativeReturn - investmentAmount) / investmentAmount * 100).toFixed(2)
        });
      }

      const finalReturn = cumulativeReturn - investmentAmount;
      const totalROI = (finalReturn / investmentAmount) * 100;
      const annualizedROI = totalROI / timeframe;

      // Risk-adjusted return (Sharpe ratio approximation)
      const riskFreeRate = 5; // 5% risk-free rate
      const riskPremium = annualizedROI - riskFreeRate;
      const riskMultiplier = riskLevel === 'high' ? 20 : riskLevel === 'medium' ? 10 : 5;
      const sharpeRatio = riskPremium / riskMultiplier;

      const modelData = {
        modelId: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        investmentAmount,
        projectType,
        timeframe,
        expectedAnnualReturn,
        riskLevel,
        projectedReturns: {
          annualReturns,
          finalReturn,
          totalROI: totalROI.toFixed(2),
          annualizedROI: annualizedROI.toFixed(2)
        },
        riskAnalysis: {
          sharpeRatio: sharpeRatio.toFixed(2),
          rating: sharpeRatio > 1 ? 'excellent' : sharpeRatio > 0.5 ? 'good' : 'fair',
          riskAdjustedReturn: (annualizedROI / (riskMultiplier / 10)).toFixed(2)
        },
        breakEvenYear: calculateBreakEvenYear(investmentAmount, expectedAnnualReturn),
        recommendation: generateInvestmentRecommendation(totalROI, sharpeRatio, riskLevel),
        modeledAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'investment_models'), modelData);

      return {
        data: {
          id: docRef.id,
          ...modelData
        },
        error: null
      };
    } catch (error) {
      console.error('Error modeling investment returns:', error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Compare investment scenarios
   */
  compareScenarios: async (scenario1, scenario2) => {
    try {
      const { data: model1 } = await investmentReturnModelerService.model(scenario1);
      const { data: model2 } = await investmentReturnModelerService.model(scenario2);

      if (!model1 || !model2) {
        return { data: null, error: 'Error modeling scenarios' };
      }

      const comparison = {
        scenario1: {
          name: scenario1.name || 'Scenario 1',
          totalROI: model1.projectedReturns.totalROI,
          sharpeRatio: model1.riskAnalysis.sharpeRatio,
          breakEven: model1.breakEvenYear
        },
        scenario2: {
          name: scenario2.name || 'Scenario 2',
          totalROI: model2.projectedReturns.totalROI,
          sharpeRatio: model2.riskAnalysis.sharpeRatio,
          breakEven: model2.breakEvenYear
        },
        better: parseFloat(model1.riskAnalysis.sharpeRatio) > parseFloat(model2.riskAnalysis.sharpeRatio) ?
          'scenario1' : 'scenario2',
        recommendation: parseFloat(model1.riskAnalysis.sharpeRatio) > parseFloat(model2.riskAnalysis.sharpeRatio) ?
          `${scenario1.name || 'Scenario 1'} offers better risk-adjusted returns` :
          `${scenario2.name || 'Scenario 2'} offers better risk-adjusted returns`
      };

      return { data: comparison, error: null };
    } catch (error) {
      console.error('Error comparing scenarios:', error);
      return { data: null, error: error.message };
    }
  }
};

/**
 * Calculate break-even year
 */
const calculateBreakEvenYear = (investment, annualReturn) => {
  if (annualReturn <= 0) return null;

  let cumulative = investment;
  let year = 0;

  while (cumulative < investment * 2 && year < 50) {
    year++;
    cumulative += cumulative * (annualReturn / 100);
  }

  return year;
};

/**
 * Generate investment recommendation
 */
const generateInvestmentRecommendation = (totalROI, sharpeRatio, riskLevel) => {
  if (parseFloat(sharpeRatio) > 1 && parseFloat(totalROI) > 50) {
    return 'Highly recommended - Excellent risk-adjusted returns';
  } else if (parseFloat(sharpeRatio) > 0.5 && parseFloat(totalROI) > 30) {
    return 'Recommended - Good returns with acceptable risk';
  } else if (riskLevel === 'high' && parseFloat(sharpeRatio) < 0.5) {
    return 'Caution - High risk without proportional returns';
  } else {
    return 'Consider alternatives - Moderate returns for risk level';
  }
};

// ========== EXPORT ALL SERVICES ==========

export default {
  blueEconomyCalculatorService,
  tourismRevenueTrackerService,
  fisheriesValueAssessmentService,
  employmentImpactAnalyzerService,
  investmentReturnModelerService
};
