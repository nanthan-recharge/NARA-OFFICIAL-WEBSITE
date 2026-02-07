/**
 * Media Scraper Service
 * Automatically fetches images and videos from various sources
 * - Sri Lankan news sites
 * - Social media platforms
 * - Partner organizations
 */

import axios from 'axios';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// News sources in Sri Lanka
const NEWS_SOURCES = [
  {
    id: 'dailynews',
    name: 'Daily News Sri Lanka',
    url: 'https://www.dailynews.lk',
    searchTerms: ['NARA', 'marine research', 'ocean', 'fisheries']
  },
  {
    id: 'newsfirst',
    name: 'News First Sri Lanka',
    url: 'https://www.newsfirst.lk',
    searchTerms: ['NARA', 'marine', 'aquatic resources']
  },
  {
    id: 'dailymirror',
    name: 'Daily Mirror',
    url: 'https://www.dailymirror.lk',
    searchTerms: ['NARA', 'marine research', 'ocean conservation']
  },
  {
    id: 'adaderana',
    name: 'Ada Derana',
    url: 'https://www.adaderana.lk',
    searchTerms: ['NARA', 'marine', 'fishing']
  }
];

// Social media sources (requires API keys)
const SOCIAL_MEDIA_SOURCES = {
  facebook: {
    pageId: 'NARA.SriLanka', // Replace with actual page ID
    accessToken: process.env.VITE_FACEBOOK_ACCESS_TOKEN
  },
  twitter: {
    handle: '@NARA_SriLanka', // Replace with actual handle
    apiKey: process.env.VITE_TWITTER_API_KEY
  },
  instagram: {
    username: 'nara_srilanka', // Replace with actual username
    accessToken: process.env.VITE_INSTAGRAM_ACCESS_TOKEN
  },
  youtube: {
    channelId: 'UCxxxxx', // Replace with actual channel ID
    apiKey: process.env.VITE_YOUTUBE_API_KEY
  }
};

/**
 * Fetch images from news websites
 * Note: This is a simplified version. Real implementation would need web scraping
 * or RSS feed parsing, which requires backend implementation
 */
export const scrapeNewsImages = async () => {
  const scrapedImages = [];

  try {
    // This would typically be done on the backend using a service like Puppeteer or Cheerio
    // For now, we'll use a placeholder that can be replaced with actual API calls

    for (const source of NEWS_SOURCES) {
      console.log(`Scraping ${source.name}...`);

      // In a real implementation, you would:
      // 1. Use backend Cloud Function to scrape the website
      // 2. Parse HTML for images related to NARA
      // 3. Extract metadata (title, date, description)
      // 4. Store in Firebase

      // Placeholder for demonstration
      const mockImage = {
        title: `${source.name} - NARA Coverage`,
        description: 'Latest coverage from ' + source.name,
        source: 'news',
        sourceUrl: source.url,
        sourceName: source.name,
        category: 'research',
        tags: ['news', 'media coverage'],
        scrapedAt: new Date().toISOString(),
        autoScraped: true
      };

      scrapedImages.push(mockImage);
    }

    return scrapedImages;
  } catch (error) {
    console.error('Error scraping news images:', error);
    return [];
  }
};

/**
 * Fetch media from Facebook Page
 * Requires Facebook Graph API access
 */
export const fetchFacebookMedia = async () => {
  try {
    const { pageId, accessToken } = SOCIAL_MEDIA_SOURCES.facebook;

    if (!accessToken) {
      console.warn('Facebook access token not configured');
      return [];
    }

    // Facebook Graph API endpoint for page photos
    const apiUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
    const params = {
      access_token: accessToken,
      fields: 'id,images,created_time,name,picture,link',
      limit: 25
    };

    const response = await axios.get(apiUrl, { params });

    return response.data.data.map(photo => ({
      title: photo.name || 'Facebook Post',
      description: photo.name || '',
      url: photo.images?.[0]?.source || photo.picture,
      thumbnail: photo.picture,
      externalLink: photo.link,
      source: 'social',
      sourceName: 'Facebook',
      category: 'events',
      date: new Date(photo.created_time).toISOString().split('T')[0],
      tags: ['facebook', 'social media'],
      externalId: photo.id,
      autoScraped: true
    }));
  } catch (error) {
    console.error('Error fetching Facebook media:', error);
    return [];
  }
};

/**
 * Fetch videos from YouTube Channel
 * Requires YouTube Data API key
 */
