/**
 * Client-side image conversion to WebP format
 * Used by NewsAdmin for automatic image optimization on upload
 */

/**
 * Load a File/Blob as an HTMLImageElement
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Check if the browser supports WebP encoding
 */
function supportsWebP() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Convert an image file to WebP format with optional resizing
 * @param {File} file - The input image file
 * @param {number} maxWidth - Maximum width (maintains aspect ratio)
 * @param {number} quality - WebP quality (0-1), default 0.92 for HD quality
 * @returns {Promise<{blob: Blob, width: number, height: number, originalSize: number, convertedSize: number, format: string}>}
 */
export async function convertToWebP(file, maxWidth = 2400, quality = 0.92) {
  const img = await loadImage(file);
  const originalSize = file.size;

  // Calculate dimensions (maintain aspect ratio)
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * ratio);
  }

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Convert to WebP (or JPEG fallback)
  const useWebP = supportsWebP();
  const mimeType = useWebP ? 'image/webp' : 'image/jpeg';
  const format = useWebP ? 'webp' : 'jpeg';

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality);
  });

  return {
    blob,
    width,
    height,
    originalSize,
    convertedSize: blob.size,
    format,
    mimeType,
  };
}

/**
 * Generate a small thumbnail for preview/list views
 * @param {File} file - The input image file
 * @param {number} size - Maximum dimension (width or height)
 * @returns {Promise<{blob: Blob, width: number, height: number}>}
 */
export async function generateThumbnail(file, size = 400) {
  return convertToWebP(file, size, 0.7);
}

/**
 * Create a preview URL from a File for immediate display
 * @param {File} file - The input image file
 * @returns {string} Object URL (must be revoked when done)
 */
export function createPreviewURL(file) {
  return URL.createObjectURL(file);
}

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
