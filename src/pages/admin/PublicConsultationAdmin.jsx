/**
 * Public Consultation Admin
 *
 * Admin panel for managing public consultations
 * Features:
 * - Create and manage consultations
 * - Review feedback and moderate comments
 * - Create polls and analyze votes
 * - Generate consultation reports
 * - Analytics dashboard
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Users,
  BarChart3,
  Activity,
  Plus,
  Edit,
  Trash,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";

import {
  consultationService,
  feedbackService,
  votingService,
  commentService,
  surveyService,
  analyticsService,
  reportService,
} from "../../services/publicConsultationService";

const PublicConsultationAdmin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [consultations, setConsultations] = useState([]);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [consultationForm, setConsultationForm] = useState({
    title: "",
    description: "",
    category: "marine_policy",
    startDate: "",
    closingDate: "",
  });

  const [pollForm, setPollForm] = useState({
    question: "",
    options: ["", "", ""],
  });

  async function fetchAllData() {
    setLoading(true);

    const [consultationsRes, analyticsRes] = await Promise.all([
      consultationService.getAll(),
      analyticsService.getPlatformAnalytics(),
    ]);

    if (consultationsRes.data) setConsultations(consultationsRes.data);
    if (analyticsRes.data) setPlatformAnalytics(analyticsRes.data);

    setLoading(false);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAllData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleCreateConsultation = async (e) => {
    e.preventDefault();

    const { data, error } = await consultationService.create(consultationForm);

    if (error) {
      alert("Error creating consultation: " + error);
      return;
    }

    alert("Consultation created successfully! ID: " + data.consultationId);
    setConsultationForm({
      title: "",
      description: "",
      category: "marine_policy",
      startDate: "",
      closingDate: "",
    });
    fetchAllData();
  };

  const handleUpdateStatus = async (id, status) => {
    const { error } = await consultationService.updateStatus(id, status);

    if (error) {
      alert("Error updating status: " + error);
      return;
    }

    alert(`Consultation status updated to ${status}!`);
    fetchAllData();
  };

  const handleGenerateReport = async (consultationId) => {
    const { data, error } = await reportService.generate(consultationId);

    if (error) {
      alert("Error generating report: " + error);
      return;
    }

    alert("Report generated successfully!");
    console.log("Report:", data);
  };

  const handleExportFeedback = async (consultationId) => {
    const { data, error } = await reportService.exportCSV(consultationId);

    if (error) {
      alert("Error exporting feedback: " + error);
      return;
    }

    const blob = new Blob([data.csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = data.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    if (!selectedConsultation) {
      alert("Please select a consultation first");
      return;
    }

    const pollData = {
      question: pollForm.question,
      options: pollForm.options.filter((opt) => opt.trim() !== ""),
    };

    const { data, error } = await votingService.createPoll(
      selectedConsultation.consultationId,
      pollData,
    );

    if (error) {
      alert("Error creating poll: " + error);
      return;
    }

    alert("Poll created successfully! Poll ID: " + data.pollId);
    setPollForm({
      question: "",
      options: ["", "", ""],
    });
  };

  // ========== RENDER FUNCTIONS ==========

  const renderDashboard = () => {
    if (!platformAnalytics) return null;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          Public Consultation Dashboard
        </h2>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {platformAnalytics.totalConsultations}
              </span>
            </div>
            <p className="text-blue-100">Total Consultations</p>
            <p className="text-sm text-blue-200 mt-2">
              {platformAnalytics.activeConsultations} active
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {platformAnalytics.totalParticipants.toLocaleString()}
              </span>
            </div>
            <p className="text-green-100">Total Participants</p>
            <p className="text-sm text-green-200 mt-2">All time</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {platformAnalytics.totalFeedback.toLocaleString()}
              </span>
            </div>
            <p className="text-purple-100">Total Feedback</p>
            <p className="text-sm text-purple-200 mt-2">
              {platformAnalytics.totalComments} comments
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {platformAnalytics.totalVotes.toLocaleString()}
              </span>
            </div>
            <p className="text-orange-100">Total Votes</p>
            <p className="text-sm text-orange-200 mt-2">Cast by citizens</p>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Consultations by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(platformAnalytics.consultationsByCategory).map(
              ([category, count]) => (
                <div
                  key={category}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {category.replace("_", " ")}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConsultations = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Consultations
        </h2>

        {/* Create Form */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Create New Consultation
          </h3>

          <form
            onSubmit={handleCreateConsultation}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={consultationForm.title}
                onChange={(e) =>
                  setConsultationForm({
                    ...consultationForm,
                    title: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Public Consultation on Marine Protected Areas"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={consultationForm.description}
                onChange={(e) =>
                  setConsultationForm({
                    ...consultationForm,
                    description: e.target.value,
                  })
                }
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the consultation purpose and what feedback you're seeking..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={consultationForm.category}
                onChange={(e) =>
                  setConsultationForm({
                    ...consultationForm,
                    category: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="marine_policy">Marine Policy</option>
                <option value="environmental">Environmental</option>
                <option value="fisheries">Fisheries</option>
                <option value="conservation">Conservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Date
              </label>
              <input
                type="date"
                value={consultationForm.closingDate}
                onChange={(e) =>
                  setConsultationForm({
                    ...consultationForm,
                    closingDate: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Consultation
              </button>
            </div>
          </form>
        </div>

        {/* Consultations List */}
        <div className="grid grid-cols-1 gap-4">
          {consultations.map((consultation) => (
            <motion.div
              key={consultation.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {consultation.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {consultation.consultationId}
                  </p>
                </div>

                <div className="flex gap-2">
                  {consultation.status === "draft" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(consultation.id, "open")
                      }
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Open
                    </button>
                  )}
                  {consultation.status === "open" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(consultation.id, "closed")
                      }
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleGenerateReport(consultation.consultationId)
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Report
                  </button>
                  <button
                    onClick={() =>
                      handleExportFeedback(consultation.consultationId)
                    }
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Status</p>
                  <p className="text-gray-900 font-semibold">
                    {consultation.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Participants</p>
                  <p className="text-gray-900">
                    {consultation.participantCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Feedback</p>
                  <p className="text-gray-900">
                    {consultation.feedbackCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Comments</p>
                  <p className="text-gray-900">
                    {consultation.commentCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Votes</p>
                  <p className="text-gray-900">{consultation.voteCount || 0}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Loading Consultation Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Public Consultation - Admin
          </h1>
          <p className="text-gray-600 mt-2">
            Manage public consultations and citizen engagement
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Activity },
              {
                id: "consultations",
                label: "Consultations",
                icon: MessageSquare,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "consultations" && renderConsultations()}
      </AnimatePresence>
    </div>
  );
};

export default PublicConsultationAdmin;
