import { openDB } from 'idb';

/**
 * OFFLINE LIBRARY SERVICE
 * IndexedDB storage for offline reading
 */

const DB_NAME = 'NaraLibraryOffline';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';
const TRANSLATIONS_STORE = 'translations';

class OfflineLibraryService {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Books store
          if (!db.objectStoreNames.contains(BOOKS_STORE)) {
            const booksStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
            booksStore.createIndex('title', 'title');
            booksStore.createIndex('author', 'author');
            booksStore.createIndex('downloadedAt', 'downloadedAt');
          }

          // Translations store
          if (!db.objectStoreNames.contains(TRANSLATIONS_STORE)) {
            const translationsStore = db.createObjectStore(TRANSLATIONS_STORE, { 
              keyPath: ['bookId', 'language'] 
            });
            translationsStore.createIndex('bookId', 'bookId');
          }
        },
      });

      console.log('✅ Offline library database initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize offline database:', error);
      return false;
    }
  }

  /**
   * Save book for offline reading
   */
  async saveBookOffline(book) {
    try {
      if (!this.db) await this.init();

      const bookData = {
        ...book,
        downloadedAt: new Date().toISOString(),
        offline: true
      };

      await this.db.put(BOOKS_STORE, bookData);
      console.log(`✅ Book saved offline: ${book.title}`);
      
      return { success: true, message: 'Book saved for offline reading' };
    } catch (error) {
      console.error('❌ Failed to save book offline:', error);
      throw new Error(`Failed to save offline: ${error.message}`);
    }
  }

  /**
   * Save translation offline
   */
  async saveTranslationOffline(bookId, language, content) {
    try {
      if (!this.db) await this.init();

      const translationData = {
        bookId,
        language,
        content,
        savedAt: new Date().toISOString()
      };

      await this.db.put(TRANSLATIONS_STORE, translationData);
      console.log(`✅ Translation saved offline: ${bookId} (${language})`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to save translation offline:', error);
      throw error;
    }
  }

  /**
   * Get offline book
   */
  async getOfflineBook(bookId) {
    try {
      if (!this.db) await this.init();
      
      const book = await this.db.get(BOOKS_STORE, bookId);
      return book || null;
    } catch (error) {
      console.error('❌ Failed to get offline book:', error);
      return null;
    }
  }

  /**
   * Get all offline books
   */
  async getAllOfflineBooks() {
    try {
      if (!this.db) await this.init();
      
      const books = await this.db.getAll(BOOKS_STORE);
      console.log(`📚 Found ${books.length} offline books`);
      return books;
    } catch (error) {
      console.error('❌ Failed to get offline books:', error);
      return [];
    }
  }

  /**
   * Get offline translation
   */
  async getOfflineTranslation(bookId, language) {
    try {
      if (!this.db) await this.init();
      
      const translation = await this.db.get(TRANSLATIONS_STORE, [bookId, language]);
      return translation?.content || null;
    } catch (error) {
      console.error('❌ Failed to get offline translation:', error);
      return null;
    }
  }

  /**
   * Get all translations for a book
   */
  async getBookTranslations(bookId) {
    try {
      if (!this.db) await this.init();
      
      const tx = this.db.transaction(TRANSLATIONS_STORE, 'readonly');
      const index = tx.store.index('bookId');
      const translations = await index.getAll(bookId);
      
      return translations;
    } catch (error) {
      console.error('❌ Failed to get book translations:', error);
      return [];
    }
  }

  /**
   * Delete offline book
   */
  async deleteOfflineBook(bookId) {
    try {
      if (!this.db) await this.init();
      
      await this.db.delete(BOOKS_STORE, bookId);
      
      // Also delete all translations
      const translations = await this.getBookTranslations(bookId);
      for (const trans of translations) {
        await this.db.delete(TRANSLATIONS_STORE, [bookId, trans.language]);
      }
      
      console.log(`✅ Deleted offline book: ${bookId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete offline book:', error);
      throw error;
    }
  }

  /**
   * Check if book is available offline
   */
  async isBookOffline(bookId) {
    try {
      if (!this.db) await this.init();
      
      const book = await this.db.get(BOOKS_STORE, bookId);
      return !!book;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage
   */
  async getStorageInfo() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage,
          quota: estimate.quota,
          percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
          usageMB: (estimate.usage / (1024 * 1024)).toFixed(2),
          quotaMB: (estimate.quota / (1024 * 1024)).toFixed(2)
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      return null;
    }
  }

  /**
   * Clear all offline data
   */
  async clearAllOfflineData() {
    try {
      if (!this.db) await this.init();
      
      await this.db.clear(BOOKS_STORE);
      await this.db.clear(TRANSLATIONS_STORE);
      
      console.log('✅ All offline data cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to clear offline data:', error);
      throw error;
    }
  }

  /**
   * Export offline library
   */
  async exportOfflineLibrary() {
    try {
      if (!this.db) await this.init();
      
      const books = await this.getAllOfflineBooks();
      const allTranslations = [];
      
      for (const book of books) {
        const translations = await this.getBookTranslations(book.id);
        allTranslations.push(...translations);
      }
      
      return {
        books,
        translations: allTranslations,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to export offline library:', error);
      throw error;
    }
  }

  /**
   * Import offline library
   */
  async importOfflineLibrary(data) {
    try {
      if (!this.db) await this.init();
      
      // Import books
      for (const book of data.books) {
        await this.db.put(BOOKS_STORE, book);
      }
      
      // Import translations
      for (const translation of data.translations) {
        await this.db.put(TRANSLATIONS_STORE, translation);
      }
      
      console.log(`✅ Imported ${data.books.length} books and ${data.translations.length} translations`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to import offline library:', error);
      throw error;
    }
  }
}

export const offlineLibraryService = new OfflineLibraryService();
export default offlineLibraryService;
