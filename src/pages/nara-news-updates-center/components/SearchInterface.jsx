import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const SearchInterface = ({ searchQuery, onSearchChange, searchSuggestions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);

  // Handle input focus
  const handleFocus = () => {
    setIsExpanded(true);
    if (searchQuery?.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
      if (!searchQuery) {
        setIsExpanded(false);
      }
    }, 150);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    
    if (value?.length >= 2) {
      setShowSuggestions(true);
      setSelectedSuggestion(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || searchSuggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedSuggestion(prev => 
          prev < searchSuggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : searchSuggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedSuggestion >= 0 && selectedSuggestion < searchSuggestions?.length) {
          handleSuggestionSelect(searchSuggestions?.[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    inputRef?.current?.blur();
  };

  // Clear search
  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    inputRef?.current?.focus();
  };

  // Auto-scroll to selected suggestion
  useEffect(() => {
    if (selectedSuggestion >= 0 && suggestionRefs?.current?.[selectedSuggestion]) {
      suggestionRefs?.current?.[selectedSuggestion]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedSuggestion]);

  return (
    <div className="relative mb-6">
      {/* Search Input */}
      <motion.div
        animate={{
          scale: isExpanded ? 1.02 : 1,
          boxShadow: isExpanded 
            ? '0 10px 25px rgba(0, 0, 0, 0.1)' 
            : '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search articles by title, content, author, or tags..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          {/* Clear button */}
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && searchSuggestions?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto"
            >
              <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
                  Search suggestions
                </div>
                
                {searchSuggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    ref={el => suggestionRefs.current[index] = el}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSuggestion === index
                        ? 'bg-blue-50 text-blue-700' :'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Search Tips */}
      {isExpanded && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="mt-3 text-sm text-gray-500"
        >
          <div className="flex flex-wrap gap-2">
            <span>Try searching for:</span>
            <button 
              onClick={() => onSearchChange('mangrove')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              mangrove
            </button>
            <span>•</span>
            <button 
              onClick={() => onSearchChange('research')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              research
            </button>
            <span>•</span>
            <button 
              onClick={() => onSearchChange('technology')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              technology
            </button>
            <span>•</span>
            <button 
              onClick={() => onSearchChange('partnership')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              partnership
            </button>
          </div>
        </motion.div>
      )}
      {/* Active search indicator */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2 text-sm"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">
            Searching for: <span className="font-medium text-green-600">"{searchQuery}"</span>
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default SearchInterface;