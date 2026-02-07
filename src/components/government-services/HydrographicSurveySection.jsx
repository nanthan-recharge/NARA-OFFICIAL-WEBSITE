import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, FileUp, Send, Map as MapIcon, Ruler, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';

/**
 * Hydrographic Survey Section
 * Moved from Maritime Services Hub - Survey requests and bathymetry contributions
 */
const HydrographicSurveySection = () => {
  const [activeTab, setActiveTab] = useState('request'); // request or contribute
  const [surveyForm, setSurveyForm] = useState({
    surveyType: 'bathymetric',
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    surveyArea: '',
    coordinates: '',
    purpose: '',
    startDate: '',
    endDate: '',
    requirements: ''
  });

  const [contributionForm, setContributionForm] = useState({
    contributorName: '',
    organization: '',
    email: '',
    vessel: '',
    sensor: '',
    acquisitionDate: '',
    coverageArea: '',
    dataFormat: 'csv',
    dataFile: null
  });

  const [uploading, setUploading] = useState(false);

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'hydrographic_survey_requests'), {
        ...surveyForm,
        status: 'pending',
        submittedAt: serverTimestamp(),
        requestType: 'survey_request'
      });

      toast.success('Survey request submitted successfully!');
      setSurveyForm({
        surveyType: 'bathymetric',
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        surveyArea: '',
        coordinates: '',
        purpose: '',
        startDate: '',
        endDate: '',
        requirements: ''
      });
    } catch (error) {
      console.error('Error submitting survey request:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let dataFileURL = null;

      // Upload data file if provided
      if (contributionForm.dataFile) {
        const fileRef = ref(storage, `bathymetry_contributions/${Date.now()}_${contributionForm.dataFile.name}`);
        await uploadBytes(fileRef, contributionForm.dataFile);
        dataFileURL = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'bathymetry_contributions'), {
        contributorName: contributionForm.contributorName,
        organization: contributionForm.organization,
        email: contributionForm.email,
        vessel: contributionForm.vessel,
        sensor: contributionForm.sensor,
        acquisitionDate: contributionForm.acquisitionDate,
        coverageArea: contributionForm.coverageArea,
        dataFormat: contributionForm.dataFormat,
        dataFileURL,
        status: 'under_review',
        submittedAt: serverTimestamp()
      });

      toast.success('Bathymetry data submitted successfully!');
      setContributionForm({
        contributorName: '',
        organization: '',
        email: '',
        vessel: '',
        sensor: '',
        acquisitionDate: '',
        coverageArea: '',
        dataFormat: 'csv',
        dataFile: null
      });
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error('Failed to submit contribution. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/30">
          <Waves className="w-6 h-6 text-purple-400" />
          <span className="text-purple-400 font-semibold">Hydrographic Services</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white">
          Survey Requests & Data Contributions
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Request hydrographic surveys or contribute bathymetry data to NARA's seabed model
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setActiveTab('request')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'request'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Request Survey
          </div>
        </button>

        <button
          onClick={() => setActiveTab('contribute')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'contribute'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Contribute Data
          </div>
        </button>
      </div>

      {/* Survey Request Form */}
      {activeTab === 'request' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Request Hydrographic Survey</h3>
            
            <form onSubmit={handleSurveySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Survey Type *
                  </label>
                  <select
                    value={surveyForm.surveyType}
                    onChange={(e) => setSurveyForm({ ...surveyForm, surveyType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="bathymetric">Bathymetric Survey</option>
                    <option value="side_scan">Side Scan Sonar</option>
                    <option value="multibeam">Multibeam Echosounder</option>
                    <option value="sub_bottom">Sub-bottom Profiling</option>
                    <option value="magnetometer">Magnetometer Survey</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={surveyForm.organization}
                    onChange={(e) => setSurveyForm({ ...surveyForm, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={surveyForm.contactName}
                    onChange={(e) => setSurveyForm({ ...surveyForm, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={surveyForm.email}
                    onChange={(e) => setSurveyForm({ ...surveyForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={surveyForm.phone}
                    onChange={(e) => setSurveyForm({ ...surveyForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Purpose *
                  </label>
                  <select
                    value={surveyForm.purpose}
                    onChange={(e) => setSurveyForm({ ...surveyForm, purpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="construction">Marine Construction</option>
                    <option value="research">Scientific Research</option>
                    <option value="exploration">Resource Exploration</option>
                    <option value="navigation">Navigation Safety</option>
                    <option value="environmental">Environmental Study</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={surveyForm.startDate}
                    onChange={(e) => setSurveyForm({ ...surveyForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={surveyForm.endDate}
                    onChange={(e) => setSurveyForm({ ...surveyForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Survey Area *
                </label>
                <input
                  type="text"
                  value={surveyForm.surveyArea}
                  onChange={(e) => setSurveyForm({ ...surveyForm, surveyArea: e.target.value })}
                  placeholder="e.g., Colombo Harbor, Trincomalee Bay"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Coordinates (Optional)
                </label>
                <input
                  type="text"
                  value={surveyForm.coordinates}
                  onChange={(e) => setSurveyForm({ ...surveyForm, coordinates: e.target.value })}
                  placeholder="e.g., 6.9271, 79.8612"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Additional Requirements
                </label>
                <textarea
                  value={surveyForm.requirements}
                  onChange={(e) => setSurveyForm({ ...surveyForm, requirements: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Describe any specific requirements or details..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-6 h-6" />
                Submit Survey Request
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Contribution Form */}
      {activeTab === 'contribute' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-2">Contribute Bathymetry Data</h3>
            <p className="text-slate-400 mb-6">
              Share depth tracks collected by research, commercial, or citizen vessels. 
              We validate submissions against IHO S-100 standards.
            </p>
            
            <form onSubmit={handleContributionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={contributionForm.contributorName}
                    onChange={(e) => setContributionForm({ ...contributionForm, contributorName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={contributionForm.organization}
                    onChange={(e) => setContributionForm({ ...contributionForm, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contributionForm.email}
                    onChange={(e) => setContributionForm({ ...contributionForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Vessel/Platform *
                  </label>
                  <input
                    type="text"
                    value={contributionForm.vessel}
                    onChange={(e) => setContributionForm({ ...contributionForm, vessel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Sensor/Equipment *
                  </label>
                  <input
                    type="text"
                    value={contributionForm.sensor}
                    onChange={(e) => setContributionForm({ ...contributionForm, sensor: e.target.value })}
                    placeholder="e.g., Kongsberg EM2040"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Acquisition Date *
                  </label>
                  <input
                    type="date"
                    value={contributionForm.acquisitionDate}
                    onChange={(e) => setContributionForm({ ...contributionForm, acquisitionDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Coverage Area *
                  </label>
                  <input
                    type="text"
                    value={contributionForm.coverageArea}
                    onChange={(e) => setContributionForm({ ...contributionForm, coverageArea: e.target.value })}
                    placeholder="e.g., Southern coast, 10km²"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Data Format *
                  </label>
                  <select
                    value={contributionForm.dataFormat}
                    onChange={(e) => setContributionForm({ ...contributionForm, dataFormat: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="csv">CSV</option>
                    <option value="xyz">XYZ</option>
                    <option value="las">LAS</option>
                    <option value="geotiff">GeoTIFF</option>
                    <option value="s57">S-57</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Data File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setContributionForm({ ...contributionForm, dataFile: e.target.files[0] })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:cursor-pointer"
                    required
                    accept=".csv,.xyz,.las,.tif,.tiff,.000"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Maximum file size: 100MB. Supported formats: CSV, XYZ, LAS, GeoTIFF, S-57
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileUp className="w-6 h-6" />
                    Submit Contribution
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20">
            <MapIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Data Quality Standards</h4>
            <p className="text-slate-300 text-sm mb-3">
              All bathymetry contributions are validated against IHO S-100 Part 8 standards before integration into NARA's seabed model. 
              Survey requests are reviewed within 5 business days.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="text-slate-400">📧 surveys@nara.gov.lk</span>
              <span className="text-slate-400">📞 +94 11 234 5679</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HydrographicSurveySection;
