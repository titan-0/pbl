import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, User, Store, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Pill className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/medicine-search" className="text-gray-600 hover:text-blue-600">
              Find Medicines
            </Link>
            <Link to="/order-tracking" className="text-gray-600 hover:text-blue-600">
              Track Order
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/user/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <User className="h-5 w-5" />
                <span>User Login</span>
              </Link>
              <Link to="/shop/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <Store className="h-5 w-5" />
                <span>Shop Login</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/medicine-search"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Find Medicines
            </Link>
            <Link
              to="/order-tracking"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Track Order
            </Link>
            <Link
              to="/user/login"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              User Login
            </Link>
            <Link
              to="/shop/login"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Shop Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;