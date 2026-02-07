import React, { useState, useEffect } from 'react';
import { collaborationService } from '../../../services/governmentService.js';

const InterAgencyCollaborationSection = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: '',
    description: '',
    lead_agency: '',
    participating_agencies: [],
    project_timeline: {},
    budget_allocation: {}
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium'
  });

  const agencyTypes = [
    { value: 'environmental', label: 'Environmental Protection Agency', icon: '🌱' },
    { value: 'marine', label: 'Marine & Coastal Authority', icon: '🌊' },
    { value: 'research', label: 'Research & Development', icon: '🔬' },
    { value: 'regulatory', label: 'Regulatory Affairs', icon: '📋' },
    { value: 'emergency', label: 'Emergency Management', icon: '🚨' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'green' },
    { value: 'medium', label: 'Medium Priority', color: 'yellow' },
    { value: 'high', label: 'High Priority', color: 'orange' },
    { value: 'critical', label: 'Critical', color: 'red' }
  ];

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadWorkspaceTasks(selectedWorkspace?.id);
      loadWorkspaceMessages(selectedWorkspace?.id);
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    setLoading(true);
    const { data, error } = await collaborationService?.getUserWorkspaces();
    if (data) setWorkspaces(data);
    if (error) console.error('Error loading workspaces:', error);
    setLoading(false);
  };

  const loadWorkspaceTasks = async (workspaceId) => {
    const { data, error } = await collaborationService?.getWorkspaceTasks(workspaceId);
    if (data) setTasks(data);
    if (error) console.error('Error loading tasks:', error);
  };

  const loadWorkspaceMessages = async (workspaceId) => {
    const { data, error } = await collaborationService?.getMessages(workspaceId);
    if (data) setMessages(data);
    if (error) console.error('Error loading messages:', error);
  };

  const handleWorkspaceSubmit = async (e) => {
    e?.preventDefault();
    const { data, error } = await collaborationService?.createWorkspace(workspaceFormData);
    
    if (error) {
      alert(`Error creating workspace: ${error}`);
      return;
    }
    
    setWorkspaceFormData({
      name: '',
      description: '',
      lead_agency: '',
      participating_agencies: [],
      project_timeline: {},
      budget_allocation: {}
    });
    setShowWorkspaceForm(false);
    loadWorkspaces();
  };

  const handleTaskSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedWorkspace) return;
    
    const taskData = {
      ...taskFormData,
      workspace_id: selectedWorkspace?.id
    };
    
    const { data, error } = await collaborationService?.createTask(taskData);
    
    if (error) {
      alert(`Error creating task: ${error}`);
      return;
    }
    
    setTaskFormData({
      title: '',
      description: '',
      assigned_to: '',
      due_date: '',
      priority: 'medium'
    });
    setShowTaskForm(false);
    loadWorkspaceTasks(selectedWorkspace?.id);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!selectedWorkspace || !messageText?.trim()) return;
    
    const messageData = {
      workspace_id: selectedWorkspace?.id,
      message_content: messageText?.trim(),
      message_type: 'text'
    };
    
    const { data, error } = await collaborationService?.sendMessage(messageData);
    
    if (error) {
      alert(`Error sending message: ${error}`);
      return;
    }
    
    setMessageText('');
    loadWorkspaceMessages(selectedWorkspace?.id);
  };

  const toggleParticipatingAgency = (agency) => {
    const agencies = workspaceFormData?.participating_agencies?.includes(agency)
      ? workspaceFormData?.participating_agencies?.filter(a => a !== agency)
      : [...workspaceFormData?.participating_agencies, agency];
    
    setWorkspaceFormData({ ...workspaceFormData, participating_agencies: agencies });
  };

  const getAgencyInfo = (agencyValue) => {
    return agencyTypes?.find(a => a?.value === agencyValue) || { label: agencyValue, icon: '🏛️' };
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels?.find(p => p?.value === priority);
    return level?.color || 'gray';
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      on_hold: 'bg-yellow-100 text-yellow-700'
    };
    return colors?.[status] || colors?.draft;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inter-Agency Collaboration</h2>
          <p className="text-gray-600 mt-1">Shared workspaces, document management, and cross-departmental coordination</p>
        </div>
        <button
          onClick={() => setShowWorkspaceForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          + Create Workspace
        </button>
      </div>
      {!selectedWorkspace ? (
        // Workspace Selection View
        (<div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900">{workspaces?.length}</p>
                </div>
                <div className="text-3xl">🏛️</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-green-600">
                    {workspaces?.filter(w => w?.status === 'active')?.length}
                  </p>
                </div>
                <div className="text-3xl">🚀</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">My Workspaces</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {workspaces?.filter(w => w?.members?.some(m => m?.member))?.length}
                  </p>
                </div>
                <div className="text-3xl">👤</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agencies Involved</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {new Set(workspaces?.flatMap(w => [w.lead_agency, ...(w.participating_agencies || [])]))?.size}
                  </p>
                </div>
                <div className="text-3xl">🤝</div>
              </div>
            </div>
          </div>
          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces?.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl">🤝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Collaboration Workspaces</h3>
                <p className="text-gray-600 mb-4">Create your first inter-agency collaboration workspace</p>
                <button
                  onClick={() => setShowWorkspaceForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create First Workspace
                </button>
              </div>
            ) : (
              workspaces?.map((workspace) => (
                <div key={workspace?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedWorkspace(workspace)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{workspace?.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workspace?.status)}`}>
                        {workspace?.status?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl">{getAgencyInfo(workspace?.lead_agency)?.icon}</div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workspace?.description}</p>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Lead Agency:</span>
                      <p className="text-sm text-gray-700">{getAgencyInfo(workspace?.lead_agency)?.label}</p>
                    </div>

                    {workspace?.participating_agencies && workspace?.participating_agencies?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Participating:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {workspace?.participating_agencies?.slice(0, 3)?.map((agency, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {getAgencyInfo(agency)?.icon} {getAgencyInfo(agency)?.label}
                            </span>
                          ))}
                          {workspace?.participating_agencies?.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{workspace?.participating_agencies?.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-medium text-gray-500">Members:</span>
                      <p className="text-sm text-gray-700">{workspace?.members?.length || 0} active members</p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-gray-500">Created:</span>
                      <p className="text-sm text-gray-700">{new Date(workspace.created_at)?.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Enter Workspace →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>)
      ) : (
        // Workspace Detail View
        (<div>
          {/* Workspace Header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedWorkspace(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
                <div className="text-3xl">{getAgencyInfo(selectedWorkspace?.lead_agency)?.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedWorkspace?.name}</h2>
                  <p className="text-sm text-gray-600">Led by {getAgencyInfo(selectedWorkspace?.lead_agency)?.label}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                + Add Task
              </button>
            </div>

            <p className="text-gray-600 mb-4">{selectedWorkspace?.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkspace?.status)}`}>
                  {selectedWorkspace?.status?.replace('_', ' ')?.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Members:</span>
                <span className="ml-2 text-sm text-gray-700">{selectedWorkspace?.members?.length || 0} active</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <span className="ml-2 text-sm text-gray-700">{new Date(selectedWorkspace.created_at)?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Tasks & Activities</h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {tasks?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-gray-600 text-sm">No tasks yet</p>
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      Create first task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks?.map((task) => (
                      <div key={task?.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{task?.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(task?.priority)}-100 text-${getPriorityColor(task?.priority)}-700`}>
                                {task?.priority?.toUpperCase()}
                              </span>
                            </div>
                            {task?.description && (
                              <p className="text-sm text-gray-600 mb-2">{task?.description}</p>
                            )}
                            <div className="text-xs text-gray-500">
                              {task?.assignee?.full_name && (
                                <span>Assigned to: {task?.assignee?.full_name} • </span>
                              )}
                              {task?.due_date && (
                                <span>Due: {new Date(task.due_date)?.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-2">
                            {task?.completed ? (
                              <span className="text-green-600 text-xl">✅</span>
                            ) : (
                              <span className="text-gray-400 text-xl">⭕</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Team Communication</h3>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto">
                {messages?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-600 text-sm">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages?.map((message) => (
                      <div key={message?.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {message?.sender?.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{message?.sender?.full_name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.sent_at)?.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message?.message_content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e?.target?.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!messageText?.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 text-sm"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>)
      )}
      {/* New Workspace Form Modal */}
      {showWorkspaceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Create New Collaboration Workspace</h3>
            </div>
            
            <form onSubmit={handleWorkspaceSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  required
                  value={workspaceFormData?.name}
                  onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, name: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter workspace name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workspaceFormData?.description}
                  onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the collaboration objectives and scope"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Agency *
                </label>
                <select
                  required
                  value={workspaceFormData?.lead_agency}
                  onChange={(e) => setWorkspaceFormData({ ...workspaceFormData, lead_agency: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select lead agency</option>
                  {agencyTypes?.map((agency) => (
                    <option key={agency?.value} value={agency?.value}>
                      {agency?.icon} {agency?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participating Agencies
                </label>
                <div className="space-y-2">
                  {agencyTypes?.map((agency) => (
                    <label key={agency?.value} className="flex items-center space-x-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workspaceFormData?.participating_agencies?.includes(agency?.value)}
                        onChange={() => toggleParticipatingAgency(agency?.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm">{agency?.icon} {agency?.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowWorkspaceForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* New Task Form Modal */}
      {showTaskForm && selectedWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Add New Task</h3>
              <p className="text-sm text-gray-600">Workspace: {selectedWorkspace?.name}</p>
            </div>
            
            <form onSubmit={handleTaskSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskFormData?.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={taskFormData?.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the task details and requirements"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={taskFormData?.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {priorityLevels?.map((level) => (
                      <option key={level?.value} value={level?.value}>
                        {level?.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskFormData?.due_date}
                    onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e?.target?.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterAgencyCollaborationSection;