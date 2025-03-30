import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, User, Store, Menu, Sun, Moon, LogOut, ShoppingCart, Search, PackageSearch } from 'lucide-react';
import { useCaptain } from '../context/CaptainContext';
import { useUser } from '../context/userContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const location = useLocation();
  const { captain, logout: logoutCaptain } = useCaptain();
  const { user, logout: logoutUser } = useUser();

  const handleLogout = async () => {
    try {
      if (captain) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/logout`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.status === 200) {
          logoutCaptain();
        }
      } else if (user) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.status === 200) {
          logoutUser();
        }
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const renderAuthLinks = () => {
    if (captain) {
      return (
        <>
          <Link
            to="/shop/profile"
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Store className="h-5 w-5" />
            <span>Welcome, {captain.fullname.firstname}</span>
          </Link>
          <Link
            to="/shop/dashboard"
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Dashboard
          </Link>
        </>
      );
    } else if (user) {
      return (
        <>
          <Link
            to="/profile"
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <User className="h-5 w-5" />
            <span>Welcome, {user.fullname.firstname}</span>
          </Link>
          <Link
            to="/user/orders"
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>My Orders</span>
          </Link>
        </>
      );
    }
    return (
      <>
        <Link
          to="/user/login"
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <User className="h-5 w-5" />
          <span>User Login</span>
        </Link>
        <Link
          to="/shop/login"
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Store className="h-5 w-5" />
          <span>Shop Login</span>
        </Link>
      </>
    );
  };

  const protectedRoutes = ['/shop/dashboard', '/shop/profile'];

  const isDashboard = protectedRoutes.includes(location.pathname);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Pill className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MediConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!isDashboard && (
              <>
                <Link
                  to="/medicine-search"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Medicines</span>
                </Link>
                <Link
                  to="/order-tracking"
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <PackageSearch className="h-5 w-5" />
                  <span>Track Order</span>
                </Link>
              </>
            )}
            <div className="flex items-center space-x-4">
              {renderAuthLinks()}
              {(user || captain) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800">
            {!isDashboard && (
              <>
                <Link
                  to="/medicine-search"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Medicines</span>
                </Link>
                <Link
                  to="/order-tracking"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <PackageSearch className="h-5 w-5" />
                  <span>Track Order</span>
                </Link>
              </>
            )}
            {renderAuthLinks()}
            {(user || captain) && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                <span className="flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;