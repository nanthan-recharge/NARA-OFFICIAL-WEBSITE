import React, { useState, useEffect } from "react";
import SEOHead from '../../components/shared/SEOHead';
import { Link } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Play,
  Save,
  Copy,
  Trash2,
  Target,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  scenarioModelingEngineService,
  impactPredictionSystemService,
  costBenefitAnalysisService,
  riskAssessmentService,
  recommendationEngineService,
} from "../../services/policySimulatorService";

const PolicySimulatorInterface = () => {
  const [activeTab, setActiveTab] = useState("scenario-builder");
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [comparison, setComparison] = useState(null);

  // Scenario form state
  const [policyName, setPolicyName] = useState("");
  const [policyType, setPolicyType] = useState("marine_conservation");
  const [timeframe, setTimeframe] = useState(5);
  const [variables, setVariables] = useState({
    protectedAreaIncrease: 15,
    enforcementIncrease: 25,
    budgetAllocation: 10000000,
    stakeholderEngagement: 80,
  });

  const [financialData, setFinancialData] = useState({
    implementationCost: 50000000,
    annualOperatingCost: 5000000,
    expectedBenefits: {
      economic: 80000000,
      environmental: 60000000,
      social: 40000000,
    },
  });

  async function loadScenarios() {
    // In production, this would fetch from Firestore
    setScenarios([
      {
        scenarioId: "SCENARIO-1",
        policyName: "Marine Conservation Enhancement",
        policyType: "marine_conservation",
        status: "draft",
      },
    ]);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadScenarios();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const createScenario = async () => {
    setLoading(true);

    const baseline = {
      biodiversity: 65,
      fishStocks: 70,
      economicGrowth: 3.5,
      communitySupport: 75,
    };

    const { data: scenarioData } =
      await scenarioModelingEngineService.createScenario(
        policyName,
        policyType,
        variables,
        timeframe,
        baseline,
      );

    if (scenarioData) {
      setCurrentScenario(scenarioData);
      setScenarios([...scenarios, scenarioData]);
      setActiveTab("results");
      await runSimulation(scenarioData.scenarioId);
    }

    setLoading(false);
  };

  const runSimulation = async (scenarioId) => {
    setLoading(true);

    // Get impact prediction
    const { data: impactData } =
      await impactPredictionSystemService.predictImpact(
        scenarioId,
        policyType,
        variables,
        timeframe,
      );

    // Get cost-benefit analysis
    const { data: cbData } = await costBenefitAnalysisService.analyze(
      scenarioId,
      { ...financialData, timeframe },
    );

    // Get risk assessment
    const { data: riskData } = await riskAssessmentService.assessRisks(
      scenarioId,
      policyType,
      variables,
      timeframe,
    );

    // Get recommendations
    const { data: recommendationData } =
      await recommendationEngineService.generateRecommendation(scenarioId, {
        impact: impactData,
        costBenefit: cbData,
        risks: riskData,
      });

    if (impactData && cbData && riskData && recommendationData) {
      setSimulationResults({
        impact: impactData,
        costBenefit: cbData,
        risks: riskData,
        recommendation: recommendationData,
      });
    }

    setLoading(false);
  };

  const compareScenarios = async () => {
    if (scenarios.length < 2) return;

    const scenarioIds = scenarios.map((s) => s.scenarioId);
    const { data } =
      await impactPredictionSystemService.compareScenarios(scenarioIds);

    if (data) {
      setComparison(data);
      setActiveTab("comparison");
    }
  };

  const tabs = [
    { id: "scenario-builder", name: "Scenario Builder", icon: Target },
    { id: "results", name: "Simulation Results", icon: Activity },
    { id: "comparison", name: "Scenario Comparison", icon: BarChart3 },
  ];

  const policyTypes = [
    { value: "marine_conservation", label: "Marine Conservation" },
    { value: "fisheries_management", label: "Fisheries Management" },
    { value: "coastal_tourism", label: "Coastal Tourism" },
    { value: "regulatory_enforcement", label: "Regulatory Enforcement" },
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800 border-green-500";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "high":
        return "bg-red-100 text-red-800 border-red-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case "highly_recommended":
        return "bg-green-50 border-green-500";
      case "recommended":
        return "bg-blue-50 border-blue-500";
      case "conditional":
        return "bg-yellow-50 border-yellow-500";
      case "not_recommended":
        return "bg-red-50 border-red-500";
      default:
        return "bg-gray-50 border-gray-500";
    }
  };

  return (
    <>
      <SEOHead
        title="Policy Simulator"
        description="Simulate marine and fisheries policy outcomes with AI-powered scenario modeling."
        path="/analytics/policy-simulator"
        keywords="policy simulator, fisheries policy, scenario modeling, NARA"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 text-orange-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics Hub
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-10 h-10 text-orange-300" />
                <div>
                  <h1 className="text-4xl font-bold">Policy Simulator</h1>
                  <p className="text-orange-200 mt-1">
                    Model policy changes and predict outcomes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {scenarios.length > 1 && (
                  <button
                    onClick={compareScenarios}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Compare Scenarios
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Builder */}
          {activeTab === "scenario-builder" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Create New Policy Scenario
                </h3>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Policy Name
                      </label>
                      <input
                        type="text"
                        value={policyName}
                        onChange={(e) => setPolicyName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Marine Protected Area Expansion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Policy Type
                      </label>
                      <select
                        value={policyType}
                        onChange={(e) => setPolicyType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {policyTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Timeframe (Years): {timeframe}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={timeframe}
                      onChange={(e) => setTimeframe(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 year</span>
                      <span>20 years</span>
                    </div>
                  </div>

                  {/* Policy Variables */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Policy Variables
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Protected Area Increase (%):{" "}
                          {variables.protectedAreaIncrease}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={variables.protectedAreaIncrease}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              protectedAreaIncrease: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Enforcement Increase (%):{" "}
                          {variables.enforcementIncrease}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={variables.enforcementIncrease}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              enforcementIncrease: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Budget Allocation (LKR)
                        </label>
                        <input
                          type="number"
                          value={variables.budgetAllocation}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              budgetAllocation: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Stakeholder Engagement (%):{" "}
                          {variables.stakeholderEngagement}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={variables.stakeholderEngagement}
                          onChange={(e) =>
                            setVariables({
                              ...variables,
                              stakeholderEngagement: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Data */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Financial Projections
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Implementation Cost (LKR)
                        </label>
                        <input
                          type="number"
                          value={financialData.implementationCost}
                          onChange={(e) =>
                            setFinancialData({
                              ...financialData,
                              implementationCost: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Annual Operating Cost (LKR)
                        </label>
                        <input
                          type="number"
                          value={financialData.annualOperatingCost}
                          onChange={(e) =>
                            setFinancialData({
                              ...financialData,
                              annualOperatingCost: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Economic Benefits (LKR)
                        </label>
                        <input
                          type="number"
                          value={financialData.expectedBenefits.economic}
                          onChange={(e) =>
                            setFinancialData({
                              ...financialData,
                              expectedBenefits: {
                                ...financialData.expectedBenefits,
                                economic: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Environmental Benefits (LKR)
                        </label>
                        <input
                          type="number"
                          value={financialData.expectedBenefits.environmental}
                          onChange={(e) =>
                            setFinancialData({
                              ...financialData,
                              expectedBenefits: {
                                ...financialData.expectedBenefits,
                                environmental: parseInt(e.target.value),
                              },
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t">
                    <button
                      onClick={createScenario}
                      disabled={loading || !policyName}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Run Simulation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Results */}
          {!loading && activeTab === "results" && simulationResults && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Overall Score</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {simulationResults.impact.overallImpact.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Out of 100</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">B/C Ratio</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {simulationResults.costBenefit.bcRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {simulationResults.costBenefit.bcRatio > 1
                      ? "Positive Return"
                      : "Negative Return"}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Risk Level</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 capitalize">
                    {simulationResults.risks.overallRiskLevel}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {simulationResults.risks.totalRisks} risks identified
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600">Confidence</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 capitalize">
                    {simulationResults.impact.confidence}
                  </div>
                </div>
              </div>

              {/* Impact Predictions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Predicted Impacts
                </h3>
                <div className="space-y-4">
                  {Object.entries(simulationResults.impact.predictions).map(
                    ([key, pred]) => (
                      <div
                        key={key}
                        className="border-l-4 border-orange-500 pl-4 py-3 bg-gray-50 rounded"
                      >
                        <div className="font-semibold text-gray-900 capitalize mb-1">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-gray-700">{pred.change}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Timeline: {pred.timeline}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Cost-Benefit Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Financial Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Total Cost</span>
                      <span className="font-bold text-gray-900">
                        LKR{" "}
                        {(
                          simulationResults.costBenefit.totalCost / 1000000
                        ).toFixed(1)}
                        M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Total Benefit</span>
                      <span className="font-bold text-green-600">
                        LKR{" "}
                        {(
                          simulationResults.costBenefit.totalBenefit / 1000000
                        ).toFixed(1)}
                        M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">NPV</span>
                      <span className="font-bold text-blue-600">
                        LKR{" "}
                        {(simulationResults.costBenefit.npv / 1000000).toFixed(
                          1,
                        )}
                        M
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">Payback Period</span>
                      <span className="font-bold text-purple-600">
                        {simulationResults.costBenefit.paybackPeriod} years
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Risk Assessment
                  </h3>
                  <div className="space-y-3">
                    {simulationResults.risks.risks
                      .slice(0, 4)
                      .map((risk, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border-l-4 ${getRiskColor(risk.severity)}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold capitalize">
                              {risk.category}
                            </span>
                            <span className="text-xs font-semibold uppercase">
                              {risk.severity}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {risk.description}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Probability: {(risk.probability * 100).toFixed(0)}%
                            | Impact: {risk.impact}/10
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div
                className={`rounded-xl shadow-lg p-6 border-2 ${getRecommendationColor(simulationResults.recommendation.recommendation)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {simulationResults.recommendation.recommendation ===
                    "highly_recommended" && (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    )}
                  {simulationResults.recommendation.recommendation ===
                    "recommended" && (
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    )}
                  {simulationResults.recommendation.recommendation ===
                    "conditional" && (
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    )}
                  {simulationResults.recommendation.recommendation ===
                    "not_recommended" && (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {simulationResults.recommendation.recommendation.replace(
                      "_",
                      " ",
                    )}
                  </h3>
                </div>

                <p className="text-gray-700 mb-6">
                  {simulationResults.recommendation.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">
                      Implementation Steps
                    </h4>
                    <ol className="space-y-2">
                      {simulationResults.recommendation.implementationSteps.map(
                        (step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-bold text-orange-600">
                              {index + 1}.
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ),
                      )}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">
                      Key Considerations
                    </h4>
                    <ul className="space-y-2">
                      {simulationResults.recommendation.considerations.map(
                        (consideration, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">
                              {consideration}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scenario Comparison */}
          {activeTab === "comparison" && comparison && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Scenario Comparison
                </h3>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">
                    Recommended Scenario
                  </h4>
                  <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                    <div className="text-xl font-bold text-green-900">
                      {comparison.bestScenario}
                    </div>
                    <div className="text-gray-700 mt-2">
                      {comparison.reasoning}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">
                    Comparison Matrix
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-3 text-left">Metric</th>
                          {comparison.rankings.map((scenario, index) => (
                            <th key={index} className="px-4 py-3 text-center">
                              {scenario.scenarioId}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-semibold">
                            Overall Score
                          </td>
                          {comparison.rankings.map((scenario, index) => (
                            <td key={index} className="px-4 py-3 text-center">
                              {scenario.overallScore.toFixed(1)}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b bg-gray-50">
                          <td className="px-4 py-3 font-semibold">Rank</td>
                          {comparison.rankings.map((scenario, index) => (
                            <td
                              key={index}
                              className="px-4 py-3 text-center font-bold"
                            >
                              #{scenario.rank}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PolicySimulatorInterface;
