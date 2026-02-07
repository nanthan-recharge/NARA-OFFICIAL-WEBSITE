import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  projectsService,
  milestonesService,
  outputsService,
  budgetTrackingService,
  projectTimelineService,
  projectPipelineDashboardService,
  projectFileService
} from '../../services/projectPipelineService';

const ProjectPipelineAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'projects' | 'create' | 'edit'
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'milestone' | 'output' | 'expense' | 'timeline' | 'rag'

  // Project Form
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    division: '',
    principalInvestigator: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    fundingSource: '',
    status: 'planning',
    ragStatus: 'green',
    visibility: 'internal',
    objectives: '',
    expectedOutcomes: '',
    keywords: '',
    team: []
  });

  // Milestone Form
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    targetDate: '',
    deliverables: ''
  });

  // Output Form
  const [outputForm, setOutputForm] = useState({
    type: 'publication',
    title: '',
    description: '',
    url: '',
    doi: '',
    publishedDate: ''
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
    approvedBy: ''
  });

  // Timeline Event Form
  const [timelineForm, setTimelineForm] = useState({
    type: 'update',
    title: '',
    description: '',
    date: '',
    createdBy: 'Admin'
  });

  // RAG Status Form
  const [ragForm, setRAGForm] = useState({
    ragStatus: 'green',
    ragNotes: ''
  });

  useEffect(() => {
    loadProjects();
    loadDashboardStats();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await projectsService.getAll();
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const loadDashboardStats = async () => {
    const { data, error } = await projectPipelineDashboardService.getStatistics('all');
    if (!error && data) {
      setDashboardStats(data);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...projectForm,
      totalBudget: parseFloat(projectForm.totalBudget) || 0,
      keywords: projectForm.keywords.split(',').map(k => k.trim()).filter(k => k),
      team: projectForm.team
    };

    const { data, error } = await projectsService.create(projectData);
    if (error) {
      alert('Error creating project: ' + error.message);
    } else {
      alert('Project created successfully! Project ID: ' + data.projectId);
      resetProjectForm();
      loadProjects();
      loadDashboardStats();
      setActiveTab('projects');
    }
    setLoading(false);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...projectForm,
      totalBudget: parseFloat(projectForm.totalBudget) || 0,
      keywords: typeof projectForm.keywords === 'string'
        ? projectForm.keywords.split(',').map(k => k.trim()).filter(k => k)
        : projectForm.keywords
    };

    const { error } = await projectsService.update(selectedProject.id, projectData);
    if (error) {
      alert('Error updating project: ' + error.message);
    } else {
      alert('Project updated successfully!');
      loadProjects();
      loadDashboardStats();
      setActiveTab('projects');
      setSelectedProject(null);
    }
    setLoading(false);
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    setLoading(true);

    const milestoneData = {
      ...milestoneForm,
      deliverables: milestoneForm.deliverables.split(',').map(d => d.trim()).filter(d => d)
    };

    const { error } = await milestonesService.add(selectedProject.id, milestoneData);
    if (error) {
      alert('Error adding milestone: ' + error.message);
    } else {
      alert('Milestone added successfully!');
      await refreshSelectedProject();
      setShowModal(false);
      resetMilestoneForm();
    }
    setLoading(false);
  };

  const handleUpdateMilestoneStatus = async (milestoneId, status) => {
    const { error } = await milestonesService.updateStatus(
      selectedProject.id,
      milestoneId,
      status,
      status === 'completed' ? new Date().toISOString() : null
    );
    if (error) {
      alert('Error updating milestone: ' + error.message);
    } else {
      await refreshSelectedProject();
    }
  };

  const handleAddOutput = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await outputsService.add(selectedProject.id, outputForm);
    if (error) {
      alert('Error adding output: ' + error.message);
    } else {
      alert('Output added successfully!');
      await refreshSelectedProject();
      setShowModal(false);
      resetOutputForm();
    }
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    const expenseData = {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount) || 0
    };

    const { error } = await budgetTrackingService.updateExpenditure(selectedProject.id, expenseData);
    if (error) {
      alert('Error adding expense: ' + error.message);
    } else {
      alert('Expense recorded successfully!');
      await refreshSelectedProject();
      loadDashboardStats();
      setShowModal(false);
      resetExpenseForm();
    }
    setLoading(false);
  };

  const handleAddTimelineEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await projectTimelineService.addEvent(selectedProject.id, timelineForm);
    if (error) {
      alert('Error adding timeline event: ' + error.message);
    } else {
      alert('Timeline event added successfully!');
      await refreshSelectedProject();
      setShowModal(false);
      resetTimelineForm();
    }
    setLoading(false);
  };

  const handleUpdateRAGStatus = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await projectsService.updateRAGStatus(
      selectedProject.id,
      ragForm.ragStatus,
      ragForm.ragNotes
    );
    if (error) {
      alert('Error updating RAG status: ' + error.message);
    } else {
      alert('RAG status updated successfully!');
      await refreshSelectedProject();
      loadDashboardStats();
      setShowModal(false);
      resetRAGForm();
    }
    setLoading(false);
  };

  const refreshSelectedProject = async () => {
    const { data } = await projectsService.getById(selectedProject.id);
    if (data) {
      setSelectedProject(data);
      // Update in projects list
      setProjects(prev => prev.map(p => p.id === data.id ? data : p));
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      division: '',
      principalInvestigator: '',
      startDate: '',
      endDate: '',
      totalBudget: '',
      fundingSource: '',
      status: 'planning',
      ragStatus: 'green',
      visibility: 'internal',
      objectives: '',
      expectedOutcomes: '',
      keywords: '',
      team: []
    });
  };

  const resetMilestoneForm = () => {
    setMilestoneForm({
      title: '',
      description: '',
      targetDate: '',
      deliverables: ''
    });
  };

  const resetOutputForm = () => {
    setOutputForm({
      type: 'publication',
      title: '',
      description: '',
      url: '',
      doi: '',
      publishedDate: ''
    });
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      category: '',
      amount: '',
      description: '',
      date: '',
      approvedBy: ''
    });
  };

  const resetTimelineForm = () => {
    setTimelineForm({
      type: 'update',
      title: '',
      description: '',
      date: '',
      createdBy: 'Admin'
    });
  };

  const resetRAGForm = () => {
    setRAGForm({
      ragStatus: 'green',
      ragNotes: ''
    });
  };

  const loadProjectForEdit = (project) => {
    setSelectedProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      division: project.division,
      principalInvestigator: project.principalInvestigator,
      startDate: project.startDate,
      endDate: project.endDate,
      totalBudget: project.totalBudget?.toString() || '',
      fundingSource: project.fundingSource,
      status: project.status,
      ragStatus: project.ragStatus,
      visibility: project.visibility,
      objectives: project.objectives || '',
      expectedOutcomes: project.expectedOutcomes || '',
      keywords: Array.isArray(project.keywords) ? project.keywords.join(', ') : '',
      team: project.team || []
    });
    setActiveTab('edit');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-8">
        <Icons.Activity className="w-12 h-12 mb-3 opacity-90" />
        <h1 className="text-3xl font-bold mb-2">Project Pipeline Admin</h1>
        <p className="text-blue-100">Manage research projects, milestones, budgets, and outputs</p>
      </div>

      {dashboardStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Icons.FolderOpen}
              label="Total Projects"
              value={dashboardStats.overview.totalProjects}
              color="blue"
            />
            <StatCard
              icon={Icons.Activity}
              label="Active Projects"
              value={dashboardStats.overview.activeProjects}
              color="green"
            />
            <StatCard
              icon={Icons.CheckCircle}
              label="Completed"
              value={dashboardStats.overview.completedProjects}
              color="purple"
            />
            <StatCard
              icon={Icons.DollarSign}
              label="Total Budget"
              value={formatCurrency(dashboardStats.overview.totalBudget)}
              color="indigo"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">RAG Status Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-700 mb-1">{dashboardStats.ragStatus.green}</div>
                <div className="text-sm text-green-600">Green (On Track)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-yellow-700 mb-1">{dashboardStats.ragStatus.amber}</div>
                <div className="text-sm text-yellow-600">Amber (At Risk)</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-700 mb-1">{dashboardStats.ragStatus.red}</div>
                <div className="text-sm text-red-600">Red (Critical)</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveTab('create')}
          className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.Plus className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Create New Project</h3>
          <p className="text-green-100">Start tracking a new research project</p>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 hover:shadow-2xl transition-all"
        >
          <Icons.List className="w-12 h-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Manage Projects</h3>
          <p className="text-blue-100">View and update existing projects</p>
        </button>
      </div>
    </div>
  );

  // Projects List Tab
  const renderProjects = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Projects</h2>
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Icons.Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-500">{project.projectId}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.status === 'active' ? 'bg-green-100 text-green-700' :
                        project.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status.toUpperCase()}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        project.ragStatus === 'green' ? 'bg-green-500' :
                        project.ragStatus === 'amber' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className={`text-xs font-semibold ${
                        project.ragStatus === 'green' ? 'text-green-700' :
                        project.ragStatus === 'amber' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {project.ragStatus.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>PI: {project.principalInvestigator}</span>
                      <span>Budget: {formatCurrency(project.totalBudget || 0)}</span>
                      <span>Progress: {project.completionPercentage || 0}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab('projects');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Details"
                    >
                      <Icons.Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => loadProjectForEdit(project)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Edit Project"
                    >
                      <Icons.Edit className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Sidebar */}
      {selectedProject && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Icons.X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setModalType('rag');
                  setRAGForm({ ragStatus: selectedProject.ragStatus, ragNotes: selectedProject.ragNotes || '' });
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Icons.AlertCircle className="w-6 h-6 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Update RAG</span>
              </button>
              <button
                onClick={() => {
                  setModalType('milestone');
                  resetMilestoneForm();
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Icons.Target className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Add Milestone</span>
              </button>
              <button
                onClick={() => {
                  setModalType('output');
                  resetOutputForm();
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Icons.FileText className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Add Output</span>
              </button>
              <button
                onClick={() => {
                  setModalType('expense');
                  resetExpenseForm();
                  setExpenseForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Icons.DollarSign className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-700">Add Expense</span>
              </button>
              <button
                onClick={() => {
                  setModalType('timeline');
                  resetTimelineForm();
                  setTimelineForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
                  setShowModal(true);
                }}
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Icons.Clock className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Add Event</span>
              </button>
              <button
                onClick={() => loadProjectForEdit(selectedProject)}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icons.Edit className="w-6 h-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Edit Project</span>
              </button>
            </div>

            {/* Milestones */}
            {selectedProject.milestones && selectedProject.milestones.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Milestones</h3>
                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone) => (
                    <div key={milestone.milestoneId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{milestone.title}</p>
                        <p className="text-sm text-gray-600">Target: {formatDate(milestone.targetDate)}</p>
                      </div>
                      <select
                        value={milestone.status}
                        onChange={(e) => handleUpdateMilestoneStatus(milestone.milestoneId, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Summary */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Budget Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-semibold">{formatCurrency(selectedProject.totalBudget || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-semibold text-green-600">{formatCurrency(selectedProject.budgetSpent || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency((selectedProject.totalBudget || 0) - (selectedProject.budgetSpent || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Create/Edit Project Form
  const renderProjectForm = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {activeTab === 'create' ? 'Create New Project' : 'Edit Project'}
        </h2>

        <form onSubmit={activeTab === 'create' ? handleCreateProject : handleUpdateProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title*</label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
              <textarea
                required
                rows={4}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Division*</label>
              <select
                required
                value={projectForm.division}
                onChange={(e) => setProjectForm({ ...projectForm, division: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Division</option>
                <option value="Marine Biology & Ecosystems">Marine Biology & Ecosystems</option>
                <option value="Fisheries Science">Fisheries Science</option>
                <option value="Aquaculture">Aquaculture</option>
                <option value="Environmental Monitoring">Environmental Monitoring</option>
                <option value="Post-Harvest & Quality">Post-Harvest & Quality</option>
                <option value="Hydrography">Hydrography</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Investigator*</label>
              <input
                type="text"
                required
                value={projectForm.principalInvestigator}
                onChange={(e) => setProjectForm({ ...projectForm, principalInvestigator: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date*</label>
              <input
                type="date"
                required
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date*</label>
              <input
                type="date"
                required
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (LKR)*</label>
              <input
                type="number"
                required
                value={projectForm.totalBudget}
                onChange={(e) => setProjectForm({ ...projectForm, totalBudget: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Source*</label>
              <input
                type="text"
                required
                value={projectForm.fundingSource}
                onChange={(e) => setProjectForm({ ...projectForm, fundingSource: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
              <select
                required
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RAG Status*</label>
              <select
                required
                value={projectForm.ragStatus}
                onChange={(e) => setProjectForm({ ...projectForm, ragStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="green">Green (On Track)</option>
                <option value="amber">Amber (At Risk)</option>
                <option value="red">Red (Critical)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility*</label>
              <select
                required
                value={projectForm.visibility}
                onChange={(e) => setProjectForm({ ...projectForm, visibility: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="internal">Internal Only</option>
                <option value="public">Public (Transparency)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
              <input
                type="text"
                value={projectForm.keywords}
                onChange={(e) => setProjectForm({ ...projectForm, keywords: e.target.value })}
                placeholder="e.g., marine conservation, coral reefs, biodiversity"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : activeTab === 'create' ? 'Create Project' : 'Update Project'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('projects');
                resetProjectForm();
                setSelectedProject(null);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal Renderer
  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {modalType === 'milestone' && 'Add Milestone'}
                {modalType === 'output' && 'Add Research Output'}
                {modalType === 'expense' && 'Record Expense'}
                {modalType === 'timeline' && 'Add Timeline Event'}
                {modalType === 'rag' && 'Update RAG Status'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-6 h-6" />
              </button>
            </div>

            {modalType === 'milestone' && (
              <form onSubmit={handleAddMilestone} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    required
                    rows={3}
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date*</label>
                  <input
                    type="date"
                    required
                    value={milestoneForm.targetDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deliverables (comma-separated)</label>
                  <input
                    type="text"
                    value={milestoneForm.deliverables}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, deliverables: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? 'Adding...' : 'Add Milestone'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === 'output' && (
              <form onSubmit={handleAddOutput} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Type*</label>
                  <select
                    required
                    value={outputForm.type}
                    onChange={(e) => setOutputForm({ ...outputForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="publication">Publication</option>
                    <option value="report">Report</option>
                    <option value="dataset">Dataset</option>
                    <option value="patent">Patent</option>
                    <option value="software">Software</option>
                    <option value="policy_brief">Policy Brief</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                  <input
                    type="text"
                    required
                    value={outputForm.title}
                    onChange={(e) => setOutputForm({ ...outputForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={outputForm.description}
                    onChange={(e) => setOutputForm({ ...outputForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="url"
                    value={outputForm.url}
                    onChange={(e) => setOutputForm({ ...outputForm, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DOI</label>
                  <input
                    type="text"
                    value={outputForm.doi}
                    onChange={(e) => setOutputForm({ ...outputForm, doi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                  <input
                    type="date"
                    value={outputForm.publishedDate}
                    onChange={(e) => setOutputForm({ ...outputForm, publishedDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? 'Adding...' : 'Add Output'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === 'expense' && (
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                  <select
                    required
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="personnel">Personnel</option>
                    <option value="equipment">Equipment</option>
                    <option value="consumables">Consumables</option>
                    <option value="travel">Travel</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (LKR)*</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    required
                    rows={3}
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approved By*</label>
                  <input
                    type="text"
                    required
                    value={expenseForm.approvedBy}
                    onChange={(e) => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? 'Recording...' : 'Record Expense'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === 'timeline' && (
              <form onSubmit={handleAddTimelineEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type*</label>
                  <select
                    required
                    value={timelineForm.type}
                    onChange={(e) => setTimelineForm({ ...timelineForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="milestone">Milestone</option>
                    <option value="update">Update</option>
                    <option value="issue">Issue</option>
                    <option value="achievement">Achievement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                  <input
                    type="text"
                    required
                    value={timelineForm.title}
                    onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    required
                    rows={3}
                    value={timelineForm.description}
                    onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                  <input
                    type="date"
                    required
                    value={timelineForm.date}
                    onChange={(e) => setTimelineForm({ ...timelineForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? 'Adding...' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === 'rag' && (
              <form onSubmit={handleUpdateRAGStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RAG Status*</label>
                  <select
                    required
                    value={ragForm.ragStatus}
                    onChange={(e) => setRAGForm({ ...ragForm, ragStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="green">Green (On Track)</option>
                    <option value="amber">Amber (At Risk)</option>
                    <option value="red">Red (Critical)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Notes*</label>
                  <textarea
                    required
                    rows={4}
                    value={ragForm.ragNotes}
                    onChange={(e) => setRAGForm({ ...ragForm, ragNotes: e.target.value })}
                    placeholder="Explain the current status and any issues or progress updates..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? 'Updating...' : 'Update RAG Status'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Manage Projects
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'projects' && renderProjects()}
          {(activeTab === 'create' || activeTab === 'edit') && renderProjectForm()}
        </AnimatePresence>

        {/* Modal */}
        {renderModal()}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 shadow-lg`}>
      <Icon className="w-10 h-10 mb-3 opacity-90" />
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

export default ProjectPipelineAdmin;
