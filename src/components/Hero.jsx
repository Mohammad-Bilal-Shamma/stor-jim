import React, { useEffect } from 'react';
import { ReactTyped } from 'react-typed';
import { motion } from 'framer-motion';
import bakImage from '../assets/Bak.jpg';

const Hero = () => {
  return (
    <section 
      className="text-white text-center py-24 px-4 relative bg-cover bg-center" 
      style={{
        backgroundImage: `url(${bakImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl font-tajawal font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.span 
            className="text-secondary"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            متجر 
          </motion.span>
          <ReactTyped
            strings={['جيم للكتب', 'جيم للقرطاسية', 'جيم للهدايا']}
            typeSpeed={100}
            backSpeed={50}
            loop
            className="text-primary bg-secondary bg-opacity-90 px-2 rounded"
          />
        </motion.h1>
        <motion.p 
          className="text-lg mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          نسعى لأن نجعل في كُلِ بيتٍ مكتبة 📚
        </motion.p>
        <motion.p 
          className="text-lg mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          جيم ، المتجر الأول لبيع الكتب و استعارتها في مُحافظة إدلب منذ عام 2023 
          بأسعار مُناسبة و هدايا مجّانية عند الطلب
        </motion.p>
        <motion.a 
          href="/books" 
          className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-accent transition-colors duration-300"
          whileHover={{ scale: 1.05, backgroundColor: "#8b5a2b" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          تصفح الكتب
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;