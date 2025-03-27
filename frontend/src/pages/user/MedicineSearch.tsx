import React from 'react';
import { Search } from 'lucide-react';

const MedicineSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Search Medicines</h1>
          <p className="mt-3 text-lg text-gray-500">
            Find medicines at nearby pharmacies
          </p>
        </div>

        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex shadow-sm rounded-md">
            <input
              type="text"
              placeholder="Enter medicine name..."
              className="flex-1 px-4 py-2 border-2 border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Pharmacies</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Map placeholder */}
            <div className="col-span-full bg-gray-200 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;