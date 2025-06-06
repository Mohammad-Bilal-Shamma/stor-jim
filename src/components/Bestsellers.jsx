import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/api';

const Bestsellers = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const products = await getProducts();
        // For now, we'll just take the first 6 products as bestsellers
        // In a real app, you might want to sort by sales or have a specific bestsellers endpoint
        setBestsellers(products.slice(0, 6));
        setError(null);
      } catch (err) {
        setError('Failed to fetch bestsellers');
        console.error('Error fetching bestsellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-tajawal font-bold text-center text-white mb-10">
            الأكثر مبيعاً
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-tajawal font-bold text-center text-white mb-10">
            الأكثر مبيعاً
          </h2>
          <div className="text-center text-white">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto">
        <h2
          className="text-3xl font-tajawal font-bold text-center text-white mb-10"
          id="section-title"
        >
          الأكثر مبيعاً
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {bestsellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bestsellers;
