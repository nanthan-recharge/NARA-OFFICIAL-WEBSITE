import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Eye, 
  Share2, 
  BookOpen,
  Tag,
  Star,
  ExternalLink,
  ChevronRight,
  Copy,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

const ArticleModal = ({ 
  article, 
  isOpen, 
  onClose, 
  relatedArticles = [], 
  onRelatedArticleSelect 
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Handle escape key and outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e?.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (modalRef?.current && !modalRef?.current?.contains(e?.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Scroll to top when article changes
  useEffect(() => {
    if (isOpen && contentRef?.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [article, isOpen]);

  if (!article) return null;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format content paragraphs
  const formatContent = (content) => {
    return content?.split('\n\n')?.map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Share functions
  const shareArticle = (platform) => {
    const url = window.location?.href;
    const title = article?.title;
    const summary = article?.summary;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        copyToClipboard(url);
        break;
    }
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">NARA News Article</div>
                    <div className="text-sm text-gray-500">Full Article View</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Share button */}
                  <div className="relative group">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {/* Share dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                      <div className="p-2">
                        <button
                          onClick={() => shareArticle('facebook')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Facebook className="w-4 h-4 text-blue-600" />
                          Share on Facebook
                        </button>
                        <button
                          onClick={() => shareArticle('twitter')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Twitter className="w-4 h-4 text-blue-400" />
                          Share on Twitter
                        </button>
                        <button
                          onClick={() => shareArticle('linkedin')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Linkedin className="w-4 h-4 text-blue-700" />
                          Share on LinkedIn
                        </button>
                        <button
                          onClick={() => shareArticle('copy')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Article Header */}
                <div className="space-y-4">
                  {/* Category and Featured badges */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article?.category)}`}>
                      {article?.category}
                    </span>
                    {article?.is_featured && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {article?.title}
                  </h1>

                  {/* Summary */}
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {article?.summary}
                  </p>

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-500 border-t border-b border-gray-200 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(article?.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{article?.read_time} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{article?.author}</span>
                    </div>
                    {article?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{article?.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{(article?.views || 0)?.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-lg leading-relaxed">
                    {formatContent(article?.content)}
                  </div>
                </div>

                {/* Key Points */}
                {article?.key_points && article?.key_points?.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {article?.key_points?.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {article?.tags && article?.tags?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {article?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Stats */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Article Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{(article?.views || 0)?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{(article?.social_shares || 0)?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{article?.read_time}</div>
                      <div className="text-sm text-gray-600">Min Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{article?.tags?.length || 0}</div>
                      <div className="text-sm text-gray-600">Tags</div>
                    </div>
                  </div>
                </div>

                {/* Related Articles */}
                {relatedArticles && relatedArticles?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Related Articles</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {relatedArticles?.map((relatedArticle) => (
                        <motion.button
                          key={relatedArticle?.id}
                          onClick={() => {
                            onRelatedArticleSelect(relatedArticle);
                          }}
                          className="group text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-blue-300"
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                              <span className="text-lg font-bold text-blue-600">
                                {relatedArticle?.title?.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-2">
                                {relatedArticle?.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{formatDate(relatedArticle?.date)?.split(',')?.[0]}</span>
                                <span>•</span>
                                <span>{relatedArticle?.read_time} min</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded ${getCategoryColor(relatedArticle?.category)?.replace('100', '50')}`}>
                                  {relatedArticle?.category}
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      © 2025 National Aquatic Resources Research and Development Agency (NARA)
                    </div>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArticleModal;