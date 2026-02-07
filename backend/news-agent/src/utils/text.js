const crypto = require('crypto');
const sanitizeHtml = require('sanitize-html');

const normalizeWhitespace = value =>
  value
    ?.replace(/\s+/g, ' ')
    ?.trim();

const sanitiseRichText = value => {
  if (!value) return '';
  return sanitizeHtml(value, {
    allowedTags: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'br'],
    allowedAttributes: {
      a: ['href', 'title']
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
    }
  });
};

const stripHtml = value => {
  if (!value) return '';
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
};

const createContentHash = (...parts) => {
  const hash = crypto.createHash('sha256');
  parts.filter(Boolean).forEach(part => hash.update(String(part)));
  return hash.digest('hex');
};

const containsAnyKeyword = (content, keywords = []) => {
  if (!content) return false;
  const haystack = content.toLowerCase();
  return keywords.some(keyword => haystack.includes(keyword.toLowerCase()));
};

const estimateReadTime = (htmlContent, wordsPerMinute = 180) => {
  const plainText = stripHtml(htmlContent);
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  if (!wordCount) return null;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

module.exports = {
  normalizeWhitespace,
  sanitiseRichText,
  stripHtml,
  createContentHash,
  containsAnyKeyword,
  estimateReadTime
};
