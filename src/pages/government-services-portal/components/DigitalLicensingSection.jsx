import React, { useState, useEffect } from 'react';
import { licensingService } from '../../../services/governmentService.js';

const DigitalLicensingSection = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    license_type: '',
    business_name: '',
    contact_details: {
      phone: '',
      email: '',
      address: ''
    },
    application_data: {}
  });

  const licenseTypes = [
    { value: 'commercial_fishing', label: 'Commercial Fishing License', fee: 15000.00 },
    { value: 'marine_research', label: 'Marine Research Permit', fee: 5000.00 },
    { value: 'tourism_operator', label: 'Marine Tourism Operator License', fee: 25000.00 },
    { value: 'port_facility', label: 'Port Facility Operating License', fee: 50000.00 },
    { value: 'vessel_registration', label: 'Vessel Registration Certificate', fee: 8000.00 },
    { value: 'waste_disposal', label: 'Marine Waste Disposal Permit', fee: 20000.00 }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const { data, error } = await licensingService?.getUserApplications();
    if (data) setApplications(data);
    if (error) console.error('Error loading applications:', error);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const selectedLicense = licenseTypes?.find(lt => lt?.value === formData?.license_type);
    
    const applicationData = {
      ...formData,
      fee_amount: selectedLicense?.fee || 0,
      application_data: {
        ...formData?.application_data,
        license_type_label: selectedLicense?.label
      }
    };

    const { data, error } = await licensingService?.create(applicationData);
    
    if (error) {
      alert(`Error creating application: ${error}`);
      return;
    }
    
    setFormData({
      license_type: '',
      business_name: '',
      contact_details: { phone: '', email: '', address: '' },
      application_data: {}
    });
    setShowForm(false);
    loadApplications();
  };

  const handlePayment = async (applicationId, amount) => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      const { error } = await licensingService?.processPayment(applicationId, { amount });
      
      if (error) {
        alert(`Payment failed: ${error}`);
      } else {
        alert('Payment processed successfully!');
        loadApplications();
      }
      setProcessingPayment(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors?.[status] || colors?.draft;
  };

  const getStatusIcon = (status, feePaid) => {
    if (!feePaid && status !== 'draft') return '💳';
    const icons = {
      draft: '📝',
      submitted: '📤',
      under_review: '🔍',
      approved: '✅',
      rejected: '❌'
    };
    return icons?.[status] || '📋';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3]?.map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Digital Licensing Center</h2>
          <p className="text-gray-600 mt-1">Apply for licenses and permits with integrated payment processing</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New License Application
        </button>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-600 text-2xl mr-3">📋</span>
            <div>
              <p className="text-sm text-blue-600">Total Applications</p>
              <p className="text-xl font-semibold text-blue-900">{applications?.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 text-2xl mr-3">✅</span>
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-xl font-semibold text-green-900">
                {applications?.filter(app => app?.status === 'approved')?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 text-2xl mr-3">🔍</span>
            <div>
              <p className="text-sm text-yellow-600">Under Review</p>
              <p className="text-xl font-semibold text-yellow-900">
                {applications?.filter(app => app?.status === 'under_review')?.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 text-2xl mr-3">💳</span>
            <div>
              <p className="text-sm text-red-600">Pending Payment</p>
              <p className="text-xl font-semibold text-red-900">
                {applications?.filter(app => !app?.fee_paid && app?.status === 'submitted')?.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* New Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">New License Application</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Type *
                </label>
                <select
                  required
                  value={formData?.license_type}
                  onChange={(e) => setFormData({ ...formData, license_type: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select license type</option>
                  {licenseTypes?.map((type) => (
                    <option key={type?.value} value={type?.value}>
                      {type?.label} - LKR {type?.fee?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData?.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e?.target?.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter business or organization name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData?.contact_details?.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact_details: { ...formData?.contact_details, phone: e?.target?.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+94771234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData?.contact_details?.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contact_details: { ...formData?.contact_details, email: e?.target?.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData?.contact_details?.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact_details: { ...formData?.contact_details, address: e?.target?.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter complete business address"
                />
              </div>

              {formData?.license_type && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Application Fee: </strong>
                    LKR {licenseTypes?.find(lt => lt?.value === formData?.license_type)?.fee?.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Payment will be processed after application submission
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Applications List */}
      <div className="space-y-4">
        {applications?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">🏛️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No License Applications</h3>
            <p className="text-gray-600 mb-4">Start your first license or permit application</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create First Application
            </button>
          </div>
        ) : (
          applications?.map((app) => (
            <div key={app?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getStatusIcon(app?.status, app?.fee_paid)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{app?.business_name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app?.status)}`}>
                      {app?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    {!app?.fee_paid && app?.status === 'submitted' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        PAYMENT REQUIRED
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-3">{app?.license_type?.replace('_', ' ')?.toUpperCase()}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Application Fee:</span>
                      <p className="text-gray-600">LKR {app?.fee_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Status:</span>
                      <p className={`${app?.fee_paid ? 'text-green-600' : 'text-red-600'}`}>
                        {app?.fee_paid ? 'PAID' : 'PENDING'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">License Number:</span>
                      <p className="text-gray-600">{app?.license_number || 'Not issued'}</p>
                    </div>
                  </div>

                  {app?.issue_date && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Issue Date: </span>
                          <span className="text-gray-600">{new Date(app.issue_date)?.toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Expiry Date: </span>
                          <span className="text-gray-600">{new Date(app.expiry_date)?.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {!app?.fee_paid && app?.status === 'submitted' && (
                    <button
                      onClick={() => handlePayment(app?.id, app?.fee_amount)}
                      disabled={processingPayment}
                      className={`px-3 py-1 text-sm rounded ${
                        processingPayment 
                          ? 'bg-gray-300 text-gray-500' :'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {processingPayment ? 'Processing...' : `Pay LKR ${app?.fee_amount?.toLocaleString()}`}
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                  >
                    View Details
                  </button>
                  
                  {app?.status === 'approved' && app?.license_number && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      📄 Download License
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{selectedApp?.business_name}</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">License Type</h4>
                  <p className="text-gray-600">{selectedApp?.license_type?.replace('_', ' ')?.toUpperCase()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApp?.status)}`}>
                    {selectedApp?.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedApp?.contact_details && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedApp?.contact_details?.phone}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedApp?.contact_details?.email}</p>
                    <p className="text-sm"><span className="font-medium">Address:</span> {selectedApp?.contact_details?.address}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Application Fee</h4>
                  <p className="text-gray-600">LKR {selectedApp?.fee_amount?.toLocaleString()}</p>
                  <p className={`text-sm ${selectedApp?.fee_paid ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedApp?.fee_paid ? '✅ PAID' : '❌ PENDING'}
                  </p>
                </div>
                
                {selectedApp?.license_number && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">License Number</h4>
                    <p className="text-gray-600 font-mono">{selectedApp?.license_number}</p>
                  </div>
                )}
              </div>

              {selectedApp?.issue_date && selectedApp?.expiry_date && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Issue Date</h4>
                    <p className="text-gray-600">{new Date(selectedApp.issue_date)?.toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expiry Date</h4>
                    <p className="text-gray-600">{new Date(selectedApp.expiry_date)?.toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Application Date</h4>
                <p className="text-gray-600">{new Date(selectedApp.created_at)?.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalLicensingSection;