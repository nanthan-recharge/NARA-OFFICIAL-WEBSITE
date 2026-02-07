import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import * as Icons from 'lucide-react';
import { catalogueService } from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { generateBookCoverImage, generateBulkBookCovers, getBooksWithoutCovers } from '../../services/bookCoverAIService';

// All 26 NARA Material Types
const MATERIAL_TYPES = [
  { id: 1, code: 'ACT', name: 'Acts' },
  { id: 2, code: 'ATC', name: 'Atapattu Collection' },
  { id: 3, code: 'BOBP', name: 'BOBP Reports' },
  { id: 4, code: 'CD', name: 'CDs' },
  { id: 5, code: 'DMAP', name: 'Digital Map' },
  { id: 6, code: 'EBOOK', name: 'Electronic Books' },
  { id: 7, code: 'FAO', name: 'FAO Reports' },
  { id: 8, code: 'IOC', name: 'IOC Reports' },
  { id: 9, code: 'IWMI', name: 'IWMI Reports' },
  { id: 10, code: 'JR', name: 'Journal' },
  { id: 11, code: 'LBOOK', name: 'Lending Book' },
  { id: 12, code: 'MAP', name: 'Maps' },
  { id: 13, code: 'NEWS', name: 'Newspaper Articles' },
  { id: 14, code: 'PREF', name: 'Permanent Reference' },
  { id: 15, code: 'PROC', name: 'Proceedings' },
  { id: 16, code: 'UACOL', name: 'Prof. Upali Amarasinghe Collection' },
  { id: 17, code: 'RBOOK', name: 'Reference Book' },
  { id: 18, code: 'RPAPER', name: 'Research Papers' },
  { id: 19, code: 'RNARA', name: 'Research Reports - NARA' },
  { id: 20, code: 'SREF', name: 'Special Reference' },
  { id: 21, code: 'SLBOOK', name: 'Sri Lanka Collection - Books' },
  { id: 22, code: 'SLREP', name: 'Sri Lanka Collection - Reports' },
  { id: 23, code: 'THESIS', name: 'Thesis' },
  { id: 24, code: 'WFISH', name: 'World Fisheries Collection' },
  { id: 25, code: 'EJART', name: 'e-Journal Articles' },
  { id: 26, code: 'EREP', name: 'e-Reports' },
];

