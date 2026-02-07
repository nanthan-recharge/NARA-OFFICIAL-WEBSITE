import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';

/**
 * WORLD-CLASS BOOK DOWNLOAD SERVICE
 * PDF, EPUB, Offline packages with translations
 */

class BookDownloadService {
  constructor() {
    this.downloads = new Map();
  }

  /**
   * Download book as PDF
   */
  async downloadAsPDF(book) {
    try {
      console.log(`📥 Generating PDF for "${book.title}"...`);
      
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });

      // Title Page
      doc.setFontSize(24);
      doc.text(book.title, 20, 30, { maxWidth: 170 });
      
      // Author
      doc.setFontSize(14);
      doc.text(`By ${book.author || 'Unknown Author'}`, 20, 45);
      
      // ISBN
      if (book.isbn) {
        doc.setFontSize(10);
        doc.text(`ISBN: ${book.isbn}`, 20, 55);
      }
      
      // Add new page for content
      doc.addPage();
      
      // Content
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(book.content || book.description, 170);
      let y = 20;
      
      for (const line of lines) {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 7;
      }
      
      // Footer on last page
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      doc.setFontSize(8);
      doc.text('Downloaded from NARA Digital Library', 20, 290);
      doc.text(new Date().toLocaleDateString(), 170, 290);
      
      // Save
      doc.save(`${this.sanitizeFilename(book.title)}.pdf`);
      console.log('✅ PDF downloaded successfully');
      
