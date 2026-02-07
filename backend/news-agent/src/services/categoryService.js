const { CATEGORY_KEYWORDS, DEFAULT_CATEGORY } = require('../utils/categoryMap');
const { containsAnyKeyword } = require('../utils/text');

const CATEGORY_LIST = Object.keys(CATEGORY_KEYWORDS);

const normalise = value => value?.toString().trim().toLowerCase();

const normaliseCategory = category => {
  const lookup = normalise(category);
  if (!lookup) return null;
  return CATEGORY_LIST.find(item => normalise(item) === lookup) || null;
};

const heuristicCategory = article => {
  const text = [article.title, article.summary, article.content]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const category of CATEGORY_LIST) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (containsAnyKeyword(text, keywords)) {
      return category;
    }
  }
  return DEFAULT_CATEGORY;
};

const ensureCategory = (article, llmCategory) => {
  const candidate = normaliseCategory(llmCategory);
  if (candidate) return candidate;
  return heuristicCategory(article);
};

module.exports = {
  ensureCategory,
  CATEGORY_LIST
};
