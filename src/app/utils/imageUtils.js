// src/app/utils/imageUtils.js
export const getRandomPlaceholder = () => {
    const placeholders = [
      '/images/placeholder1.jpg',
      '/images/placeholder2.jpg',
      '/images/placeholder3.jpg',
      '/images/placeholder4.jpg',
      '/images/placeholder5.jpg',
      '/images/placeholder6.jpg'
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

  // src/utils/imageUtils.js
export const validateImage = (file) => {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.');
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  return true;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};