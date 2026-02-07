import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DigitalLibrarySection = ({ userLibrary, onDownload, onView, onRenew }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLibrary = userLibrary?.filter(item => {
    const matchesFilter = filter === 'all' || item?.type === filter;
    const matchesSearch = !searchTerm || 
      item?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'dataset': return 'Database';
      case 'publication': return 'FileText';
      case 'video-course': return 'Play';
      case 'software': return 'Settings';
      default: return 'File';
    }
  };

  const formatFileSize = (size) => {
    if (size?.includes('GB')) return size;
    if (size?.includes('MB')) return size;
    return `${size} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            My Digital Library
          </h2>
          <p className="text-text-secondary">
            Access and manage your purchased research resources
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-64"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="dataset">Datasets</option>
            <option value="publication">Publications</option>
            <option value="video-course">Video Courses</option>
            <option value="software">Software</option>
          </select>
        </div>
      </div>

      {/* Library Items Grid */}
      {filteredLibrary?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLibrary?.map((item) => (
            <div key={item?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={getTypeIcon(item?.type)} size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-lg font-semibold text-text-primary mb-1 line-clamp-2">
                      {item?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="capitalize">{item?.type?.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{item?.format}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                  {item?.status?.replace('-', ' ')}
                </span>
              </div>

              {/* Thumbnail */}
              {item?.thumbnail && (
                <div className="mb-4">
                  <img 
                    src={item?.thumbnail} 
                    alt={item?.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Purchase Date:</span>
                  <span className="text-text-primary">{new Date(item?.purchaseDate)?.toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Access Expires:</span>
                  <span className="text-text-primary">
                    {item?.accessExpiry === 'lifetime' ? 'Lifetime' : new Date(item?.accessExpiry)?.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">File Size:</span>
                  <span className="text-text-primary">{formatFileSize(item?.fileSize)}</span>
                </div>
                
                {item?.downloadCount !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Downloads:</span>
                    <span className="text-text-primary">
                      {item?.downloadCount} of {item?.maxDownloads === 'unlimited' ? '∞' : item?.maxDownloads}
                    </span>
                  </div>
                )}

                {item?.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Progress:</span>
                      <span className="text-text-primary">{item?.progress}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${item?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {item?.integrity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                    <span className="text-green-600">File integrity verified</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item?.collaborativeAccess && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Collaborative Access
                  </span>
                )}
                {item?.offlinePackage && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Offline Package
                  </span>
                )}
                {item?.technicalSupport && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Technical Support
                  </span>
                )}
                {item?.citationRequired && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Citation Required
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => onDownload?.(item)}
                  disabled={item?.downloadCount >= item?.maxDownloads && item?.maxDownloads !== 'unlimited'}
                >
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => onView?.(item)}
                >
                  View Online
                </Button>
                
                {item?.renewalAvailable && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={() => onRenew?.(item)}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    Renew
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Library" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
            {searchTerm || filter !== 'all' ? 'No items found' : 'Your library is empty'}
          </h3>
          <p className="font-body text-text-secondary mb-6 max-w-md mx-auto">
            {searchTerm || filter !== 'all' ?'Try adjusting your search or filter criteria' :'Start building your research collection by browsing our product catalog'
            }
          </p>
          {(!searchTerm && filter === 'all') && (
            <Button
              variant="primary"
              iconName="ShoppingCart"
              iconPosition="left"
              onClick={() => window?.scrollTo(0, 0)}
            >
              Browse Products
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DigitalLibrarySection;