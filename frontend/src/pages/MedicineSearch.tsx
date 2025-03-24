import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg',
      price: 5.99,
      store: 'HealthCare Pharmacy',
      distance: '0.5 km',
      inStock: true,
    },
    {
      id: 2,
      name: 'Paracetamol 500mg',
      price: 6.49,
      store: 'MediCare Plus',
      distance: '1.2 km',
      inStock: true,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for medicines..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Search
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {searchResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{result.name}</h3>
                <p className="text-gray-600 mt-1">Available at: {result.store}</p>
                <div className="flex items-center mt-2 text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{result.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">₹{result.price}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                  result.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                Order for Delivery
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition duration-200">
                Pick Up
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineSearch;