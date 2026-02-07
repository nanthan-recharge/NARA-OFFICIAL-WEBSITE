import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Package, Edit, Trash2, Search, X,
  Upload, DollarSign, Download, Eye, CheckCircle
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/marketplaceService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const MarketplaceProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Dataset',
    price: 0,
    description: '',
    format: '',
    size: '',
    tags: [],
    thumbnail: '',
    status: 'active'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      if (thumbnailFile) {
        const storageRef = ref(storage, `marketplace/products/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(storageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        ...formData,
        thumbnail: thumbnailUrl,
        price: parseFloat(formData.price) || 0,
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        await createProduct(productData);
        alert('Product created successfully!');
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      category: product.category || 'Dataset',
      price: product.price || 0,
      description: product.description || '',
      format: product.format || '',
      size: product.size || '',
      tags: product.tags || [],
      thumbnail: product.thumbnail || '',
      status: product.status || 'active'
    });
    setThumbnailPreview(product.thumbnail);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(productId);
      alert('Product deleted successfully!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Dataset',
      price: 0,
      description: '',
      format: '',
      size: '',
      tags: [],
      thumbnail: '',
      status: 'active'
    });
    setEditingProduct(null);
    setShowForm(false);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value.trim()]
      });
      e.target.value = '';
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#0066CC]">
              Marketplace Products
            </h1>
            <p className="text-slate-500 mt-2">Manage digital products and inventory</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] rounded-lg font-semibold text-white hover:shadow-lg shadow-sm transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Total Products</p>
            <h3 className="text-3xl font-bold text-[#0066CC] mt-2">{products.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Active</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">
              {products.filter(p => p.status === 'active').length}
            </h3>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Revenue</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">
              LKR {products.reduce((sum, p) => sum + ((p.revenue || 0)), 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50/50 border border-orange-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Sales</p>
            <h3 className="text-3xl font-bold text-orange-400 mt-2">
              {products.reduce((sum, p) => sum + (p.sales || 0), 0)}
            </h3>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
          />
        </div>

        {loading && !showForm ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/50 border border-slate-300 rounded-xl overflow-hidden hover:border-[#0066CC]/50 transition"
              >
                <div className="relative h-48 bg-slate-100">
                  {product.thumbnail ? (
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-[#0066CC] rounded-full text-xs">
                      {product.category}
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      {product.price === 0 ? 'FREE' : `LKR ${product.price?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-[#0066CC] rounded-lg hover:bg-blue-100 transition"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !loading && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-300 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg transition" disabled={loading}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Thumbnail</label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <img src={thumbnailPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#0066CC] transition">
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-sm text-slate-500">Click to upload</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                    placeholder="Enter product title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                    >
                      <option value="Dataset">Dataset</option>
                      <option value="Software">Software</option>
                      <option value="Publication">Publication</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Price (LKR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                      placeholder="0 for free"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Format</label>
                    <input
                      type="text"
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                      placeholder="e.g., PDF, CSV"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Size</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                      placeholder="e.g., 2.3 GB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Tags (Press Enter)</label>
                  <input
                    type="text"
                    onKeyDown={handleAddTag}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none mb-2"
                    placeholder="Add tags..."
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-[#0066CC] rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)} className="hover:text-red-400 transition">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-lg font-semibold hover:shadow-lg shadow-sm transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplaceProductsAdmin;