export const fetchYouTubeVideos = async () => {
  try {
    const { channelId, apiKey } = SOCIAL_MEDIA_SOURCES.youtube;

    if (!apiKey) {
      console.warn('YouTube API key not configured');
      return [];
    }

    // YouTube Data API endpoint
    const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
      key: apiKey,
      channelId: channelId,
      part: 'snippet',
      order: 'date',
      maxResults: 25,
      type: 'video'
    };

    const response = await axios.get(apiUrl, { params });

    return response.data.items.map(video => ({
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      source: 'social',
      sourceName: 'YouTube',
      category: 'research',
      date: new Date(video.snippet.publishedAt).toISOString().split('T')[0],
      tags: ['youtube', 'video'],
      externalId: video.id.videoId,
      autoScraped: true
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

/**
 * Fetch images from Instagram
 * Requires Instagram Graph API access
 */
export const fetchInstagramMedia = async () => {
  try {
    const { username, accessToken } = SOCIAL_MEDIA_SOURCES.instagram;

    if (!accessToken) {
      console.warn('Instagram access token not configured');
      return [];
    }

    // Instagram Graph API endpoint
    const apiUrl = `https://graph.instagram.com/me/media`;
    const params = {
      access_token: accessToken,
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
      limit: 25
    };

    const response = await axios.get(apiUrl, { params });

    return response.data.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'VIDEO')
      .map(post => ({
        title: post.caption?.substring(0, 100) || 'Instagram Post',
        description: post.caption || '',
        url: post.media_url,
        thumbnail: post.thumbnail_url || post.media_url,
        externalLink: post.permalink,
        source: 'social',
        sourceName: 'Instagram',
        category: 'events',
        date: new Date(post.timestamp).toISOString().split('T')[0],
        tags: ['instagram', 'social media'],
        externalId: post.id,
        autoScraped: true,
        isVideo: post.media_type === 'VIDEO'
      }));
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return [];
  }
};

/**
 * Check if media already exists in Firebase (avoid duplicates)
 */
const mediaExists = async (externalId, collectionName) => {
  if (!externalId) return false;

  try {
    const q = query(
      collection(db, collectionName),
      where('externalId', '==', externalId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking media existence:', error);
    return false;
  }
};

/**
 * Save scraped media to Firebase
 */
export const saveScrapedMedia = async (mediaItems, isVideo = false) => {
  const collectionName = isVideo ? 'media_videos' : 'media_images';
  const savedItems = [];

  for (const item of mediaItems) {
    try {
      // Check for duplicates
      if (item.externalId && await mediaExists(item.externalId, collectionName)) {
        console.log(`Skipping duplicate: ${item.title}`);
        continue;
      }

      // Add to Firebase
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        approved: false // Requires admin approval before showing
      });

      savedItems.push({ id: docRef.id, ...item });
      console.log(`Saved: ${item.title}`);
    } catch (error) {
      console.error(`Error saving ${item.title}:`, error);
    }
  }

  return savedItems;
};

/**
 * Main function to run all scrapers
 * This should be called periodically (e.g., via cron job or Firebase scheduled function)
 */
export const runAllScrapers = async () => {
  console.log('🔍 Starting media scraping...');
  const startTime = Date.now();

  try {
    // Fetch from all sources in parallel
    const [
      newsImages,
      facebookMedia,
      youtubeVideos,
      instagramMedia
    ] = await Promise.all([
      scrapeNewsImages(),
      fetchFacebookMedia(),
      fetchYouTubeVideos(),
      fetchInstagramMedia()
    ]);

    // Separate images and videos
    const allImages = [
      ...newsImages,
      ...facebookMedia.filter(item => !item.isVideo),
      ...instagramMedia.filter(item => !item.isVideo)
    ];

    const allVideos = [
      ...youtubeVideos,
      ...facebookMedia.filter(item => item.isVideo),
      ...instagramMedia.filter(item => item.isVideo)
    ];

    // Save to Firebase
    const savedImages = await saveScrapedMedia(allImages, false);
    const savedVideos = await saveScrapedMedia(allVideos, true);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`✅ Scraping complete in ${duration}s`);
    console.log(`   📸 Images: ${savedImages.length} new`);
    console.log(`   🎥 Videos: ${savedVideos.length} new`);

    return {
      success: true,
      duration,
      images: savedImages.length,
      videos: savedVideos.length,
      total: savedImages.length + savedVideos.length
    };
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Manually trigger scraping (for testing or admin use)
 */
export const manualScrape = async () => {
  return runAllScrapers();
};

export default {
  scrapeNewsImages,
  fetchFacebookMedia,
  fetchYouTubeVideos,
  fetchInstagramMedia,
  saveScrapedMedia,
  runAllScrapers,
  manualScrape
};
