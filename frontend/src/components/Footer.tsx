import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  // Hide Footer for specific routes
if( location.pathname === '/shop/dashboard') {
    return null; // Completely hide the footer for the dashboard
  }

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">MediConnect</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connecting you with local pharmacies for convenient medicine delivery and pickup.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">For Pharmacies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/signup" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Join as Pharmacy
                </Link>
              </li>
              <li>
                <Link to="/shop/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Pharmacy Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Phone className="h-5 w-5" />
                <span>8007394462</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Mail className="h-5 w-5" />
                <span>support@mediconnect.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-5 w-5" />
                <span>Pict collage,Dhankawdi,Pune</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;