import React, { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { Plus, Search, Edit, Trash2, Upload, BookOpen, Save, X } from 'lucide-react';

const CataloguingManager = () => {
  const { user } = useFirebaseAuth();
  const [records, setRecords] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Form state
  const [formData, setFormData] = useState({
    barcode: '',
    title: '',
    subtitle: '',
    author: '',
    additional_authors: '',
    isbn: '',
    issn: '',
    publisher: '',
    publication_year: '',
    edition: '',
    pages: '',
    language: 'English',
    material_type_id: '',
    subject_headings: '',
    keywords: '',
    abstract: '',
    cover_image_url: '',
    digital_link: '',
    location_shelf: '',
    notes: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentPage, searchTerm, selectedType]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      // Fetch material types
      const typesRes = await libraryService.getAllMaterialTypes();
      setMaterialTypes(typesRes.data);

      // Fetch records with pagination
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        material_type_id: selectedType
      };
      
      const recordsRes = await libraryService.getAllBibliographicRecords(params);
      setRecords(recordsRes.data.records || recordsRes.data);
      setTotalPages(recordsRes.data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch cataloguing data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateBarcode = async () => {
    try {
      const token = await user?.getIdToken();
      const res = await libraryService.generateBarcode(token);
      setFormData(prev => ({ ...prev, barcode: res.data.barcode }));
    } catch (err) {
      console.error('Failed to generate barcode:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await user?.getIdToken();
      
      if (editingRecord) {
        await libraryService.updateBibliographicRecord(editingRecord.id, formData, token);
        alert('Record updated successfully!');
      } else {
        await libraryService.createBibliographicRecord(formData, token);
        alert('Record created successfully!');
      }
      
      resetForm();
      fetchInitialData();
    } catch (err) {
      alert('Failed to save record: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      barcode: record.barcode || '',
      title: record.title || '',
      subtitle: record.subtitle || '',
      author: record.author || '',
      additional_authors: record.additional_authors || '',
      isbn: record.isbn || '',
      issn: record.issn || '',
      publisher: record.publisher || '',
      publication_year: record.publication_year || '',
      edition: record.edition || '',
      pages: record.pages || '',
      language: record.language || 'English',
      material_type_id: record.material_type_id || '',
      subject_headings: record.subject_headings || '',
      keywords: record.keywords || '',
      abstract: record.abstract || '',
      cover_image_url: record.cover_image_url || '',
      digital_link: record.digital_link || '',
      location_shelf: record.location_shelf || '',
      notes: record.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const token = await user?.getIdToken();
      await libraryService.deleteBibliographicRecord(id, token);
      alert('Record deleted successfully!');
      fetchInitialData();
    } catch (err) {
      alert('Failed to delete record: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      barcode: '',
      title: '',
      subtitle: '',
      author: '',
      additional_authors: '',
      isbn: '',
      issn: '',
      publisher: '',
      publication_year: '',
      edition: '',
      pages: '',
      language: 'English',
      material_type_id: '',
      subject_headings: '',
      keywords: '',
      abstract: '',
      cover_image_url: '',
      digital_link: '',
      location_shelf: '',
      notes: ''
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const handleBulkImport = () => {
    alert('Bulk import feature coming soon! You can use the API endpoint for CSV import.');
  };

  if (loading && records.length === 0) {
    return <div className="text-center py-10">Loading cataloguing manager...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Cataloguing Manager</h1>
            <p className="text-gray-600 mt-1">Add, edit, and manage bibliographic records</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBulkImport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Upload size={18} />
              Bulk Import
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Record
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen size={24} />
                  {editingRecord ? 'Edit Record' : 'Add New Record'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Barcode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        required
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter or generate barcode"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateBarcode}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Material Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material Type *
                    </label>
                    <select
                      name="material_type_id"
                      value={formData.material_type_id}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Material Type</option>
                      {materialTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} ({type.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter title"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter author name"
                    />
                  </div>

                  {/* Additional Authors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Authors
                    </label>
                    <input
                      type="text"
                      name="additional_authors"
                      value={formData.additional_authors}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Separate with semicolons"
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ISBN"
                    />
                  </div>

                  {/* ISSN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISSN
                    </label>
                    <input
                      type="text"
                      name="issn"
                      value={formData.issn}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ISSN"
                    />
                  </div>

                  {/* Publisher */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter publisher"
                    />
                  </div>

                  {/* Publication Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publication Year
                    </label>
                    <input
                      type="number"
                      name="publication_year"
                      value={formData.publication_year}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="YYYY"
                      min="1800"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  {/* Edition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Edition
                    </label>
                    <input
                      type="text"
                      name="edition"
                      value={formData.edition}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2nd Edition"
                    />
                  </div>

                  {/* Pages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pages
                    </label>
                    <input
                      type="number"
                      name="pages"
                      value={formData.pages}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Number of pages"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language *
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Location/Shelf */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location/Shelf
                    </label>
                    <input
                      type="text"
                      name="location_shelf"
                      value={formData.location_shelf}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A-12-3"
                    />
                  </div>

                  {/* Subject Headings */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Headings
                    </label>
                    <input
                      type="text"
                      name="subject_headings"
                      value={formData.subject_headings}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Separate with semicolons"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keywords
                    </label>
                    <input
                      type="text"
                      name="keywords"
                      value={formData.keywords}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Separate with commas"
                    />
                  </div>

                  {/* Abstract */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Abstract
                    </label>
                    <textarea
                      name="abstract"
                      value={formData.abstract}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter abstract or summary"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      name="cover_image_url"
                      value={formData.cover_image_url}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>

                  {/* Digital Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Digital Link
                    </label>
                    <input
                      type="url"
                      name="digital_link"
                      value={formData.digital_link}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/document.pdf"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Internal notes"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editingRecord ? 'Update Record' : 'Create Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Material Types</option>
              {materialTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No records found. Click "Add New Record" to create one.
                    </td>
                  </tr>
                ) : (
                  records.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.barcode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{record.title}</div>
                        {record.subtitle && (
                          <div className="text-gray-500 text-xs">{record.subtitle}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {record.material_type_name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.publication_year || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.location_shelf || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CataloguingManager;

