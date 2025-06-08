import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل بيانات المنتج');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'المنتج غير موجود'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
        >
          العودة للخلف
        </button>
      </div>
    );
  }

  const isAvailable = product.quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold mb-4 text-right">
              {product.title}
            </h1>

            <div className="mb-4 text-right">
              <p className="text-gray-600">
                {product.category.name}
                {product.author && ` - ${product.author.name}`}
              </p>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-right">الوصف</h2>
                <p className="text-gray-600 text-right">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-right">
                التفاصيل
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">السعر:</span>
                  <span className="text-primary font-bold text-xl">
                    {product.price} $
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الحالة:</span>
                  <span
                    className={`font-semibold ${
                      isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isAvailable
                      ? `متوفر (${product.quantity} قطعة)`
                      : 'غير متوفر'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              {isAvailable ? (
                <motion.button
                  onClick={() =>
                    addToCart({
                      id: product._id,
                      image: product.image,
                      title: product.title,
                      author: product.author?.name || product.category.name,
                      price: product.price,
                    })
                  }
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="fas fa-shopping-cart"></i>
                                <span>إضافة الى عربة التسوق</span>

                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={`/inquiry?title=${encodeURIComponent(
                      product.title
                    )}&author=${encodeURIComponent(
                      product.author?.name || product.category.name
                    )}`}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 px-6 rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-lg"
                  >
                    <i className="fas fa-question-circle"></i>
                    <span>استعلام عن المنتج</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
