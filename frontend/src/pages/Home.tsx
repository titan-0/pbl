import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, MapPin, Truck } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Health, Delivered
          </h1>
          <p className="text-xl text-white mb-8">
            Connect with local pharmacies for medicine delivery or pickup
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/medicine-search"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition duration-300"
            >
              Search Medicines
            </Link>
            <Link
              to="/shop/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Register Your Pharmacy
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Medicine</h3>
              <p className="text-gray-600">
                Find your prescribed medicines easily
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Locate Pharmacy</h3>
              <p className="text-gray-600">
                Find nearby pharmacies with stock
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Delivery</h3>
              <p className="text-gray-600">
                Select delivery or pickup option
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Medicines</h3>
              <p className="text-gray-600">
                Receive medicines at your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are you a pharmacy owner?
          </h2>
          <p className="text-white text-lg mb-8">
            Join our network and expand your business reach
          </p>
          <Link
            to="/shop/signup"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;