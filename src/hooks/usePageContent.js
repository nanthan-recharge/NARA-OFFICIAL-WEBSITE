import { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Fetches CMS-managed page content from Firestore with a graceful fallback.
 *
 * @param {string} pageId - Firestore document id under the `pageContent` collection.
 * @param {object} options
 * @param {object} [options.fallbackContent] - Local defaults when Firestore is unavailable.
 * @param {boolean} [options.enabled=true] - Whether the fetch should run.
 */
const usePageContent = (pageId, { fallbackContent = null, enabled = true } = {}) => {
  const fallbackRef = useRef(fallbackContent);
  const [content, setContent] = useState(fallbackRef.current);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  useEffect(() => {
    fallbackRef.current = fallbackContent;
  }, [fallbackContent]);

  useEffect(() => {
    if (!pageId || !enabled) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'pageContent', pageId);
        const snap = await getDoc(docRef);

        if (!isMounted) return;

        if (snap.exists()) {
          setContent(snap.data());
        } else if (fallbackRef.current) {
          setContent(fallbackRef.current);
        } else {
          setContent(null);
        }
      } catch (err) {
        console.warn(`Failed to load page content for ${pageId}:`, err);
        if (isMounted) {
          setError(err);
          setContent(prev => prev ?? fallbackRef.current ?? null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [pageId, enabled]);

  return {
    content: content ?? fallbackRef.current ?? null,
    heroContent: content?.hero ?? fallbackRef.current?.hero ?? null,
    isLoading,
    error
  };
};

export default usePageContent;
