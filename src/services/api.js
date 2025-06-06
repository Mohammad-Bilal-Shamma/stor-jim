const BASE_URL = 'https://lib-dashboard-lovat.vercel.app/api/clint';

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Transform product data to include full image URL
const transformProduct = (product) => ({
  ...product,
  image: getImageUrl(product.image),
});

// Fetch products with optional filters
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
  if (filters.authorId) queryParams.append('authorId', filters.authorId);
  if (filters.search) queryParams.append('search', filters.search);

  const response = await fetch(
    `${BASE_URL}/products?${queryParams.toString()}`
  );
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data.map(transformProduct);
};

// Fetch single product by ID
export const getProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return transformProduct(data.data);
};

// Fetch all categories
export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Fetch all authors
export const getAuthors = async () => {
  const response = await fetch(`${BASE_URL}/authors`);
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    // Import offline storage utilities dynamically to avoid circular dependencies
    const { isOnline, saveOrderOffline } = await import('./offlineStorage');
    
    // Check if the user is online
    if (!isOnline()) {
      // If offline, save the order to IndexedDB
      const result = await saveOrderOffline(orderData);
      return {
        ...result,
        isOffline: true,
        message: 'تم حفظ الطلب محليًا وسيتم إرساله عند استعادة الاتصال بالإنترنت',
      };
    }
    
    // If online, proceed with the API request
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  } catch (error) {
    // If the error is due to network issues, try to save offline
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const { saveOrderOffline } = await import('./offlineStorage');
      const result = await saveOrderOffline(orderData);
      return {
        ...result,
        isOffline: true,
        message: 'تم حفظ الطلب محليًا وسيتم إرساله عند استعادة الاتصال بالإنترنت',
      };
    }
    
    // Re-throw other errors
    throw error;
  }
};
