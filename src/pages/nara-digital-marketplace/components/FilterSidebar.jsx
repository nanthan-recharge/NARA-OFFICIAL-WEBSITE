import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { cn } from '../../../utils/cn';

const FilterSidebar = ({ filters = {}, onFilterChange, onClearAll, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters?.priceRange?.min || '',
    max: filters?.priceRange?.max || ''
  });

  const categories = [
    { id: 'research-publications', name: 'Research Publications', count: 45 },
    { id: 'digital-datasets', name: 'Digital Datasets', count: 23 },
    { id: 'training-programs', name: 'Training Programs', count: 18 },
    { id: 'consultation-services', name: 'Consultation Services', count: 12 },
    { id: 'marine-charts', name: 'Marine Charts', count: 34 },
    { id: 'educational-materials', name: 'Educational Materials', count: 29 },
    { id: 'gis-maps', name: 'GIS Maps', count: 16 },
    { id: 'photography', name: 'Photography', count: 52 }
  ];

  const divisions = [
    { id: 'marine-research', name: 'Marine Research Division' },
    { id: 'coastal-studies', name: 'Coastal Studies Division' },
    { id: 'oceanography', name: 'Oceanography Division' },
    { id: 'marine-biology', name: 'Marine Biology Division' },
    { id: 'maritime-safety', name: 'Maritime Safety Division' },
    { id: 'environmental-monitoring', name: 'Environmental Monitoring Division' }
  ];

  const productTypes = [
    { id: 'digital', name: 'Digital Products' },
    { id: 'physical', name: 'Physical Products' },
    { id: 'services', name: 'Services' }
  ];

  const availability = [
    { id: 'available', name: 'Available' },
    { id: 'limited', name: 'Limited Stock' },
    { id: 'pre-order', name: 'Pre-order' }
  ];

  const handlePriceRangeChange = (field, value) => {
    const newRange = { ...priceRange, [field]: value };
    setPriceRange(newRange);
    onFilterChange?.('priceRange', newRange);
  };

  const handleCheckboxChange = (filterType, value, checked) => {
    const currentValues = filters?.[filterType] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFilterChange?.(filterType, newValues);
  };

  const isChecked = (filterType, value) => {
    return filters?.[filterType]?.includes(value) || false;
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters?.categories?.length) count += filters?.categories?.length;
    if (filters?.divisions?.length) count += filters?.divisions?.length;
    if (filters?.productTypes?.length) count += filters?.productTypes?.length;
    if (filters?.availability?.length) count += filters?.availability?.length;
    if (filters?.priceRange?.min || filters?.priceRange?.max) count += 1;
    return count;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Filter Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:shadow-none lg:w-full overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Filter" size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {getFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
              iconName="X"
            />
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              Price Range (LKR)
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange?.min}
                onChange={(e) => handlePriceRangeChange('min', e?.target?.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange?.max}
                onChange={(e) => handlePriceRangeChange('max', e?.target?.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Grid3x3" size={16} />
              Categories
            </h3>
            
            <div className="space-y-3">
              {categories?.map((category) => (
                <label key={category?.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked('categories', category?.id)}
                      onChange={(e) => handleCheckboxChange('categories', category?.id, e?.target?.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                      {category?.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category?.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Research Divisions */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Building2" size={16} />
              Research Divisions
            </h3>
            
            <div className="space-y-3">
              {divisions?.map((division) => (
                <label key={division?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked('divisions', division?.id)}
                    onChange={(e) => handleCheckboxChange('divisions', division?.id, e?.target?.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {division?.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Types */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Package" size={16} />
              Product Types
            </h3>
            
            <div className="space-y-3">
              {productTypes?.map((type) => (
                <label key={type?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked('productTypes', type?.id)}
                    onChange={(e) => handleCheckboxChange('productTypes', type?.id, e?.target?.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {type?.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Icon name="CheckCircle" size={16} />
              Availability
            </h3>
            
            <div className="space-y-3">
              {availability?.map((item) => (
                <label key={item?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked('availability', item?.id)}
                    onChange={(e) => handleCheckboxChange('availability', item?.id, e?.target?.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    {item?.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;