import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UserLogin from './pages/user/Login';
import UserSignup from './pages/user/Signup';
import ShopLogin from './pages/shop/Login';
import ShopSignup from './pages/shop/Signup';
import MedicineSearch from './pages/user/MedicineSearch';
import OrderTracking from './pages/user/OrderTracking';
import UserProfile from './pages/user/Profile';
import ShopDashboard from './pages/shop/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/shop/login" element={<ShopLogin />} />
            <Route path="/shop/signup" element={<ShopSignup />} />
            <Route path="/medicine-search" element={<MedicineSearch />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/shop/dashboard" element={<ShopDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;