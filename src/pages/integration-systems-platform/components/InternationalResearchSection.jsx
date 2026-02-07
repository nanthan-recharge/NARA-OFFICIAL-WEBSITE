import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Plus, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  MapPin,
  Trash2,
  Edit,
  ExternalLink,
  Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { researchInstitutionsService } from '../../../services/integrationService';

const InternationalResearchSection = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    website_url: '',
    contact_email: '',
    research_areas: [],
    partnership_status: 'pending'
  });
  const [newResearchArea, setNewResearchArea] = useState('');
  const { t } = useTranslation('integration');
  const common = t('common', { returnObjects: true });
  const strings = t('research', { returnObjects: true });

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      const data = await researchInstitutionsService?.getAll();
      setInstitutions(data || []);
    } catch (error) {
      console.error('Error loading institutions:', error);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      if (editingInstitution) {
        // Update existing institution logic would go here
        console.log('Updating institution:', formData);
      } else {
        await researchInstitutionsService?.create(formData);
      }
      
      resetForm();
      loadInstitutions();
    } catch (error) {
      console.error('Error saving institution:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      website_url: '',
      contact_email: '',
      research_areas: [],
      partnership_status: 'pending'
    });
    setNewResearchArea('');
    setShowAddModal(false);
    setEditingInstitution(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await researchInstitutionsService?.updatePartnershipStatus(id, newStatus);
      loadInstitutions();
    } catch (error) {
      console.error('Error updating partnership status:', error);
    }
  };

  const addResearchArea = () => {
    if (newResearchArea?.trim() && !formData?.research_areas?.includes(newResearchArea?.trim())) {
      setFormData({
        ...formData,
        research_areas: [...formData?.research_areas, newResearchArea?.trim()]
      });
      setNewResearchArea('');
    }
  };

  const removeResearchArea = (areaToRemove) => {
    setFormData({
      ...formData,
      research_areas: formData?.research_areas?.filter(area => area !== areaToRemove)
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: strings?.statuses?.active
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: strings?.statuses?.pending
      },
      inactive: {
        color: 'bg-gray-100 text-gray-800',
        icon: Users,
        label: strings?.statuses?.inactive
      }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    const IconComponent = config?.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config?.label}
      </span>
    );
  };

  const getCountryFlag = (country) => {
    const flags = {
      'Iceland': '🇮🇸',
      'Germany': '🇩🇪',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Norway': '🇳🇴',
      'United Kingdom': '🇬🇧',
      'Netherlands': '🇳🇱'
    };
    return flags?.[country] || '🌍';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Globe className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{strings?.title}</h2>
            <p className="text-sm text-gray-600">{strings?.subtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {strings?.actions?.add}
        </button>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">{strings?.stats?.total}</p>
              <p className="text-2xl font-bold text-blue-900">{institutions?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">{strings?.stats?.active}</p>
              <p className="text-2xl font-bold text-green-900">
                {institutions?.filter(i => i?.partnership_status === 'active')?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">{strings?.stats?.pending}</p>
              <p className="text-2xl font-bold text-yellow-900">
                {institutions?.filter(i => i?.partnership_status === 'pending')?.length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">{strings?.stats?.countries}</p>
              <p className="text-2xl font-bold text-purple-900">
                {[...new Set(institutions?.map(i => i?.country))]?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Research Areas Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 text-indigo-600 mr-2" />
          {strings?.researchAreas?.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {[...new Set(institutions?.flatMap(i => i?.research_areas || []))]?.map((area) => (
            <span
              key={area}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
      {/* Institutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {institutions?.map((institution) => (
          <div key={institution?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{getCountryFlag(institution?.country)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{institution?.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {institution?.country}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  {getStatusBadge(institution?.partnership_status)}
                </div>
                
                {/* Research Areas */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {strings?.cards?.researchAreas}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {institution?.research_areas?.slice(0, 3)?.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {area}
                      </span>
                    ))}
                    {institution?.research_areas?.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600">
                        {t('research.cards.moreAreas', {
                          count: institution?.research_areas?.length - 3
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="text-sm text-gray-600 space-y-1">
                  {institution?.contact_email && (
                    <p className="flex items-center">
                      <Users className="w-3 h-3 mr-2" />
                      {institution?.contact_email}
                    </p>
                  )}
                  {institution?.website_url && (
                    <p className="flex items-center">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      <a 
                        href={institution?.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {strings?.links?.visit}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => {
                    setEditingInstitution(institution);
                    setFormData({
                      name: institution?.name,
                      country: institution?.country,
                      website_url: institution?.website_url || '',
                      contact_email: institution?.contact_email || '',
                      research_areas: institution?.research_areas || [],
                      partnership_status: institution?.partnership_status
                    });
                    setShowAddModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title={strings?.actions?.edit}
                  aria-label={strings?.actions?.edit}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title={strings?.actions?.delete}
                  aria-label={strings?.actions?.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {institution?.established_at && (
                    <p className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {strings?.labels?.partnershipSince}{' '}
                      {new Date(institution.established_at)?.getFullYear()}
                    </p>
                  )}
                  {institution?.data_sharing_agreements?.length > 0 && (
                    <p className="flex items-center mt-1">
                      <FileText className="w-3 h-3 mr-1" />
                      {t('research.labels.agreements', {
                        count: institution?.data_sharing_agreements?.length
                      })}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {institution?.partnership_status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(institution?.id, 'active')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
                    >
                      {strings?.actions?.approve}
                    </button>
                  )}
                  {institution?.partnership_status === 'active' && (
                    <button
                      onClick={() => handleStatusChange(institution?.id, 'inactive')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {strings?.actions?.suspend}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {institutions?.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{strings?.empty?.title}</h3>
          <p className="text-gray-500 mb-4">{strings?.empty?.description}</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {strings?.empty?.cta}
          </button>
        </div>
      )}
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingInstitution ? strings?.modal?.editTitle : strings?.modal?.createTitle}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData?.name}
                  onChange={(e) => setFormData({...formData, name: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.country}
                </label>
                <input
                  type="text"
                  required
                  value={formData?.country}
                  onChange={(e) => setFormData({...formData, country: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.country}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.website}
                </label>
                <input
                  type="url"
                  value={formData?.website_url}
                  onChange={(e) => setFormData({...formData, website_url: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.website}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.email}
                </label>
                <input
                  type="email"
                  value={formData?.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={strings?.modal?.placeholders?.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.status}
                </label>
                <select
                  value={formData?.partnership_status}
                  onChange={(e) => setFormData({...formData, partnership_status: e?.target?.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">{strings?.statuses?.pending}</option>
                  <option value="active">{strings?.statuses?.active}</option>
                  <option value="inactive">{strings?.statuses?.inactive}</option>
                </select>
              </div>

              {/* Research Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {strings?.modal?.fields?.areas}
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newResearchArea}
                    onChange={(e) => setNewResearchArea(e?.target?.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={strings?.modal?.placeholders?.area}
                    onKeyPress={(e) => e?.key === 'Enter' && (e?.preventDefault(), addResearchArea())}
                  />
                  <button
                    type="button"
                    onClick={addResearchArea}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {common?.actions?.add}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData?.research_areas?.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removeResearchArea(area)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {common?.actions?.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingInstitution
                    ? strings?.modal?.actions?.update
                    : strings?.modal?.actions?.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternationalResearchSection;
