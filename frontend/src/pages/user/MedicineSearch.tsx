import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Plus, Navigation, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/shopdataContext';

interface MedicineResult {
  shop_name: string;
  shop_address: string;
  medicine: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  };
  coordinates: [number, number];
  distance: string;
  duration: number;
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
  const navigate = useNavigate();
  const { setSelectedShop } = useShop();

  useEffect(() => {
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
      navigate('/user/login');
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
      setResults(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/user/login');
      } else {
        setError(err.response?.data?.message || 'Failed to search medicines');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlequery = (medicine: MedicineResult) => {
    setSelectedShop({
      shopName: medicine.shop_name,
      shopAddress: medicine.shop_address,
      latitude: medicine.coordinates[1],
      longitude: medicine.coordinates[0],
      medicine_name: searchQuery
    });
    navigate('/medicine-details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Find Your Medicines
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Search and compare medicine prices at pharmacies near you
          </p>
        </div>

        {locationError && (
          <div className="mt-6 max-w-xl mx-auto">
            <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Navigation className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="ml-3 text-sm text-amber-700">{locationError}</p>
            </div>
          </div>
        )}

        <div className="mt-8 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex shadow-lg rounded-full overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for medicines..."
                className="flex-1 px-6 py-4 text-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={isLoading || (!coordinates.latitude && !coordinates.longitude)}
                className="px-8 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title={!coordinates.latitude ? "Waiting for location..." : ""}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Search className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mt-6 max-w-xl mx-auto">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-12">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((medicine, index) => (
                <div 
                  key={index}
                  onClick={() => handlequery(medicine)}
                  className="bg-white rounded-2xl shadow-xl hover:shadow  -2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {medicine.medicine.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          {medicine.shop_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{medicine.medicine.price}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          In stock: {medicine.medicine.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="leading-tight">{medicine.shop_address}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="h-5 w-5 fill-current" />
                          <Star className="h-5 w-5 fill-current" />
                          <Star className="h-5 w-5 fill-current" />
                          <Star className="h-5 w-5 fill-current" />
                          <Star className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {medicine.distance ? `${medicine.distance} km away` : 'Distance not available'}
                        </span>
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No medicines found matching your search</p>
              <p className="mt-2 text-gray-500">Try searching with a different medicine name</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;