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
import ShopProfile from './pages/shop/profile';
import AddMedicine from './pages/shop/addmedicine';
import MedicineDetails from './pages/user/MedicineDetails';

function App() {
  // Check for user's preferred color scheme
  React.useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/shop/login" element={<ShopLogin />} />
            <Route path="/shop/profile" element={<ShopProfile />} />
            <Route path="/shop/add-medicine" element={<AddMedicine />} />
            <Route path="/shop/signup" element={<ShopSignup />} />
            <Route path="/medicine-search" element={<MedicineSearch />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/shop/dashboard" element={<ShopDashboard />} />
            <Route path="/medicine-details" element={<MedicineDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;