const DEFAULT_BASE_URL = 'https://nara-web-73384.web.app';

const getWindow = () => (typeof window !== 'undefined' ? window : null);

export const buildArticleShareUrl = (article = {}, language = 'en') => {
  const win = getWindow();
  const origin = win?.location?.origin || DEFAULT_BASE_URL;
  const slugOrId = article?.slug || article?.id || article?.firestoreId || '';
  const params = new URLSearchParams();

  if (slugOrId) {
    params.set('article', slugOrId);
  }
  if (language) {
    params.set('lang', language);
  }

  const query = params.toString();
  return `${origin}/nara-news-updates-center${query ? `?${query}` : ''}`;
};

export const buildArticleSharePayload = (article = {}, language = 'en') => {
  const title = article?.displayTitle || article?.title || '';
  const summary = article?.displaySummary || article?.summary || '';
  const url = buildArticleShareUrl(article, language);

  return {
    title,
    summary,
    url
  };
};

export const downloadArticlePdf = async (article = {}, { language = 'en', t } = {}) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let cursorY = margin;

  const addSectionHeading = (label) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(54, 83, 201);
    doc.text(label, margin, cursorY);
    cursorY += 18;
  };

  const addParagraph = (text, fontSize = 11, lineHeight = 15, options = {}) => {
    if (!text) return;
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(60, 66, 87);
    const textWidth = pageWidth - margin * 2;
    const lines = doc.splitTextToSize(text, textWidth);
    lines.forEach((line) => {
      if (cursorY > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });
    cursorY += 6;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-LK' : 'en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  const translated = (key, fallback) =>
    typeof t === 'function' ? t(key, { defaultValue: fallback }) : fallback;

  addParagraph(
    article?.displayTitle || article?.title || translated('share.pdfTitleFallback', 'NARA News Article'),
    18,
    22,
    { bold: true }
  );

  addParagraph(formatDate(article?.date), 11, 16);

  if (article?.displaySummary || article?.summary) {
    addSectionHeading(translated('share.sections.summary', 'Summary'));
    addParagraph(article?.displaySummary || article?.summary);
  }

  if (article?.displayContent || article?.content) {
    addSectionHeading(translated('share.sections.content', 'Full content'));
    addParagraph(article?.displayContent || article?.content, 11, 16);
  }

  const keyPoints = article?.displayKeyPoints || article?.key_points || [];
  if (keyPoints.length > 0) {
    addSectionHeading(translated('share.sections.highlights', 'Key highlights'));
    keyPoints.forEach((point) => addParagraph(`• ${point}`));
  }

  const tags = article?.displayTags || article?.tags || [];
  if (tags.length > 0) {
    addSectionHeading(translated('share.sections.tags', 'Tags'));
    addParagraph(tags.join(', '));
  }

  if (article?.displayAuthor || article?.displayAuthorPosition || article?.displayLocation) {
    addSectionHeading(translated('share.sections.metadata', 'Published by'));
    const meta = [article?.displayAuthor || article?.author, article?.displayAuthorPosition || article?.author_position, article?.displayLocation || article?.location]
      .filter(Boolean)
      .join(' • ');
    addParagraph(meta);
  }

  doc.save(`${(article?.slug || article?.id || 'nara-news').toString()}.pdf`);
};
