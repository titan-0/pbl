import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, User, Store, Search, Package } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isUserPath = location.pathname.includes('user');
  const isShopPath = location.pathname.includes('shop');
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Pill className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">MediConnect</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {!isShopPath && (
              <>
                <Link to="/medicine-search" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <Search className="h-5 w-5" />
                  <span>Find Medicines</span>
                </Link>
                <Link to="/orders" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <Package className="h-5 w-5" />
                  <span>Track Orders</span>
                </Link>
              </>
            )}
            
            {!isUserPath && !isShopPath && (
              <div className="flex space-x-4">
                <Link to="/user-login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  <span>User Login</span>
                </Link>
                <Link to="/shop-login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <Store className="h-5 w-5" />
                  <span>Shop Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;