import { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import fallbackNewsData from '../data/naraNewsDatabase.json';

const normaliseDate = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString();
  }
  return null;
};

const transformArticle = (article, overrideId = null) => {
  if (!article) return null;

  const isoDate =
    normaliseDate(article.publishedAt ?? article.date ?? article.createdAt) ?? null;

  return {
    id: article.id ?? overrideId ?? article.slug ?? article.documentId ?? null,
    firestoreId: article.id ?? null,
    title: article.title ?? article.headline ?? '',
    summary: article.summary ?? article.excerpt ?? '',
    content: article.content ?? article.body ?? '',
    category: article.category ?? article.section ?? 'General',
    author: article.author ?? article.byline ?? '',
    author_position: article.author_position ?? article.authorPosition ?? '',
    location: article.location ?? '',
    read_time: article.read_time ?? article.readTime ?? article.estimatedRead ?? null,
    views: article.views ?? article.totalViews ?? 0,
    social_shares: article.social_shares ?? article.shares ?? 0,
    tags: Array.isArray(article.tags) ? article.tags : [],
    date: isoDate ? isoDate.split('T')[0] : article.date ?? '',
    timestamp: isoDate,
    slug: article.slug ?? article.seoSlug ?? null,
    is_featured: Boolean(article.is_featured ?? article.featured ?? false),
    key_points: article.key_points ?? article.keyPoints ?? [],
    coverImage: article.coverImage ?? article.heroImage ?? article.thumbnail ?? null,
    translations: article.translations ?? null,
    attachments: article.attachments ?? [],
    status: article.status ?? 'published'
  };
};

const computeMetadata = (articles, fallbackMetadata = {}) => {
  const categoryCounts = {};
  let totalViews = 0;
  let totalReadTime = 0;
  let articlesWithReadTime = 0;
  let latestDate = null;

  articles?.forEach((article) => {
    const category = article?.category ?? 'General';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;

    totalViews += Number(article?.views || 0);

    if (article?.read_time) {
      totalReadTime += Number(article.read_time);
      articlesWithReadTime += 1;
    }

    if (article?.timestamp) {
      const cmpDate = new Date(article.timestamp);
      if (!Number.isNaN(cmpDate.getTime())) {
        if (!latestDate || cmpDate > latestDate) {
          latestDate = cmpDate;
        }
      }
    }
  });

  return {
    ...fallbackMetadata,
    total_articles: articles?.length ?? 0,
    categories:
      Object.keys(categoryCounts).length > 0
        ? categoryCounts
        : fallbackMetadata?.categories ?? {},
    total_views: totalViews,
    average_read_time:
      articlesWithReadTime > 0
        ? Math.round(totalReadTime / articlesWithReadTime)
        : fallbackMetadata?.average_read_time ?? null,
    latest_date: latestDate ? latestDate.toISOString() : fallbackMetadata?.date_range?.to ?? null
  };
};

const useNewsArticles = ({ enabled = true } = {}) => {
  const initialArticles = fallbackNewsData?.articles ?? [];
  const initialMetadata = useMemo(
    () => computeMetadata(initialArticles, fallbackNewsData?.metadata ?? {}),
    []
  );

  const [articles, setArticles] = useState(initialArticles);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const [source, setSource] = useState(initialArticles.length ? 'local' : 'unknown');

  const fetchArticles = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newsQuery = query(
        collection(db, 'newsArticles'),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(newsQuery);

      if (snapshot.empty) {
        setSource(initialArticles.length ? 'local' : 'empty');
        setArticles(initialArticles);
        setMetadata(computeMetadata(initialArticles, fallbackNewsData?.metadata ?? {}));
        return;
      }

      const fetchedArticles = snapshot.docs
        .map((docSnap, index) => transformArticle({ id: docSnap.id, ...docSnap.data() }, index))
        .filter(Boolean);

      if (fetchedArticles.length === 0) {
        setSource(initialArticles.length ? 'local' : 'empty');
        setArticles(initialArticles);
        setMetadata(computeMetadata(initialArticles, fallbackNewsData?.metadata ?? {}));
        return;
      }

      setSource('firestore');
      setArticles(fetchedArticles);
      setMetadata(computeMetadata(fetchedArticles, fallbackNewsData?.metadata ?? {}));
    } catch (err) {
      console.warn('Failed to load news articles from Firestore, using local dataset.', err);
      setError(err);
      setSource(initialArticles.length ? 'local' : 'error');
      setArticles(initialArticles);
      setMetadata(computeMetadata(initialArticles, fallbackNewsData?.metadata ?? {}));
    } finally {
      setIsLoading(false);
    }
  }, [enabled, initialArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const featuredArticles = useMemo(
    () => articles?.filter((article) => article?.is_featured) ?? [],
    [articles]
  );

  const latestArticles = useMemo(() => {
    return [...(articles ?? [])]
      .sort((a, b) => new Date(b.timestamp ?? b.date) - new Date(a.timestamp ?? a.date))
      .slice(0, 5);
  }, [articles]);

  return {
    articles,
    metadata,
    featuredArticles,
    latestArticles,
    isLoading,
    error,
    source,
    refresh: fetchArticles
  };
};

export default useNewsArticles;
