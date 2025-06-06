import React from 'react';

const Footer = () => {
  return (
    <footer id="footer" className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Contact Info */}
          <div className="w-full lg:w-1/3 text-center lg:text-right">
            <h3 className="text-xl font-bold mb-6 border-b border-secondary pb-2 inline-block">تواصل معنا</h3>
            <div className="space-y-4 mt-4">
              <p className="flex items-center justify-center lg:justify-end">
                <i className="fas fa-phone ml-3 text-secondary"></i>
                <span>+212 723-329765</span>
              </p>
              <p className="flex items-center justify-center lg:justify-end">
                <i className="fas fa-envelope ml-3 text-secondary"></i>
                <span>jimbook1310@gmail.com</span>
              </p>
              <p className="flex items-center justify-center lg:justify-end">
                <i className="fas fa-map-marker-alt ml-3 text-secondary"></i>
                <span>إدلب، سوريا</span>
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="w-full lg:w-1/3 text-center">
            <h3 className="text-xl font-bold mb-6 border-b border-secondary pb-2 inline-block">تابعنا على</h3>
            <div className="flex justify-center space-x-8 rtl:space-x-reverse mt-4">
              <a href="https://www.facebook.com/share/1AmgRPM7PU/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-3xl">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/jim_.books?igsh=aGZybXA0c3VrajB3" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-3xl">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="mailto:jimbook1310@gmail.com" className="hover:text-secondary transition-colors text-3xl">
                <i className="fas fa-envelope"></i>
              </a>
              <a href="https://wa.me/212723329765" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors text-3xl">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
            
          {/* Newsletter Subscription */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <h3 className="text-xl font-bold mb-6 border-b border-secondary pb-2 inline-block">النشرة البريدية</h3>
            <form className="flex flex-col sm:flex-row gap-2 mt-4 max-w-md mx-auto lg:mx-0">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-secondary flex-grow"
              />
              <button 
                type="submit" 
                className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-10 pt-6 border-t border-white/20">
          <p>© 2024 متجر جيم للكتب. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;