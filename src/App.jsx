import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import AboutPage from './components/AboutPage';
import Bestsellers from './components/Bestsellers';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Inquiry from './components/Inquiry';
import DailyQuote from './components/DailyQuote';
import { CartProvider } from './context/CartContext';
import SyncNotification from './components/SyncNotification';
import NetworkStatus from './components/NetworkStatus';
import ChatWidget from './components/ChatWidget'; // Import the new component

function App() {
  return (
    <CartProvider>
      <div dir="rtl" className="font-tajawal min-h-screen flex flex-col">
        <NetworkStatus />
        <Navbar />
        <SyncNotification />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <DailyQuote />
                  <About />
                  <Bestsellers />
                  <Testimonials />
                </>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/books" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/inquiry" element={<Inquiry />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget /> {/* Add the ChatWidget component here */}
      </div>
    </CartProvider>
  );
}
export default App;
