import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

export const getProducts = async (filters = {}) => {
  try {
    let q = collection(db, 'marketplace_products');
    const constraints = [where('status', '==', 'active')];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.minRating) {
      constraints.push(where('averageRating', '>=', filters.minRating));
    }

    constraints.push(orderBy(filters.sortBy || 'createdAt', 'desc'));

    if (filters.limit) {
      constraints.push(firestoreLimit(filters.limit));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (productId) => {
  try {
    const docRef = doc(db, 'marketplace_products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData, files = []) => {
  try {
    const productRef = doc(collection(db, 'marketplace_products'));
    
    // Upload files if provided
    const fileUrls = [];
    for (const file of files) {
      const fileRef = ref(storage, `marketplace/${productRef.id}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      fileUrls.push({ name: file.name, url, size: file.size });
    }

    await setDoc(productRef, {
      ...productData,
      files: fileUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      downloads: 0,
      sales: 0,
      revenue: 0,
      averageRating: 0,
      reviewCount: 0,
      status: 'active'
    });

    return { id: productRef.id, success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = doc(db, 'marketplace_products', productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'marketplace_products', productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ============================================
// ORDERS MANAGEMENT
// ============================================

export const createOrder = async (orderData) => {
  try {
    const orderRef = doc(collection(db, 'marketplace_orders'));
    await setDoc(orderRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });

    // Update product sales count
    for (const item of orderData.items) {
      const productRef = doc(db, 'marketplace_products', item.productId);
      await updateDoc(productRef, {
        sales: increment(1),
        revenue: increment(item.price)
      });
    }

    return { id: orderRef.id, success: true };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'marketplace_orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// ============================================
// REVIEWS MANAGEMENT
// ============================================

export const addReview = async (productId, reviewData) => {
  try {
    const reviewRef = doc(collection(db, 'marketplace_reviews'));
    await setDoc(reviewRef, {
      productId,
      ...reviewData,
      createdAt: serverTimestamp()
    });

    // Update product rating
    const productRef = doc(db, 'marketplace_products', productId);
    const product = await getDoc(productRef);
    const currentData = product.data();
    const newReviewCount = (currentData.reviewCount || 0) + 1;
    const newAverageRating = ((currentData.averageRating || 0) * (currentData.reviewCount || 0) + reviewData.rating) / newReviewCount;

    await updateDoc(productRef, {
      reviewCount: newReviewCount,
      averageRating: newAverageRating
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const q = query(
      collection(db, 'marketplace_reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// ============================================
// CATEGORIES
// ============================================

export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'marketplace_categories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getUserOrders,
  addReview,
  getProductReviews,
  getCategories
};