      return { success: true, filename: `${book.title}.pdf` };
    } catch (error) {
      console.error('PDF download error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Download book as text file
   */
  async downloadAsTXT(book) {
    try {
      console.log(`📥 Downloading "${book.title}" as TXT...`);
      
      const content = `${book.title}\n${'='.repeat(book.title.length)}\n\nBy ${book.author || 'Unknown'}\n\n${book.content || book.description}\n\n---\nDownloaded from NARA Digital Library\n${new Date().toLocaleDateString()}`;
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${this.sanitizeFilename(book.title)}.txt`);
      
      console.log('✅ TXT downloaded successfully');
      return { success: true, filename: `${book.title}.txt` };
    } catch (error) {
      console.error('TXT download error:', error);
      throw new Error(`Failed to download TXT: ${error.message}`);
    }
  }

  /**
   * Download offline package (with translations)
   */
  async downloadOfflinePackage(book, translations = {}) {
    try {
      console.log(`📦 Creating offline package for "${book.title}"...`);
      
      const zip = new JSZip();
      
      // Add original content
      zip.file('original.txt', book.content || book.description);
      
      // Add metadata
      const metadata = {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        category: book.category,
        language: book.language || 'en',
        downloadedAt: new Date().toISOString(),
        source: 'NARA Digital Library'
      };
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));
      
      // Add translations
      if (Object.keys(translations).length > 0) {
        const translationsFolder = zip.folder('translations');
        for (const [lang, content] of Object.entries(translations)) {
          translationsFolder.file(`${lang}.txt`, content);
        }
      }
      
      // Add cover image if available
      if (book.coverImage) {
        try {
          const response = await fetch(book.coverImage);
          const blob = await response.blob();
          zip.file('cover.jpg', blob);
        } catch (e) {
          console.warn('Could not add cover image');
        }
      }
      
      // Add standalone HTML reader
      const readerHTML = this.generateOfflineReader(book, translations);
      zip.file('reader.html', readerHTML);
      
      // Add README
      const readme = `# ${book.title}\n\nOffline reading package from NARA Digital Library\n\n## Contents:\n- reader.html - Open this in your browser to read\n- original.txt - Book content\n- translations/ - Translated versions\n- metadata.json - Book information\n\n## How to read:\n1. Extract this ZIP file\n2. Open reader.html in your web browser\n3. Enjoy offline reading!\n\nDownloaded: ${new Date().toLocaleString()}`;
      zip.file('README.md', readme);
      
      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${this.sanitizeFilename(book.title)}-offline.zip`);
      
      console.log('✅ Offline package created');
      return { success: true, filename: `${book.title}-offline.zip` };
    } catch (error) {
      console.error('Offline package error:', error);
      throw new Error(`Failed to create offline package: ${error.message}`);
    }
  }

  /**
   * Generate standalone HTML reader
   */
  generateOfflineReader(book, translations) {
    const translationOptions = Object.keys(translations).map(lang => 
      `<option value="${lang}">${lang.toUpperCase()}</option>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${book.title} - NARA Offline Reader</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.8;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        h1 {
            margin-bottom: 10px;
            color: #1a1a1a;
            font-size: 2.5em;
        }
        .author {
            color: #666;
            margin-bottom: 30px;
            font-style: italic;
            font-size: 1.2em;
        }
        .toolbar {
            margin-bottom: 30px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 8px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            align-items: center;
        }
        select, button {
            padding: 10px 15px;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
        }
        button {
            background: #0891b2;
            color: white;
            border: none;
        }
        button:hover { background: #0e7490; }
        .content {
            font-size: 18px;
            text-align: justify;
            color: #333;
        }
        .content p { margin-bottom: 20px; }
        .theme-dark {
            background: #1a1a1a;
            color: #e0e0e0;
        }
        .theme-dark .container { background: #2d2d2d; color: #e0e0e0; }
        .theme-dark h1 { color: #fff; }
        .theme-dark .toolbar { background: #3d3d3d; }
        .theme-sepia { background: #f4ecd8; }
        .theme-sepia .container { background: #fef9e7; }
        .theme-sepia .content { color: #5c4a1c; }
        @media print {
            body { background: white; padding: 0; }
            .toolbar { display: none; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${book.title}</h1>
        <div class="author">By ${book.author || 'Unknown Author'}</div>
        
        <div class="toolbar">
            <div>
                <label>Language: </label>
                <select id="langSelect" onchange="changeLanguage()">
                    <option value="original">Original</option>
                    ${translationOptions}
                </select>
            </div>
            <div>
                <label>Theme: </label>
                <select id="themeSelect" onchange="changeTheme()">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="sepia">Sepia</option>
                </select>
            </div>
            <div>
                <label>Font Size: </label>
                <button onclick="changeFontSize(-2)">A-</button>
                <button onclick="changeFontSize(2)">A+</button>
            </div>
            <button onclick="window.print()">🖨️ Print</button>
        </div>
        
        <div class="content" id="bookContent"></div>
    </div>
    
    <script>
        const translations = ${JSON.stringify(translations)};
        const originalContent = ${JSON.stringify(book.content || book.description)};
        let currentFontSize = 18;
        
        // Initialize
        changeLanguage();
        
        function changeLanguage() {
            const lang = document.getElementById('langSelect').value;
            const contentDiv = document.getElementById('bookContent');
            
            let content = lang === 'original' ? originalContent : translations[lang];
            if (!content) content = originalContent;
            
            contentDiv.innerHTML = content
                .split('\\n\\n')
                .map(p => '<p>' + p + '</p>')
                .join('');
        }
        
        function changeTheme() {
            const theme = document.getElementById('themeSelect').value;
            document.body.className = theme === 'light' ? '' : 'theme-' + theme;
        }
        
        function changeFontSize(delta) {
            currentFontSize = Math.max(12, Math.min(32, currentFontSize + delta));
            document.getElementById('bookContent').style.fontSize = currentFontSize + 'px';
        }
        
        // Save reading position
        window.addEventListener('scroll', () => {
            localStorage.setItem('readingPosition_${book.title}', window.scrollY);
        });
        
        // Restore reading position
        const savedPosition = localStorage.getItem('readingPosition_${book.title}');
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition));
        }
    </script>
</body>
</html>`;
  }

  /**
   * Track download progress
   */
  trackDownload(bookId, progress) {
    this.downloads.set(bookId, progress);
  }

  /**
   * Get download status
   */
  getDownloadStatus(bookId) {
    return this.downloads.get(bookId) || { status: 'idle', progress: 0 };
  }

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  /**
   * Download from URL
   */
  async downloadFromURL(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
      return { success: true, filename };
    } catch (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
}

export const bookDownloadService = new BookDownloadService();
export default bookDownloadService;