const EnhancedCataloguingManager = () => {
  const { user } = useFirebaseAuth();
  const [showForm, setShowForm] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const qrCanvasRef = useRef(null);

  // AI Cover Generation State
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
  const [bulkGenerateProgress, setBulkGenerateProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [bulkGenerateResults, setBulkGenerateResults] = useState([]);

  // Form state with all fields
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    additional_authors: '',
    isbn: '',
    issn: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    edition: '',
    pages: '',
    language: 'English',
    material_type_id: '11', // Default to Lending Book
    subject_headings: '',
    keywords: '',
    abstract: '',
    cover_image_url: '',
    url: '',
    call_number: '',
    location: 'Main Library',
    shelf_location: '',
    total_copies: '1',
    notes: '',
    barcode: ''
  });

  // Auto-generate barcode when form opens
  useEffect(() => {
    if (showForm && !formData.barcode) {
      generateBarcode();
    }
  }, [showForm]);

  // Generate QR code whenever barcode changes
  useEffect(() => {
    if (formData.barcode) {
      generateQRCode(formData.barcode);
    }
  }, [formData.barcode]);

  const generateBarcode = () => {
    // Generate unique barcode: NARA + timestamp + random
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const barcode = `NARA${timestamp}${random}`;
    setFormData(prev => ({ ...prev, barcode }));
  };

  const generateQRCode = async (barcode) => {
    try {
      setIsGeneratingQR(true);

      // Generate full URL for the book using barcode
      // This allows users to scan and directly access the book details
      const bookUrl = `${window.location.origin}/library/barcode/${barcode}`;

      // Generate QR code with the full URL
      const qrDataUrl = await QRCode.toDataURL(bookUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // High error correction for better scanning
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `QR_${formData.barcode}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const printQRCode = () => {
    if (!qrCodeUrl) return;

    const bookUrl = `${window.location.origin}/library/barcode/${formData.barcode}`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${formData.barcode}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #000;
            }
            img {
              max-width: 300px;
              margin: 20px 0;
            }
            .barcode-text {
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .book-title {
              font-size: 14px;
              margin: 5px 0;
            }
            .book-url {
              font-size: 11px;
              color: #666;
              margin: 5px 0;
              word-break: break-all;
            }
            .scan-instruction {
              font-size: 12px;
              color: #333;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="barcode-text">${formData.barcode}</div>
            <div class="book-title">${formData.title || 'Untitled'}</div>
            <div class="book-url">${bookUrl}</div>
            <div class="scan-instruction">Scan QR code to view book details online</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.material_type_id) {
        alert('Please fill in required fields: Title and Material Type');
        return;
      }

      // Prepare data for submission
      const bookData = {
        ...formData,
        available_copies: formData.total_copies, // Initially all copies are available
        created_by: user?.uid || 'admin',
        qr_code_url: qrCodeUrl // Save QR code with the record
      };

      // Submit to API (mock for now)
      console.log('Submitting book:', bookData);
      
      alert(`✅ Book added successfully!\n\nBarcode: ${formData.barcode}\nTitle: ${formData.title}\n\nQR Code has been generated and saved.`);
      
      // Reset form and generate new barcode for next book
      resetForm();
      
    } catch (error) {
      console.error('Error adding book:', error);
      alert('❌ Failed to add book. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      author: '',
      additional_authors: '',
      isbn: '',
      issn: '',
      publisher: '',
      publication_year: new Date().getFullYear(),
      edition: '',
      pages: '',
      language: 'English',
      material_type_id: '11',
      subject_headings: '',
      keywords: '',
      abstract: '',
      cover_image_url: '',
      url: '',
      call_number: '',
      location: 'Main Library',
      shelf_location: '',
      total_copies: '1',
      notes: '',
      barcode: ''
    });
    setQrCodeUrl('');
    generateBarcode();
  };

  const fetchISBNData = async () => {
    if (!formData.isbn) {
      alert('Please enter an ISBN first');
      return;
    }

    try {
      // Mock ISBN lookup (in production, use Google Books API or similar)
      alert('ISBN lookup feature coming soon! This will auto-fill book details from online databases.');
    } catch (error) {
      console.error('Error fetching ISBN data:', error);
    }
  };

  // Generate AI cover for single book
  const handleGenerateAICover = async () => {
    if (!formData.title) {
      alert('Please enter a book title first');
      return;
    }

    setIsGeneratingCover(true);

    try {
      const materialType = MATERIAL_TYPES.find(m => m.id === parseInt(formData.material_type_id));

      const result = await generateBookCoverImage(
        formData.title,
        formData.author,
        materialType?.code || 'BOOK',
        {
          subject: formData.subject_headings,
          year: formData.publication_year,
          language: formData.language
        }
      );

      if (result.success) {
        setFormData(prev => ({ ...prev, cover_image_url: result.imageUrl }));
        alert('✅ AI Book Cover Generated Successfully!\n\nThe cover image URL has been added to the form.');
      } else {
        alert('❌ Failed to generate book cover. Please try again.');
      }
    } catch (error) {
      console.error('Error generating AI cover:', error);
      alert('Error generating book cover: ' + error.message);
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Start bulk cover generation
  const handleBulkGenerateCovers = async () => {
    try {
      // Fetch all books from catalogue
      const response = await catalogueService.getAllItems({ limit: 1000 });

      if (!response.success || !response.data) {
        alert('Failed to load books from catalogue');
        return;
      }

      const allBooks = response.data;
      const booksWithoutCovers = getBooksWithoutCovers(allBooks);

      if (booksWithoutCovers.length === 0) {
        alert('✅ All books already have cover images!');
        return;
      }

      const confirmed = confirm(
        `Found ${booksWithoutCovers.length} books without cover images.\n\n` +
        `Do you want to generate AI covers for all of them?\n\n` +
        `This is FREE and will take approximately ${Math.ceil(booksWithoutCovers.length * 2 / 60)} minutes.`
      );

      if (!confirmed) return;

      setShowBulkGenerateModal(true);
      setBulkGenerateProgress({ current: 0, total: booksWithoutCovers.length, percentage: 0 });
      setBulkGenerateResults([]);

      const results = await generateBulkBookCovers(booksWithoutCovers, (progress) => {
        setBulkGenerateProgress(progress);
      });

      setBulkGenerateResults(results);

      // Update catalogue with new cover URLs
      const successful = results.filter(r => r.success);
      alert(
        `✅ Bulk Generation Complete!\n\n` +
        `Successfully generated: ${successful.length}/${results.length} covers\n\n` +
        `Note: Cover URLs have been generated. You can now update the database with these URLs.`
      );
    } catch (error) {
      console.error('Error in bulk generation:', error);
      alert('Error during bulk generation: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Cataloguing Manager</h1>
          <p className="text-gray-600">Add books with automatic QR code generation</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg p-6 hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-3 shadow-lg"
          >
            <Icons.Plus className="w-6 h-6" />
            <span className="font-semibold">Add New Book</span>
          </button>

          <button
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6 hover:from-purple-700 hover:to-purple-800 transition flex items-center justify-center gap-3 shadow-lg"
          >
            <Icons.Upload className="w-6 h-6" />
            <span className="font-semibold">Bulk Import (CSV)</span>
          </button>

          <button
            className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-3 shadow-lg"
          >
            <Icons.Scan className="w-6 h-6" />
            <span className="font-semibold">Scan ISBN Barcode</span>
          </button>

          <button
            onClick={handleBulkGenerateCovers}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6 hover:from-orange-600 hover:to-red-700 transition flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <Icons.Sparkles className="w-6 h-6 relative z-10" />
            <div className="relative z-10">
              <div className="font-semibold">AI Cover Generator</div>
              <div className="text-xs opacity-90">FREE - Bulk Create Covers</div>
            </div>
          </button>
        </div>

        {/* Add Book Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-20 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8 mt-4">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.BookPlus className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Add New Book</h2>
                    <p className="text-cyan-100 text-sm">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Main Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icons.BookOpen className="w-5 h-5 text-cyan-600" />
                        Basic Information
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Enter book title"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Enter subtitle (optional)"
                          />
                        </div>

                        {/* Author */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Author
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Enter author name"
                          />
                        </div>

                        {/* Additional Authors */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Authors
                          </label>
                          <input
                            type="text"
                            name="additional_authors"
                            value={formData.additional_authors}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Separate multiple authors with commas"
                          />
                        </div>

                        {/* ISBN with Lookup */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ISBN
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="isbn"
                              value={formData.isbn}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder="Enter ISBN"
                            />
                            <button
                              type="button"
                              onClick={fetchISBNData}
                              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                              <Icons.Search className="w-4 h-4" />
                              Lookup
                            </button>
                          </div>
                        </div>

                        {/* Material Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Material Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="material_type_id"
                            value={formData.material_type_id}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                          >
                            {MATERIAL_TYPES.map(type => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Publication Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icons.FileText className="w-5 h-5 text-cyan-600" />
                        Publication Details
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publisher
                          </label>
                          <input
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Publisher name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publication Year
                          </label>
                          <input
                            type="number"
                            name="publication_year"
                            value={formData.publication_year}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="2024"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Edition
                          </label>
                          <input
                            type="text"
                            name="edition"
                            value={formData.edition}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="1st, 2nd, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pages
                          </label>
                          <input
                            type="text"
                            name="pages"
                            value={formData.pages}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Number of pages"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                          >
                            <option value="English">English</option>
                            <option value="Sinhala">Sinhala</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Copies
                          </label>
                          <input
                            type="number"
                            name="total_copies"
                            value={formData.total_copies}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icons.MapPin className="w-5 h-5 text-cyan-600" />
                        Location Details
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Main Library"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shelf Location
                          </label>
                          <input
                            type="text"
                            name="shelf_location"
                            value={formData.shelf_location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="A-12, B-5, etc."
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Call Number
                          </label>
                          <input
                            type="text"
                            name="call_number"
                            value={formData.call_number}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="QH91.5 .S55 2024"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Abstract & Keywords */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icons.AlignLeft className="w-5 h-5 text-cyan-600" />
                        Description & Keywords
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Abstract
                          </label>
                          <textarea
                            name="abstract"
                            value={formData.abstract}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Brief description of the book content..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords
                          </label>
                          <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="marine, biology, conservation (comma-separated)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject Headings
                          </label>
                          <input
                            type="text"
                            name="subject_headings"
                            value={formData.subject_headings}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
                            placeholder="Marine Biology, Oceanography (comma-separated)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - QR Code & Actions */}
                  <div className="space-y-6">
                    {/* QR Code Display */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 sticky top-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Icons.QrCode className="w-5 h-5 text-cyan-600" />
                        Auto-Generated QR Code
                      </h3>
                      
                      {/* Barcode Display */}
                      <div className="bg-white rounded-lg p-4 mb-4 text-center">
                        <div className="text-sm text-gray-600 mb-2">Barcode</div>
                        <div className="text-2xl font-bold text-gray-900 font-mono mb-2">
                          {formData.barcode}
                        </div>
                        <button
                          type="button"
                          onClick={generateBarcode}
                          className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 mx-auto"
                        >
                          <Icons.RefreshCw className="w-4 h-4" />
                          Regenerate
                        </button>
                      </div>

                      {/* QR Code Image */}
                      {qrCodeUrl && (
                        <div className="bg-white rounded-lg p-6 mb-4 flex items-center justify-center">
                          <img 
                            src={qrCodeUrl} 
                            alt="QR Code" 
                            className="w-48 h-48"
                          />
                        </div>
                      )}

                      {isGeneratingQR && (
                        <div className="text-center text-gray-600 py-8">
                          <Icons.Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          Generating QR Code...
                        </div>
                      )}

                      {/* AI Cover Generation */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Icons.Sparkles className="w-4 h-4 text-orange-500" />
                          AI Book Cover (FREE)
                        </h4>

                        {formData.cover_image_url && (
                          <div className="mb-3 bg-gray-100 rounded-lg p-2">
                            <img
                              src={formData.cover_image_url}
                              alt="Book Cover Preview"
                              className="w-full h-64 object-contain rounded-lg bg-white"
                              onError={(e) => {
                                e.target.parentElement.innerHTML = `
                                  <div class="h-64 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
                                    <div class="text-center p-4">
                                      <svg class="w-12 h-12 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      <p class="text-sm text-red-600 font-medium">Failed to load cover image</p>
                                      <p class="text-xs text-red-500 mt-1">Try generating again</p>
                                    </div>
                                  </div>
                                `;
                              }}
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center truncate">
                              {formData.cover_image_url}
                            </p>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handleGenerateAICover}
                          disabled={isGeneratingCover || !formData.title}
                          className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                          {isGeneratingCover ? (
                            <>
                              <Icons.Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Icons.Wand2 className="w-4 h-4" />
                              Generate AI Cover
                            </>
                          )}
                        </button>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Powered by Pollinations.ai - 100% Free
                        </p>
                      </div>

                      {/* QR Code Actions */}
                      <div className="space-y-2 mt-6">
                        <button
                          type="button"
                          onClick={downloadQRCode}
                          disabled={!qrCodeUrl}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icons.Download className="w-4 h-4" />
                          Download QR Code
                        </button>

                        <button
                          type="button"
                          onClick={printQRCode}
                          disabled={!qrCodeUrl}
                          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icons.Printer className="w-4 h-4" />
                          Print QR Label
                        </button>
                      </div>

                      {/* Info Box */}
                      <div className="mt-4 bg-cyan-100 border border-cyan-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Icons.Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-cyan-900">
                            <p className="font-semibold mb-1">Auto-Generated QR Code</p>
                            <p className="text-xs">
                              This QR code is automatically generated for each book. 
                              Print and attach it to the book cover for easy scanning.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Icons.X className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                  >
                    <Icons.RotateCcw className="w-4 h-4" />
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition flex items-center gap-2 font-semibold shadow-lg"
                  >
                    <Icons.Save className="w-4 h-4" />
                    Save Book & Generate QR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!showForm && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.BookPlus className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Add Book Details</h3>
                <p className="text-sm text-gray-600">
                  Fill in the book information. Barcode is auto-generated.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.QrCode className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. QR Code Generated</h3>
                <p className="text-sm text-gray-600">
                  QR code is automatically created for the book barcode.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Printer className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Print & Attach</h3>
                <p className="text-sm text-gray-600">
                  Download or print the QR code label to attach to the book.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCataloguingManager;

