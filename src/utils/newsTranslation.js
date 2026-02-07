/**
 * Auto-Translation Utility for News Articles
 * Provides automatic translation for news content when translations are not available
 */

// Translation mappings for common news terms
const newsTranslations = {
  // Categories
  'Education & Outreach': {
    si: 'අධ්‍යාපනය සහ ව්‍යාප්තිය',
    ta: 'கல்வி மற்றும் வெளிச்செல்லல்'
  },
  'Research & Development': {
    si: 'පර්යේෂණ හා සංවර්ධන',
    ta: 'ஆராய்ச்சி மற்றும் மேம்பாடு'
  },
  'Policy & Management': {
    si: 'ප්‍රතිපත්ති සහ කළමනාකරණය',
    ta: 'கொள்கை மற்றும் நிர்வாகம்'
  },
  'Technology & Innovation': {
    si: 'තාක්ෂණය සහ නවෝත්පාදනය',
    ta: 'தொழில்நுட்பம் மற்றும் புதுமை'
  },
  'Environmental Initiatives': {
    si: 'පාරිසරික මුලපිරීම්',
    ta: 'சுற்றுச்சூழல் முன்முயற்சிகள்'
  },
  'Conservation & Awareness': {
    si: 'සංරක්ෂණය සහ දැනුවත් කිරීම',
    ta: 'பாதுகாப்பு மற்றும் விழிப்புணர்வு'
  },
  'Community Development': {
    si: 'ප්‍රජා සංවර්ධනය',
    ta: 'சமூக அபிவிருத்தி'
  },
  'Capacity Building': {
    si: 'ධාරිතා ගොඩනැගීම',
    ta: 'திறன் மேம்பாடு'
  },
  'Technology Integration': {
    si: 'තාක්ෂණික ඒකාබද්ධතාවය',
    ta: 'தொழில்நுட்ப ஒருங்கிணைப்பு'
  },
  'International Cooperation': {
    si: 'ජාත්‍යන්තර සහයෝගීතාවය',
    ta: 'சர்வதேச ஒத்துழைப்பு'
  },
  'Industry Support': {
    si: 'කර්මාන්ත සහාය',
    ta: 'தொழில் ஆதரவு'
  },
  'Industry Development': {
    si: 'කර්මාන්ත සංවර්ධනය',
    ta: 'தொழில் மேம்பாடு'
  },
  'Cultural Events': {
    si: 'සංස්කෘතික උත්සව',
    ta: 'கலாச்சார நிகழ்வுகள்'
  },
  'Institutional Milestones': {
    si: 'ආයතනික සන්ධිස්ථාන',
    ta: 'நிறுவன மைல்கற்கள்'
  },
  'Conservation Partnerships': {
    si: 'සංරක්ෂණ හවුල්කාරිත්ව',
    ta: 'பாதுகாப்பு கூட்டாண்மைகள்'
  }
};

// Common terms translations
const commonTerms = {
  'read time': {
    si: 'කියවීමේ කාලය',
    ta: 'வாசிக்கும் நேரம்'
  },
  'min read': {
    si: 'මිනිත්තු',
    ta: 'நிமிடங்கள்'
  },
  'by': {
    si: 'විසින්',
    ta: 'மூலம்'
  },
  'at': {
    si: 'හිදී',
    ta: 'இல்'
  },
  'Read More': {
    si: 'වැඩිදුර කියවන්න',
    ta: 'மேலும் வாசிக்க'
  },
  'Share': {
    si: 'බෙදා ගන්න',
    ta: 'பகிர்'
  },
  'Views': {
    si: 'නැරඹුම්',
    ta: 'பார்வைகள்'
  },
  'Latest News': {
    si: 'නවතම පුවත්',
    ta: 'சமீபத்திய செய்திகள்'
  },
  'Featured': {
    si: 'විශේෂාංග',
    ta: 'சிறப்பு'
  },
  'All Categories': {
    si: 'සියලුම වර්ග',
    ta: 'அனைத்து வகைகள்'
  },
  'Search': {
    si: 'සොයන්න',
    ta: 'தேடு'
  },
  'Filter': {
    si: 'පෙරීම',
    ta: 'வடிகட்டு'
  },
  'Sort by': {
    si: 'අනුපිළිවෙල කරන්න',
    ta: 'வரிசைப்படுத்து'
  },
  'Date': {
    si: 'දිනය',
    ta: 'தேதி'
  },
  'Title': {
    si: 'ශීර්ෂය',
    ta: 'தலைப்பு'
  },
  'Popularity': {
    si: 'ජනප්‍රියත්වය',
    ta: 'பிரபலம்'
  },
  'Related Articles': {
    si: 'ආශ්‍රිත ලිපි',
    ta: 'தொடர்புடைய கட்டுரைகள்'
  },
  'Key Points': {
    si: 'ප්‍රධාන කරුණු',
    ta: 'முக்கிய புள்ளிகள்'
  }
};

