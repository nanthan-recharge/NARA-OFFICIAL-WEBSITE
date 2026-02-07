import naraNewsDatabase from '../data/naraNewsDatabase.json';

class NewsService {
  constructor() {
    this.articles = naraNewsDatabase?.articles;
    this.metadata = naraNewsDatabase?.metadata;
  }

  // Get all articles with optional filtering and pagination
  getArticles({
    category = null,
    search = '',
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 9,
    featured = null
  } = {}) {
    let filteredArticles = [...this.articles];

    // Filter by category
    if (category && category !== 'All Categories') {
      filteredArticles = filteredArticles?.filter(
        article => article?.category === category
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search?.toLowerCase();
      filteredArticles = filteredArticles?.filter(article =>
        article?.title?.toLowerCase()?.includes(searchLower) ||
        article?.summary?.toLowerCase()?.includes(searchLower) ||
        article?.content?.toLowerCase()?.includes(searchLower) ||
        article?.tags?.some(tag => tag?.toLowerCase()?.includes(searchLower)) ||
        article?.author?.toLowerCase()?.includes(searchLower)
      );
    }

    // Filter by featured status
    if (featured !== null) {
      filteredArticles = filteredArticles?.filter(
        article => article?.is_featured === featured
      );
    }

    // Sort articles
    filteredArticles?.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'views':
          valueA = a?.views || 0;
          valueB = b?.views || 0;
          break;
        case 'shares':
          valueA = a?.social_shares || 0;
          valueB = b?.social_shares || 0;
          break;
        case 'title':
          valueA = a?.title?.toLowerCase();
          valueB = b?.title?.toLowerCase();
          break;
        default:
          valueA = new Date(a.date);
          valueB = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles?.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      totalCount: filteredArticles?.length,
      currentPage: page,
      totalPages: Math.ceil(filteredArticles?.length / limit),
      hasNextPage: endIndex < filteredArticles?.length,
      hasPrevPage: page > 1
    };
  }

  // Get article by ID
  getArticleById(id) {
    return this.articles?.find(article => article?.id === parseInt(id));
  }

  // Get article by slug
  getArticleBySlug(slug) {
    return this.articles?.find(article => article?.slug === slug);
  }

  // Get featured articles
  getFeaturedArticles(limit = 3) {
    return this.articles?.filter(article => article?.is_featured)?.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, limit);
  }

  // Get recent articles
  getRecentArticles(limit = 5) {
    return this.articles?.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, limit);
  }

  // Get popular articles
  getPopularArticles(limit = 5) {
    return this.articles?.sort((a, b) => (b?.views || 0) - (a?.views || 0))?.slice(0, limit);
  }

  // Get related articles
  getRelatedArticles(articleId, limit = 3) {
    const article = this.getArticleById(articleId);
    if (!article) return [];

    // Get articles from related IDs first
    let relatedArticles = [];
    if (article?.related_articles && article?.related_articles?.length > 0) {
      relatedArticles = article?.related_articles?.map(id => this.getArticleById(id))?.filter(Boolean);
    }

    // If we need more, find by category and tags
    if (relatedArticles?.length < limit) {
      const additionalArticles = this.articles?.filter(art => 
          art?.id !== articleId && 
          !relatedArticles?.some(rel => rel?.id === art?.id) &&
          (art?.category === article?.category || 
           art?.tags?.some(tag => article?.tags?.includes(tag)))
        )?.sort((a, b) => new Date(b.date) - new Date(a.date))?.slice(0, limit - relatedArticles?.length);

      relatedArticles = [...relatedArticles, ...additionalArticles];
    }

    return relatedArticles?.slice(0, limit);
  }

  // Get all categories
  getCategories() {
    return Object.keys(this.metadata?.categories)?.sort();
  }

  // Get category counts
  getCategoryCounts() {
    return this.metadata?.categories;
  }

  // Search articles with suggestions
  searchArticles(query, limit = 10) {
    if (!query || query?.length < 2) return [];

    const searchLower = query?.toLowerCase();
    const results = this.articles?.filter(article =>
        article?.title?.toLowerCase()?.includes(searchLower) ||
        article?.summary?.toLowerCase()?.includes(searchLower) ||
        article?.tags?.some(tag => tag?.toLowerCase()?.includes(searchLower))
      )?.sort((a, b) => {
        // Prioritize title matches
        const aTitleMatch = a?.title?.toLowerCase()?.includes(searchLower);
        const bTitleMatch = b?.title?.toLowerCase()?.includes(searchLower);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        // Then by date
        return new Date(b.date) - new Date(a.date);
      })?.slice(0, limit);

    return results;
  }

  // Get search suggestions
  getSearchSuggestions(query, limit = 5) {
    if (!query || query?.length < 2) return [];

    const searchLower = query?.toLowerCase();
    const suggestions = new Set();

    // Add matching titles
    this.articles?.forEach(article => {
      if (article?.title?.toLowerCase()?.includes(searchLower)) {
        suggestions?.add(article?.title);
      }
    });

    // Add matching tags
    this.articles?.forEach(article => {
      article?.tags?.forEach(tag => {
        if (tag?.toLowerCase()?.includes(searchLower)) {
          suggestions?.add(tag);
        }
      });
    });

    return Array.from(suggestions)?.slice(0, limit);
  }

  // Get statistics
  getStatistics() {
    const totalViews = this.articles?.reduce((sum, article) => sum + (article?.views || 0), 0);
    const totalShares = this.articles?.reduce((sum, article) => sum + (article?.social_shares || 0), 0);
    const averageReadTime = Math.round(
      this.articles?.reduce((sum, article) => sum + (article?.read_time || 0), 0) / this.articles?.length
    );

    return {
      totalArticles: this.articles?.length,
      totalCategories: Object.keys(this.metadata?.categories)?.length,
      totalViews,
      totalShares,
      averageReadTime,
      mostPopularCategory: Object.entries(this.metadata?.categories)?.sort(([,a], [,b]) => b - a)?.[0]?.[0] || 'N/A',
      dateRange: this.metadata?.date_range
    };
  }

  // Increment article views (simulation)
  incrementViews(articleId) {
    const article = this.getArticleById(articleId);
    if (article) {
      article.views = (article?.views || 0) + 1;
      return article?.views;
    }
    return 0;
  }

  // Increment social shares (simulation)
  incrementShares(articleId) {
    const article = this.getArticleById(articleId);
    if (article) {
      article.social_shares = (article?.social_shares || 0) + 1;
      return article?.social_shares;
    }
    return 0;
  }
}

// Export singleton instance
export default new NewsService();