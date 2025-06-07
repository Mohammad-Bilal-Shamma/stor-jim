import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import logo from "../assets/logo-jim.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-primary to-secondary shadow-md fixed top-0 left-0 right-0 z-40">
        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-primary to-secondary shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <span className="font-tajawal font-semibold text-xl text-white">  </span>
              <button
                onClick={closeMobileMenu}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col space-y-4 text-right">
              <Link to="/" className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10" onClick={closeMobileMenu}>الرئيسية</Link>
              <Link to="/products" className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10" onClick={closeMobileMenu}>المنتجات</Link>
              <Link to="/inquiry" className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10" onClick={closeMobileMenu}>استعلام عن منتج</Link>
              <Link to="/about" className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10" onClick={closeMobileMenu}>من نحن</Link>
              <button 
                onClick={() => {
                  scrollToSection('testimonials');
                  closeMobileMenu();
                }} 
                className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10 text-right"
              >
                آراء عملائنا
              </button>
              <a href="#footer" className="text-white hover:text-gray-200 transition-colors text-lg py-2 border-b border-white/10" onClick={closeMobileMenu}>تواصل معنا</a>
            </div>

            <div className="pt-4">
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="ابحث عن كتاب..."
                  className="w-full px-4 py-2 rounded-lg text-right bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <i className="fas fa-search"></i>
                </button>
              </div>

              <button
                onClick={toggleCart}
                className="flex items-center justify-center gap-2 bg-white/10 text-white py-3 px-4 rounded-lg hover:bg-white/20 transition-colors"
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                <span className="font-medium">عربة التسوق</span>
                {cartItems.length > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        <div className="flex justify-between items-center max-w-[1203px] px-4 mx-auto">
          <div className="flex items-center p-2.5 text-white">
            <img src={logo} alt="JIM Store" className="h-[50px] rounded-full shadow-md ml-2.5" />
            <span className="font-tajawal font-light text-2xl text-white hidden lg:inline">متجر جيم </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4 rtl:space-x-reverse">
            <Link to="/" className="text-white hover:text-gray-200 transition-colors">الرئيسية</Link>
            <Link to="/products" className="text-white hover:text-gray-200 transition-colors">المنتجات</Link>
            <Link to="/inquiry" className="text-white hover:text-gray-200 transition-colors">استعلام عن منتج</Link>
            <Link to="/about" className="text-white hover:text-gray-200 transition-colors">من نحن</Link>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-white hover:text-gray-200 transition-colors"> آراء عملائنا    </button>
             
        
            <a href="#footer" className="text-white hover:text-gray-200 transition-colors">تواصل معنا</a>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث عن كتاب..."
                className="px-3 py-1 rounded-md text-right"
              />
              <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <button onClick={toggleCart} className="text-white relative">
              <i className="fas fa-shopping-cart"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {/* Hamburger Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
