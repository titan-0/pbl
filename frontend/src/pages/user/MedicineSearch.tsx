import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Plus, Navigation } from 'lucide-react';
import axios from 'axios';

interface MedicineResult {
  _id: string;
  medicineName: string;
  price: number;
  stock: number;
  shop: {
    shopname: string;
    shop_address: string;
    distance?: number;
  };
}

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: null,
    longitude: null
  });
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Get user location when component mounts
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Some features may be limited.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to search for medicines');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/medicines/search-nearest`,
        {
          medicine_name: searchQuery,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setResults(response.data.medicines);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to search medicines');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Search Medicines</h1>
          <p className="mt-3 text-lg text-gray-500">
            Find medicines at nearby pharmacies
          </p>
        </div>

        {locationError && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <div className="flex">
              <div className="flex-shrink-0">
                <Navigation className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{locationError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex shadow-sm rounded-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter medicine name..."
              className="flex-1 px-4 py-2 border-2 border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button 
              type="submit"
              disabled={isLoading || (!coordinates.latitude && !coordinates.longitude)}
              className="px-6 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              title={!coordinates.latitude ? "Waiting for location..." : ""}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((medicine) => (
                <div 
                  key={medicine._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {medicine.medicineName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Available at {medicine.shop.shopname}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        ₹{medicine.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {medicine.stock}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start text-sm text-gray-500">
                    <MapPin className="h-5 w-5 text-gray-400 shrink-0 mt-0.5 mr-2" />
                    <p>{medicine.shop.shop_address}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {medicine.shop.distance ? `${medicine.shop.distance.toFixed(1)} km away` : 'Distance not available'}
                      </span>
                    </div>
                    <button className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <div className="text-center text-gray-500 mt-8">
              No medicines found matching your search
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;