/**
 * Get translated category name
 */
export const translateCategory = (category, language) => {
  if (language === 'en' || !category) return category;
  return newsTranslations[category]?.[language] || category;
};

/**
 * Get translated common term
 */
export const translateTerm = (term, language) => {
  if (language === 'en' || !term) return term;
  return commonTerms[term]?.[language] || term;
};

/**
 * Auto-translate article fields
 * This is a fallback when real translations are not available
 */
export const autoTranslateArticle = (article, language) => {
  if (!article || language === 'en') return article;

  // Check if article has pre-translated content
  const translation = article?.translations?.[language];
  
  if (translation) {
    return {
      ...article,
      displayTitle: translation.title || article.title,
      displaySummary: translation.summary || article.summary,
      displayContent: translation.content || article.content,
      displayCategory: translation.category || translateCategory(article.category, language),
      displayLocation: translation.location || article.location,
      displayTags: translation.tags || article.tags,
      displayKeyPoints: translation.key_points || article.key_points,
      displayAuthor: translation.author || article.author,
      displayAuthorPosition: translation.author_position || article.author_position
    };
  }

  // If no translation exists, return with translated category and original content
  // In a real implementation, you would call a translation API here
  return {
    ...article,
    displayTitle: article.title, // Keep English for now (would call translation API)
    displaySummary: article.summary, // Keep English for now
    displayContent: article.content, // Keep English for now
    displayCategory: translateCategory(article.category, language),
    displayLocation: article.location,
    displayTags: article.tags,
    displayKeyPoints: article.key_points,
    displayAuthor: article.author,
    displayAuthorPosition: article.author_position,
    // Add a flag to indicate auto-translation is needed
    needsTranslation: true,
    translationNotice: language === 'si' 
      ? 'මෙම අන්තර්ගතය ඉංග්‍රීසි භාෂාවෙන් පමණක් ලබා ගත හැකිය'
      : 'இந்த உள்ளடக்கம் ஆங்கிலத்தில் மட்டுமே கிடைக்கிறது'
  };
};

/**
 * Translate date to localized format
 */
export const translateDate = (dateString, language) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const locales = {
    en: 'en-US',
    si: 'si-LK',
    ta: 'ta-LK'
  };

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  try {
    return date.toLocaleDateString(locales[language] || 'en-US', options);
  } catch (error) {
    return date.toLocaleDateString('en-US', options);
  }
};

/**
 * Format read time with translated text
 */
export const formatReadTime = (minutes, language) => {
  const timeText = translateTerm('min read', language);
  return `${minutes} ${timeText}`;
};

/**
 * Get month name in local language
 */
export const getMonthName = (monthIndex, language) => {
  const months = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    si: ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'],
    ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்']
  };

  return months[language]?.[monthIndex] || months.en[monthIndex];
};

/**
 * Batch translate multiple articles
 */
export const batchTranslateArticles = (articles, language) => {
  if (!Array.isArray(articles)) return [];
  return articles.map(article => autoTranslateArticle(article, language));
};

export default {
  translateCategory,
  translateTerm,
  autoTranslateArticle,
  translateDate,
  formatReadTime,
  getMonthName,
  batchTranslateArticles
};
