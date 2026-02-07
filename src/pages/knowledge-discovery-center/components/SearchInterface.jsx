import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const SearchInterface = ({ onSearch, onFilterChange, searchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    researchArea: '',
    publicationType: '',
    dateRange: '',
    language: '',
    difficultyLevel: '',
    author: ''
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);

  const researchAreaOptions = [
    { value: '', label: 'All Research Areas' },
    { value: 'marine-biology', label: 'Marine Biology' },
    { value: 'oceanography', label: 'Oceanography' },
    { value: 'climate-science', label: 'Climate Science' },
    { value: 'fisheries', label: 'Fisheries Science' },
    { value: 'coastal-engineering', label: 'Coastal Engineering' },
    { value: 'marine-geology', label: 'Marine Geology' },
    { value: 'water-quality', label: 'Water Quality' },
    { value: 'marine-conservation', label: 'Marine Conservation' },
    { value: 'aquaculture', label: 'Aquaculture' }
  ];

  const publicationTypeOptions = [
    { value: '', label: 'All Publication Types' },
    { value: 'peer-reviewed', label: 'Peer-Reviewed Papers' },
    { value: 'technical-reports', label: 'Technical Reports' },
    { value: 'policy-briefs', label: 'Policy Briefs' },
    { value: 'educational-materials', label: 'Educational Materials' },
    { value: 'multimedia', label: 'Multimedia Presentations' },
    { value: 'datasets', label: 'Raw Datasets' },
    { value: 'community-knowledge', label: 'Community Knowledge' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'last-5-years', label: 'Last 5 Years' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'sinhala', label: 'Sinhala' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'multilingual', label: 'Multilingual' }
  ];

  const difficultyLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'general', label: 'General Public' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'professional', label: 'Professional' },
    { value: 'expert', label: 'Expert/Research' }
  ];

  const authorOptions = [
    { value: '', label: 'All Authors' },
    { value: 'dr-silva', label: 'Dr. Kumari Silva' },
    { value: 'prof-fernando', label: 'Prof. Ravi Fernando' },
    { value: 'dr-perera', label: 'Dr. Nimal Perera' },
    { value: 'dr-jayawardena', label: 'Dr. Sandya Jayawardena' },
    { value: 'prof-wijesinghe', label: 'Prof. Chaminda Wijesinghe' }
  ];

  const handleSearch = () => {
    const searchData = {
      query: searchQuery,
      filters: selectedFilters
    };
    onSearch(searchData);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSaveSearch = () => {
    if (searchQuery?.trim()) {
      const newSearch = {
        id: Date.now(),
        query: searchQuery,
        filters: selectedFilters,
        timestamp: new Date(),
        resultCount: searchResults?.length || 0
      };
      setSavedSearches(prev => [newSearch, ...prev?.slice(0, 4)]);
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch?.query);
    setSelectedFilters(savedSearch?.filters);
    onSearch({ query: savedSearch?.query, filters: savedSearch?.filters });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilters({
      researchArea: '',
      publicationType: '',
      dateRange: '',
      language: '',
      difficultyLevel: '',
      author: ''
    });
  };

  return (
    <div className="bg-card rounded-lg scientific-border p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search research papers, reports, datasets, and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="text-lg"
            onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={handleSearch}
            iconName="Search"
            iconPosition="left"
            className="px-6"
          >
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            iconName={isAdvancedOpen ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={researchAreaOptions}
          value={selectedFilters?.researchArea}
          onChange={(value) => handleFilterChange('researchArea', value)}
          placeholder="Research Area"
          className="min-w-48"
        />
        <Select
          options={publicationTypeOptions}
          value={selectedFilters?.publicationType}
          onChange={(value) => handleFilterChange('publicationType', value)}
          placeholder="Publication Type"
          className="min-w-48"
        />
        <Select
          options={dateRangeOptions}
          value={selectedFilters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Date Range"
          className="min-w-40"
        />
      </div>
      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-border pt-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Select
              label="Language"
              options={languageOptions}
              value={selectedFilters?.language}
              onChange={(value) => handleFilterChange('language', value)}
            />
            <Select
              label="Difficulty Level"
              options={difficultyLevelOptions}
              value={selectedFilters?.difficultyLevel}
              onChange={(value) => handleFilterChange('difficultyLevel', value)}
            />
            <Select
              label="Author"
              options={authorOptions}
              value={selectedFilters?.author}
              onChange={(value) => handleFilterChange('author', value)}
              searchable
            />
          </div>

          {/* Search Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveSearch}
                iconName="Bookmark"
                iconPosition="left"
                size="sm"
                disabled={!searchQuery?.trim()}
              >
                Save Search
              </Button>
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                iconName="X"
                iconPosition="left"
                size="sm"
              >
                Clear All
              </Button>
            </div>
            
            {searchResults && (
              <div className="text-sm text-text-secondary">
                {searchResults?.length} results found
              </div>
            )}
          </div>
        </div>
      )}
      {/* Saved Searches */}
      {savedSearches?.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Clock" size={16} className="text-text-secondary" />
            <span className="text-sm font-cta-medium text-text-secondary">Recent Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedSearches?.map((search) => (
              <button
                key={search?.id}
                onClick={() => handleLoadSavedSearch(search)}
                className="px-3 py-1 text-xs bg-muted text-text-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-ocean"
              >
                {search?.query} ({search?.resultCount})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;