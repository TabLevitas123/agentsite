// Simple utility function to handle image validation
export const validateImage = (file: File): boolean => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return false;
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return false;
  }

  return true;
};

// Convert file to base64 for local storage
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
