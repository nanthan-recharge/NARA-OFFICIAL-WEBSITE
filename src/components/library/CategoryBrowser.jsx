import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORY_GROUPS, getCategoryGroupStats } from '../../utils/categoryGrouping';

/**
 * Category Browser Component
 * Displays organized category groups with statistics
 */
const CategoryBrowser = ({ facets, onCategoryClick }) => {
  const navigate = useNavigate();
  const groupStats = getCategoryGroupStats(facets);

  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.Book;
  };

  const handleGroupClick = (groupId) => {
    navigate(`/library?group=${groupId}`);
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Browse by Collection
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our digital library organized into 6 major collections
        </p>
      </div>

      {/* Category Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Object.entries(groupStats).map(([groupKey, group]) => {
          const IconComponent = getIconComponent(group.icon);

          return (
            <div
              key={groupKey}
              onClick={() => handleGroupClick(groupKey)}
              className={`bg-gradient-to-br ${group.color} rounded-xl p-6 text-white cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <div className="text-3xl font-bold">{group.totalCount}</div>
                    <div className="text-sm opacity-90">items</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                <p className="text-sm opacity-90 mb-4">{group.description}</p>

                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>{group.categoryCount} categories</span>
                  <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-700">
              {facets.material_types.reduce((sum, type) => sum + (type.count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">26</div>
            <div className="text-sm text-gray-600 mt-1">Material Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-700">
              {facets.languages.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">
              {facets.years.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Years Covered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBrowser;
