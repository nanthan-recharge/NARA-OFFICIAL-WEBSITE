import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Image, Plus, Trash2, MoveVertical, Save, X, ArrowLeft,
  RefreshCw, Eye, Upload, GripVertical, CheckCircle, AlertCircle
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';

/**
 * Hero Images Admin Page
 * Manage hero section carousel images (up to 8 images)
 */
const HeroImagesAdmin = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({
    url: '',
    title: { en: '', si: '', ta: '' },
    caption: { en: '', si: '', ta: '' },
    active: true
  });
  const [dragEnabled, setDragEnabled] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const MAX_IMAGES = 8;

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const imagesRef = collection(db, 'hero_images');
      const q = query(imagesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const imagesData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        order: doc.data().order ?? index
      }));
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (images.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed in the hero carousel.`);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'hero_images'), {
        ...newImage,
        order: images.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowAddForm(false);
      setNewImage({
        url: '',
        title: { en: '', si: '', ta: '' },
        caption: { en: '', si: '', ta: '' },
        active: true
      });
      loadImages();
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteDoc(doc(db, 'hero_images', id));

        // Try to delete from storage if it's a Firebase storage URL
        if (imageUrl && imageUrl.includes('firebasestorage')) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (storageError) {
            console.log('Could not delete from storage:', storageError);
          }
        }

        loadImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await updateDoc(doc(db, 'hero_images', id), {
        active: !currentActive,
        updatedAt: serverTimestamp()
      });
      loadImages();
    } catch (error) {
      console.error('Error toggling image:', error);
    }
  };

  const handleReorder = async (newOrder) => {
    setImages(newOrder);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    setLoading(true);
    try {
      const batch = writeBatch(db);
      images.forEach((image, index) => {
        const imageRef = doc(db, 'hero_images', image.id);
        batch.update(imageRef, { order: index, updatedAt: serverTimestamp() });
      });
      await batch.commit();
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const fileName = `hero_images/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setNewImage(prev => ({ ...prev, url: downloadUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin/master')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <Image size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Hero Images Manager</h1>
                <p className="text-white/70">Manage homepage carousel images (Max {MAX_IMAGES} images)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={saveOrder}
                  className="flex items-center gap-2 bg-white text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  <Save size={20} />
                  Save Order
                </button>
              )}
              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-white text-orange-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  <Plus size={20} />
                  Add Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-800">Important Notes</h3>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• The first slide should display both Government of Sri Lanka logo and NARA logo</li>
              <li>• Images will auto-rotate every 5 seconds on the homepage</li>
              <li>• Recommended image size: 1920x800 pixels (16:9 aspect ratio)</li>
              <li>• Drag and drop to reorder images</li>
            </ul>
          </div>
        </div>

        {/* Image Count Status */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <strong>{images.filter(img => img.active).length}</strong> active images of <strong>{MAX_IMAGES}</strong> maximum
            </span>
            {images.length >= MAX_IMAGES && (
              <span className="text-orange-600 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                Maximum images reached
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDragEnabled(!dragEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                dragEnabled ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <MoveVertical size={16} />
              {dragEnabled ? 'Reordering Mode' : 'Enable Reorder'}
            </button>
            <button
              onClick={loadImages}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Images List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No hero images yet</h3>
            <p className="text-gray-500 mt-2">Add your first hero image to get started</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-4">
            {images.map((image, index) => (
              <Reorder.Item
                key={image.id}
                value={image}
                dragListener={dragEnabled}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${dragEnabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Drag Handle */}
                  {dragEnabled && (
                    <div className="text-gray-400 cursor-grab">
                      <GripVertical size={24} />
                    </div>
                  )}

                  {/* Order Number */}
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold">
                    {index + 1}
                  </div>

                  {/* Image Preview */}
                  <div className="w-40 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.title?.en || 'Hero image'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Image size={32} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {image.title?.en || `Hero Image ${index + 1}`}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        image.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {image.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {image.caption?.en && (
                      <p className="text-sm text-gray-500 line-clamp-1">{image.caption.en}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{image.url}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(image.id, image.active)}
                      className={`p-2 rounded-lg transition ${
                        image.active ? 'hover:bg-green-50' : 'hover:bg-gray-100'
                      }`}
                      title={image.active ? 'Deactivate' : 'Activate'}
                    >
                      <CheckCircle size={20} className={image.active ? 'text-green-600' : 'text-gray-400'} />
                    </button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="View Full Image"
                    >
                      <Eye size={20} className="text-gray-600" />
                    </a>
                    <button
                      onClick={() => handleDeleteImage(image.id, image.url)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Add Image Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Hero Image</h2>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddImage} className="p-6 space-y-6">
                {/* Image Upload/URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>

                  {/* Upload Button */}
                  <div className="mb-3">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-gray-600">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="text-center text-sm text-gray-500 mb-3">or paste image URL</div>

                  <input
                    type="url"
                    value={newImage.url}
                    onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />

                  {/* Preview */}
                  {newImage.url && (
                    <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={newImage.url}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={newImage.title.en}
                    onChange={(e) => setNewImage({...newImage, title: {...newImage.title, en: e.target.value}})}
                    placeholder="e.g., NARA Headquarters"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption (English)</label>
                  <input
                    type="text"
                    value={newImage.caption.en}
                    onChange={(e) => setNewImage({...newImage, caption: {...newImage.caption, en: e.target.value}})}
                    placeholder="Brief description..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={newImage.active}
                    onChange={(e) => setNewImage({...newImage, active: e.target.checked})}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">Active (show on homepage)</label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading || !newImage.url}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                  >
                    <Plus size={18} />
                    Add Image
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

export default HeroImagesAdmin;
