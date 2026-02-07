import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Eye, Edit, Trash2, Plus, Calendar, User, CheckCircle, Clock, AlertTriangle, MoreHorizontal, Tag, Share2 } from 'lucide-react';
import GlassMorphismCard from '../../../components/shared/GlassMorphismCard';
import firebaseAdminService from '../../../services/firebaseAdminService';

const ContentManagementSection = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');

  useEffect(() => {
    loadContent();
  }, [selectedStatus, selectedType, activeTab]);

  const loadContent = async () => {
    try {
      setLoading(true);
      let contentData = [];

      if (activeTab === 'articles') {
        contentData = await firebaseAdminService?.getNewsArticles({
          status: selectedStatus !== 'all' ? selectedStatus : undefined
        });
      }

      setContent(contentData);
    } catch (error) {
      console.error('Error loading content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentAction = async (action, contentId, data = {}) => {
    try {
      switch (action) {
        case 'publish':
          await firebaseAdminService?.updateNewsArticle(contentId, { status: 'published', published_at: new Date()?.toISOString() });
          break;
        case 'unpublish':
          await firebaseAdminService?.updateNewsArticle(contentId, { status: 'draft' });
          break;
        case 'delete':
          await firebaseAdminService?.updateNewsArticle(contentId, { status: 'archived' });
          break;
        case 'view':
          const item = content?.find(c => c?.id === contentId);
          setSelectedContent(item);
          setShowContentModal(true);
          break;
      }
      
      if (action !== 'view') {
        await loadContent();
      }
    } catch (error) {
      console.error(`Error ${action} content:`, error);
    }
  };

  const filteredContent = content?.filter(item => 
    item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    item?.summary?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    item?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-space-grotesk">Content Management</h2>
          <p className="text-gray-600">Manage articles, news, publications, and website content</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Content
          </button>
        </div>
      </div>
      {/* Content Type Tabs */}
      <div className="flex gap-2 p-1 bg-white/50 rounded-lg backdrop-blur-sm">
        {[
          { id: 'articles', label: 'News Articles', count: content?.filter(c => c?.type === 'news')?.length },
          { id: 'research', label: 'Research Publications', count: content?.filter(c => c?.type === 'research')?.length },
          { id: 'announcements', label: 'Announcements', count: content?.filter(c => c?.type === 'announcement')?.length },
          { id: 'media', label: 'Media Gallery', count: 0 }
        ]?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-ocean-600 text-white shadow-md'
                : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
            }`}
          >
            <span>{tab?.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab?.id 
                ? 'bg-ocean-500 text-white' :'bg-gray-200 text-gray-600'
            }`}>
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Search and Filters */}
      <GlassMorphismCard className="p-6" onClick={() => {}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content by title, summary, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e?.target?.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e?.target?.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Categories</option>
              <option value="research">Research</option>
              <option value="news">News</option>
              <option value="announcement">Announcements</option>
              <option value="event">Events</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </GlassMorphismCard>
      {/* Content Grid/List */}
      <GlassMorphismCard className="overflow-hidden" onClick={() => {}}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab?.charAt(0)?.toUpperCase() + activeTab?.slice(1)} ({filteredContent?.length})
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading content...
          </div>
        ) : filteredContent?.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No content found matching your criteria</p>
            <button className="mt-4 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
              Create New Content
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContent?.map((item) => (
              <motion.div
                key={item?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Content Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-br from-ocean-100 to-ocean-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-ocean-600" />
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-800 truncate">
                          {item?.title || 'Untitled Content'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item?.summary || item?.description || 'No description available'}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{item?.author || 'Unknown Author'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(item.created_at || Date.now())?.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{item?.views || 0} views</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {item?.tags && item?.tags?.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {item?.tags?.slice(0, 3)?.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item?.tags?.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{item?.tags?.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item?.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                            {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleContentAction('view', item?.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Content"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleContentAction('delete', item?.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassMorphismCard>
      {/* Content Detail Modal */}
      <AnimatePresence>
        {showContentModal && selectedContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Content Details</h3>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Content Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContent?.status)}`}>
                      {selectedContent?.status?.charAt(0)?.toUpperCase() + selectedContent?.status?.slice(1)}
                    </div>
                    <span className="text-sm text-gray-500">
                      Published {new Date(selectedContent.created_at)?.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    {selectedContent?.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {selectedContent?.summary || selectedContent?.description}
                  </p>
                </div>

                {/* Content Metadata */}
                <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Author Information</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Author: {selectedContent?.author || 'Unknown'}</div>
                      <div>Category: {selectedContent?.category || 'Uncategorized'}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Engagement</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Views: {selectedContent?.views || 0}</div>
                      <div>Last Updated: {new Date(selectedContent.updated_at || selectedContent.created_at)?.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Content Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedContent?.status === 'draft' && (
                    <button
                      onClick={() => handleContentAction('publish', selectedContent?.id)}
                      className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors"
                    >
                      Publish Content
                    </button>
                  )}
                  {selectedContent?.status === 'published' && (
                    <button
                      onClick={() => handleContentAction('unpublish', selectedContent?.id)}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg font-medium transition-colors"
                    >
                      Unpublish
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                    Edit Content
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                    Duplicate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentManagementSection;