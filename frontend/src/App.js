import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartButton } from './components/FloatingCartButton';

import Home from './pages/Home';
import Releases from './pages/Releases';
import Shows from './pages/Shows';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App min-h-screen flex flex-col bg-[#0A0A0A]">
      {!isAdminRoute && <Navigation />}
      <ScrollToTop />
      
      {/* Floating cart components */}
      <FloatingCartButton />
      <CartDrawer />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
