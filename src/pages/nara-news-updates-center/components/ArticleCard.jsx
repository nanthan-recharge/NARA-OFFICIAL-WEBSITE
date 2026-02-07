import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Share2, 
  ArrowRight,
  MapPin,
  Tag,
  Star
} from 'lucide-react';

const ArticleCard = ({ article, onSelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Education & Outreach': 'bg-blue-100 text-blue-800',
      'Research & Development': 'bg-purple-100 text-purple-800',
      'Technology & Innovation': 'bg-green-100 text-green-800',
      'International Cooperation': 'bg-orange-100 text-orange-800',
      'Environmental Initiatives': 'bg-teal-100 text-teal-800',
      'Community Development': 'bg-pink-100 text-pink-800',
      'Conservation & Awareness': 'bg-emerald-100 text-emerald-800',
      'Policy & Management': 'bg-indigo-100 text-indigo-800',
      'Capacity Building': 'bg-yellow-100 text-yellow-800',
      'Cultural Events': 'bg-rose-100 text-rose-800',
      'Industry Support': 'bg-cyan-100 text-cyan-800',
      'Institutional Milestones': 'bg-violet-100 text-violet-800',
      'Conservation Partnerships': 'bg-lime-100 text-lime-800'
    };
    return colorMap?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image/Visual Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
        {/* Placeholder image with article initial */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-bold text-blue-600">
              {article?.title?.charAt(0)}
            </span>
          </div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured badge */}
        {article?.is_featured && (
          <div className="absolute top-3 left-3">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
              <Star className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article?.category)}`}>
            {article?.category}
          </span>
        </div>

        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onSelect(article)}
            className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors transform scale-95 group-hover:scale-100"
          >
            Read Article
          </button>
        </div>
      </div>
      {/* Content Section */}
      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article?.date)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article?.read_time} min
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {article?.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {article?.summary}
        </p>

        {/* Location */}
        {article?.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3" />
            {article?.location}
          </div>
        )}

        {/* Tags */}
        {article?.tags && article?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article?.tags?.slice(0, 3)?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                <Tag className="w-2 h-2" />
                {tag}
              </span>
            ))}
            {article?.tags?.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{article?.tags?.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author and stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              {article?.author?.split(',')?.[0] || 'NARA'}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {(article?.views || 0)?.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {(article?.social_shares || 0)?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Read more button */}
          <button
            onClick={() => onSelect(article)}
            className="group/btn flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Read more
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;