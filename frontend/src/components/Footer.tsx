import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MediConnect</h3>
            <p className="text-gray-600">
              Connecting you with local pharmacies for convenient medicine delivery and pickup.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">For Pharmacies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/signup" className="text-gray-600 hover:text-blue-600">
                  Join as Pharmacy
                </Link>
              </li>
              <li>
                <Link to="/shop/login" className="text-gray-600 hover:text-blue-600">
                  Pharmacy Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>support@mediconnect.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>123 Healthcare Ave</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;