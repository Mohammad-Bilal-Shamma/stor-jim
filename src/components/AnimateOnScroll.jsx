import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AnimateOnScroll = ({ children, animation = 'fadeIn', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    fadeInUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    fadeInLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const selectedAnimation = animations[animation] || animations.fadeIn;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={selectedAnimation}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;