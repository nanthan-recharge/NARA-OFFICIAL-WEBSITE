import React, { useState } from 'react';
import { Loader2, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { seedAllPhase4Data } from '../../utils/seedPhase4Data';

const Phase4DataSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeedData = async () => {
    setSeeding(true);
    setResult(null);

    try {
      const seedResult = await seedAllPhase4Data();
      setResult(seedResult);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Phase 4 Data Seeder
              </h1>
              <p className="text-gray-600 mt-1">
                Populate Phase 4 collections with sample data for testing
              </p>
            </div>
          </div>
        </div>

        {/* What Will Be Seeded */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            What Will Be Created:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                📋 Public Consultation Portal
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 4 Sample Consultations (3 open, 1 closed)</li>
                <li>• 3 Feedback submissions with sentiments</li>
                <li>• 2 Comments with likes</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🔬 Research Collaboration Hub
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3 Researcher profiles (2 verified, 1 pending)</li>
                <li>• Multiple specializations and interests</li>
                <li>• Ready for matchmaking testing</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                🤝 Industry Partnership Dashboard
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 2 Industry partners</li>
                <li>• Aquaculture and Technology sectors</li>
                <li>• Ready for proposal submissions</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                📚 Educational Outreach Platform
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3 Educational content items</li>
                <li>• 2 Student competitions</li>
                <li>• 2 Upcoming webinars</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">
                Important Notes:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• This will create real data in your Firebase Firestore database</li>
                <li>• Run this only once to avoid duplicate entries</li>
                <li>• Sample data uses example.com URLs for documents and media</li>
                <li>• Check the browser console for detailed seeding logs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seed Button */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
              seeding
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {seeding ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Seeding Data... Check Console
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <Database className="w-6 h-6" />
                Seed Phase 4 Data
              </span>
            )}
          </button>

          {/* Result */}
          {result && (
            <div
              className={`mt-6 p-6 rounded-lg border-2 ${
                result.success
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.success
                      ? '✅ Data Seeded Successfully!'
                      : '❌ Seeding Failed'}
                  </h3>
                  {result.success ? (
                    <div className="text-sm text-green-800 space-y-1">
                      <p>Sample data has been added to all Phase 4 collections.</p>
                      <p className="font-semibold mt-3">Next Steps:</p>
                      <ul className="list-disc list-inside">
                        <li>Visit the Public Consultation Portal to see consultations</li>
                        <li>Test filtering, feedback submission, and comments</li>
                        <li>Try the multi-language switcher (EN/SI/TA)</li>
                        <li>Check the Admin Panel for analytics and reports</li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-red-800">
                      Error: {result.error || 'Unknown error occurred'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        {result?.success && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/public-consultation-portal"
                className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span className="font-semibold text-blue-900">
                  📋 Public Consultation Portal
                </span>
                <p className="text-sm text-blue-700 mt-1">Test public interface</p>
              </a>
              <a
                href="/admin/public-consultation"
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <span className="font-semibold text-green-900">
                  ⚙️ Admin Panel
                </span>
                <p className="text-sm text-green-700 mt-1">
                  Manage consultations and view analytics
                </p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Phase4DataSeeder;
