import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown,
  ChevronUp,
  Filter,
  Tag,
  Globe,
  Book,
  Users,
  Lightbulb,
  Award,
  Leaf,
  Building,
  Heart,
  Calendar,
  Briefcase,
  Handshake
} from 'lucide-react';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  categoryCounts = {} 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Icon mapping for categories
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Education & Outreach': <Book className="w-4 h-4" />,
      'Research & Development': <Lightbulb className="w-4 h-4" />,
      'Technology & Innovation': <Globe className="w-4 h-4" />,
      'International Cooperation': <Handshake className="w-4 h-4" />,
      'Environmental Initiatives': <Leaf className="w-4 h-4" />,
      'Community Development': <Users className="w-4 h-4" />,
      'Conservation & Awareness': <Heart className="w-4 h-4" />,
      'Policy & Management': <Building className="w-4 h-4" />,
      'Capacity Building': <Award className="w-4 h-4" />,
      'Cultural Events': <Calendar className="w-4 h-4" />,
      'Industry Support': <Briefcase className="w-4 h-4" />,
      'Institutional Milestones': <Award className="w-4 h-4" />,
      'Conservation Partnerships': <Handshake className="w-4 h-4" />
    };
    return iconMap?.[category] || <Tag className="w-4 h-4" />;
  };

  // Color mapping for categories
  const getCategoryColor = (category) => {
    const colorMap = {
      'Education & Outreach': 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
      'Research & Development': 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
      'Technology & Innovation': 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
      'International Cooperation': 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
      'Environmental Initiatives': 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100',
      'Community Development': 'border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100',
      'Conservation & Awareness': 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
      'Policy & Management': 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      'Capacity Building': 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      'Cultural Events': 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
      'Industry Support': 'border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
      'Institutional Milestones': 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100',
      'Conservation Partnerships': 'border-lime-200 bg-lime-50 text-lime-700 hover:bg-lime-100'
    };
    return colorMap?.[category] || 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100';
  };

  const getSelectedColor = (category) => {
    const colorMap = {
      'Education & Outreach': 'border-blue-500 bg-blue-500 text-white',
      'Research & Development': 'border-purple-500 bg-purple-500 text-white',
      'Technology & Innovation': 'border-green-500 bg-green-500 text-white',
      'International Cooperation': 'border-orange-500 bg-orange-500 text-white',
      'Environmental Initiatives': 'border-teal-500 bg-teal-500 text-white',
      'Community Development': 'border-pink-500 bg-pink-500 text-white',
      'Conservation & Awareness': 'border-emerald-500 bg-emerald-500 text-white',
      'Policy & Management': 'border-indigo-500 bg-indigo-500 text-white',
      'Capacity Building': 'border-yellow-500 bg-yellow-500 text-white',
      'Cultural Events': 'border-rose-500 bg-rose-500 text-white',
      'Industry Support': 'border-cyan-500 bg-cyan-500 text-white',
      'Institutional Milestones': 'border-violet-500 bg-violet-500 text-white',
      'Conservation Partnerships': 'border-lime-500 bg-lime-500 text-white'
    };
    return colorMap?.[category] || 'border-gray-500 bg-gray-500 text-white';
  };

  // All categories including "All Categories"
  const allCategories = ['All Categories', ...categories];

  // Visible categories (first 6 + All Categories)
  const visibleCategories = isExpanded ? allCategories : allCategories?.slice(0, 7);
  const hasHiddenCategories = allCategories?.length > 7;

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filter by Category</h3>
        </div>
        
        {hasHiddenCategories && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>{isExpanded ? 'Show Less' : 'Show All'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {/* Category Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {visibleCategories?.map((category, index) => {
          const isSelected = category === selectedCategory;
          const count = category === 'All Categories' 
            ? Object.values(categoryCounts)?.reduce((sum, count) => sum + count, 0)
            : categoryCounts?.[category] || 0;

          return (
            <motion.button
              key={category}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onCategoryChange(category)}
              className={`group relative p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected 
                  ? getSelectedColor(category)
                  : getCategoryColor(category)
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`flex-shrink-0 ${isSelected ? 'text-white' : ''}`}>
                    {category === 'All Categories' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      getCategoryIcon(category)
                    )}
                  </div>
                  <span className="font-medium text-sm truncate">
                    {category}
                  </span>
                </div>
                
                {/* Article count badge */}
                <div className={`flex-shrink-0 ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  isSelected 
                    ? 'bg-white/20 text-white' :'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </div>
              </div>
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="categorySelection"
                  className="absolute inset-0 rounded-lg border-2 border-current"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                !isSelected ? 'bg-current bg-opacity-5' : ''
              }`} />
            </motion.button>
          );
        })}
      </motion.div>
      {/* Category Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing articles in: <span className="font-medium text-gray-800">{selectedCategory}</span>
          </span>
          <span className="text-gray-500">
            {selectedCategory === 'All Categories' 
              ? `${Object.values(categoryCounts)?.reduce((sum, count) => sum + count, 0)} total articles`
              : `${categoryCounts?.[selectedCategory] || 0} articles`
            }
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: selectedCategory === 'All Categories' ?'100%' 
                : `${((categoryCounts?.[selectedCategory] || 0) / Object.values(categoryCounts)?.reduce((sum, count) => sum + count, 0)) * 100}%`
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-blue-500 h-1 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryFilter;