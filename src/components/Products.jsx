import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useLocation } from 'react-router-dom';
import { getProducts, getCategories, getAuthors } from '../services/api';

const Products = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    authorId: '',
  });
  const [sortOption, setSortOption] = useState('default');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isBooksCategory, setIsBooksCategory] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const productsPerPageOptions = [5, 10, 15, 20, 25];

  // Sort options
  const sortOptions = [
    { value: 'default', label: 'الافتراضي' },
    { value: 'price-asc', label: 'السعر: من الأقل إلى الأعلى' },
    { value: 'price-desc', label: 'السعر: من الأعلى إلى الأقل' },
    { value: 'title-asc', label: 'العنوان: أ-ي' },
    { value: 'title-desc', label: 'العنوان: ي-أ' },
  ];

  // Fetch categories and authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, authorsData] = await Promise.all([
          getCategories(),
          getAuthors(),
        ]);
        console.log('Fetched Categories:', categoriesData);
        console.log('Fetched Authors:', authorsData);
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Set active tab based on URL path or query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const authorId = searchParams.get('authorId');

    if (categoryId) {
      setFilters((prev) => ({ ...prev, categoryId }));
    }
    if (authorId) {
      setFilters((prev) => ({ ...prev, authorId }));
    }
  }, [location.search]);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Update isBooksCategory when category changes
  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat._id === filters.categoryId
    );
    console.log('Selected Category:', selectedCategory);
    console.log('Categories:', categories);
    console.log('Current filters:', filters);

    // Check if the selected category is "كتب" or "روايات"
    const isBooks =
      selectedCategory?.name === 'كتب' || selectedCategory?.name === 'روايات';
    console.log('Is Books Category:', isBooks);

    setIsBooksCategory(isBooks);
    if (!isBooks) {
      setFilters((prev) => ({ ...prev, authorId: '' }));
    }
  }, [filters.categoryId, categories]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiFilters = {
          ...filters,
          search: debouncedSearchTerm || undefined,
        };
        const productsData = await getProducts(apiFilters);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, debouncedSearchTerm]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    console.log('Category Changed:', newCategoryId);
    setFilters((prev) => ({ ...prev, categoryId: newCategoryId }));
    setCurrentPage(1);
  };

  // Handle author change
  const handleAuthorChange = (e) => {
    setFilters((prev) => ({ ...prev, authorId: e.target.value }));
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({ categoryId: '', authorId: '' });
    setSearchTerm('');
    setSortOption('default');
    setCurrentPage(1);
  };

  // Handle products per page change
  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setFilters((prev) => ({ ...prev, categoryId: '' }));
      setIsBooksCategory(false);
    } else {
      // Find the category ID based on the tab name
      const category = categories.find((cat) => {
        switch (tab) {
          case 'books':
            return cat.name === 'كتب' || cat.name === 'روايات';
          case 'dividers':
            return cat.name === 'فواصل';
          case 'candles':
            return cat.name === 'شموع';
          case 'cups':
            return cat.name === 'أكواب';
          case 'others':
            return cat.name === 'منتجات أخرى';
          default:
            return false;
        }
      });

      console.log('Selected Category for Tab:', category);

      if (category) {
        setFilters((prev) => ({ ...prev, categoryId: category._id }));
        setIsBooksCategory(tab === 'books');
      }
    }
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  return (
    <section className="py-16 px-4 bg-light-bg">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-tajawal font-bold text-center text-primary mb-4 sm:mb-6">
          منتجاتنا
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 overflow-x-auto">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-r-lg ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('all')}
            >
              جميع المنتجات
            </button>
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === 'books'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('books')}
            >
              الكتب
            </button>
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === 'dividers'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('dividers')}
            >
              فواصل الكتب
            </button>
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === 'candles'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('candles')}
            >
              شموع
            </button>
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === 'cups'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('cups')}
            >
              أكواب
            </button>
            <button
              type="button"
              className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-l-lg ${
                activeTab === 'others'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('others')}
            >
              منتجات أخرى
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن كتاب..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <i className="fas fa-search text-xs sm:text-sm"></i>
              </span>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.categoryId}
                onChange={handleCategoryChange}
                className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter - Only show when books category is selected */}
            {isBooksCategory && (
              <div>
                <select
                  value={filters.authorId}
                  onChange={handleAuthorChange}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">جميع المؤلفين</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Options */}
            <div>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-8">
            لا توجد منتجات متطابقة مع معايير البحث
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  available={product.quantity > 0}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    السابق
                  </button>

                  {getPageNumbers().map((number, index) =>
                    number === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-xs sm:text-sm">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${number}`}
                        onClick={() => paginate(number)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-md ${
                          currentPage === number
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    التالي
                  </button>
                </div>

                {/* Products Per Page Selector */}
                <div className="mt-3 flex items-center gap-1 text-xs sm:text-sm">
                  <span className="text-gray-600">عدد المنتجات:</span>
                  <select
                    value={productsPerPage}
                    onChange={handleProductsPerPageChange}
                    className="px-1 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm"
                  >
                    {productsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-2 text-center text-gray-600 text-xs sm:text-sm">
              عرض {indexOfFirstProduct + 1} -{' '}
              {Math.min(indexOfLastProduct, sortedProducts.length)} من{' '}
              {sortedProducts.length} منتج
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
