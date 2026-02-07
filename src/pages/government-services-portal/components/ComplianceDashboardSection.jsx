import React, { useState, useEffect } from 'react';
import { complianceService } from '../../../services/governmentService.js';

const ComplianceDashboardSection = () => {
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const [recordsResult, analyticsResult] = await Promise.all([
      complianceService?.getUserRecords(),
      complianceService?.getAnalytics()
    ]);

    if (recordsResult?.data) setComplianceRecords(recordsResult?.data);
    if (analyticsResult?.data) setAnalytics(analyticsResult?.data);
    
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-yellow-100 border-yellow-200';
    if (score >= 70) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const calculateAverageScore = () => {
    if (complianceRecords?.length === 0) return 0;
    const total = complianceRecords?.reduce((sum, record) => sum + (record?.compliance_score || 0), 0);
    return Math.round(total / complianceRecords?.length);
  };

  const getOverdueRecords = () => {
    return complianceRecords?.filter(record => 
      record?.due_date && new Date(record.due_date) < new Date() && !record?.completed_date
    ) || [];
  };

  const getUpcomingDeadlines = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow?.setDate(thirtyDaysFromNow?.getDate() + 30);
    
    return complianceRecords?.filter(record => 
      record?.due_date && 
      new Date(record.due_date) <= thirtyDaysFromNow && 
      new Date(record.due_date) >= new Date() &&
      !record?.completed_date
    ) || [];
  };

  const getTrendData = () => {
    // Simple trend calculation based on recent records
    const recentRecords = analytics?.slice(0, 10) || [];
    if (recentRecords?.length < 2) return 0;
    
    const oldAvg = recentRecords?.slice(5)?.reduce((sum, r) => sum + (r?.compliance_score || 0), 0) / Math.max(recentRecords?.slice(5)?.length, 1);
    const newAvg = recentRecords?.slice(0, 5)?.reduce((sum, r) => sum + (r?.compliance_score || 0), 0) / Math.max(recentRecords?.slice(0, 5)?.length, 1);
    
    return newAvg - oldAvg;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4]?.map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overdueRecords = getOverdueRecords();
  const upcomingDeadlines = getUpcomingDeadlines();
  const averageScore = calculateAverageScore();
  const trend = getTrendData();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Monitoring Dashboard</h2>
        <p className="text-gray-600 mt-1">Real-time compliance metrics, violation tracking, and predictive analytics</p>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}%
              </p>
              <p className={`text-xs ${getScoreColor(averageScore)}`}>
                {getScoreLabel(averageScore)}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{complianceRecords?.length}</p>
              <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)?.toFixed(1)} trend
              </p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Items</p>
              <p className={`text-2xl font-bold ${overdueRecords?.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {overdueRecords?.length}
              </p>
              <p className="text-xs text-gray-500">Immediate attention needed</p>
            </div>
            <div className="text-3xl">{overdueRecords?.length > 0 ? '⚠️' : '✅'}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Deadlines</p>
              <p className={`text-2xl font-bold ${upcomingDeadlines?.length > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {upcomingDeadlines?.length}
              </p>
              <p className="text-xs text-gray-500">Next 30 days</p>
            </div>
            <div className="text-3xl">🕒</div>
          </div>
        </div>
      </div>
      {/* Alerts Section */}
      {(overdueRecords?.length > 0 || upcomingDeadlines?.length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance Alerts</h3>
          <div className="space-y-3">
            {overdueRecords?.map((record) => (
              <div key={record?.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">{record?.compliance_type} - OVERDUE</h4>
                    <p className="text-sm text-red-700">
                      Due: {new Date(record.due_date)?.toLocaleDateString()} 
                      ({Math.ceil((new Date() - new Date(record.due_date)) / (1000 * 60 * 60 * 24))} days overdue)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}

            {upcomingDeadlines?.slice(0, 3)?.map((record) => (
              <div key={record?.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-600 text-xl">🕒</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900">{record?.compliance_type} - Due Soon</h4>
                    <p className="text-sm text-yellow-700">
                      Due: {new Date(record.due_date)?.toLocaleDateString()}
                      ({Math.ceil((new Date(record.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days remaining)
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Compliance Records */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Records</h3>
        
        {complianceRecords?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Records</h3>
            <p className="text-gray-600 mb-4">Compliance monitoring data will appear here when available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complianceRecords?.map((record) => (
              <div key={record?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{record?.compliance_type}</h3>
                      <div className={`px-3 py-1 rounded-full border ${getScoreBgColor(record?.compliance_score)}`}>
                        <span className={`text-sm font-medium ${getScoreColor(record?.compliance_score)}`}>
                          {record?.compliance_score}% - {getScoreLabel(record?.compliance_score)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <p className={`${record?.due_date && new Date(record.due_date) < new Date() && !record?.completed_date ? 'text-red-600' : 'text-gray-600'}`}>
                          {record?.due_date ? new Date(record.due_date)?.toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <p className={`${record?.completed_date ? 'text-green-600' : 'text-yellow-600'}`}>
                          {record?.completed_date ? 'Completed' : 'In Progress'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Inspector:</span>
                        <p className="text-gray-600">{record?.inspector?.full_name || 'Not assigned'}</p>
                      </div>
                    </div>

                    {record?.violations && Array.isArray(record?.violations) && record?.violations?.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium text-red-700">Violations Found:</span>
                        <div className="mt-1 space-y-1">
                          {record?.violations?.map((violation, index) => (
                            <div key={index} className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                              <span className="font-medium">{violation?.type}:</span> {violation?.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {record?.corrective_actions && (
                      <div className="mb-4">
                        <span className="font-medium text-gray-700">Corrective Actions:</span>
                        <p className="text-gray-600 text-sm mt-1">{record?.corrective_actions}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                    >
                      View Details
                    </button>
                    
                    {!record?.completed_date && record?.due_date && new Date(record.due_date) < new Date() && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded text-center">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{selectedRecord?.compliance_type}</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Compliance Score</h4>
                  <div className={`px-4 py-2 rounded-lg border ${getScoreBgColor(selectedRecord?.compliance_score)}`}>
                    <span className={`text-lg font-bold ${getScoreColor(selectedRecord?.compliance_score)}`}>
                      {selectedRecord?.compliance_score}%
                    </span>
                    <span className={`ml-2 text-sm ${getScoreColor(selectedRecord?.compliance_score)}`}>
                      {getScoreLabel(selectedRecord?.compliance_score)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <p className={`text-lg ${selectedRecord?.completed_date ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedRecord?.completed_date ? '✅ Completed' : '🔄 In Progress'}
                  </p>
                </div>
              </div>

              {selectedRecord?.assessment_data && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Assessment Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Object.entries(selectedRecord?.assessment_data)?.map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key?.replace('_', ' ')}:
                        </span>
                        <span className="text-sm text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord?.violations && Array.isArray(selectedRecord?.violations) && selectedRecord?.violations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Violations</h4>
                  <div className="space-y-2">
                    {selectedRecord?.violations?.map((violation, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h5 className="font-medium text-red-900">{violation?.type}</h5>
                        <p className="text-sm text-red-700">{violation?.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord?.corrective_actions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Corrective Actions</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{selectedRecord?.corrective_actions}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Due Date</h4>
                  <p className={`${selectedRecord?.due_date && new Date(selectedRecord.due_date) < new Date() && !selectedRecord?.completed_date ? 'text-red-600' : 'text-gray-600'}`}>
                    {selectedRecord?.due_date ? new Date(selectedRecord.due_date)?.toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                
                {selectedRecord?.completed_date && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Completion Date</h4>
                    <p className="text-green-600">{new Date(selectedRecord.completed_date)?.toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedRecord?.inspector && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Inspector</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{selectedRecord?.inspector?.full_name}</p>
                    <p className="text-sm text-gray-600">{selectedRecord?.inspector?.email}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Record Created</h4>
                <p className="text-gray-600">{new Date(selectedRecord.created_at)?.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceDashboardSection;