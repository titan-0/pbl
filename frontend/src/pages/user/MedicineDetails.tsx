import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/shopdataContext';
import { ClockIcon } from '@heroicons/react/24/outline'; // Example icons

const MedicineDetails = () => {
  const { selectedShop } = useShop();
  const [medicineDetails, setMedicineDetails] = useState<any>(null); // Use 'any' or a more specific type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static price details (for UI demonstration)
  const staticPrice = {
    price: 15.50,
    mrp: 17.22,
    discount: 10,
    deliveryInfo: "Usually delivers in 1-2 days"
  };

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('http://localhost:5000/api/medicine-details', {
          medicine_name: selectedShop?.medicine_name
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          setError('No details found for the requested medicine.');
          return;
        }

        setMedicineDetails(response.data);
      } catch (err: any) {
        setError('Failed to fetch medicine details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedShop?.medicine_name) {
      fetchMedicineDetails();
    } else {
      setLoading(false);
      setError('Medicine name not provided.');
    }
  }, [selectedShop?.medicine_name]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>;
  }

  if (!selectedShop?.shopName) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Warning!</strong>
        <span className="block sm:inline">No shop information available</span>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {/* Header Section */}
      <header className="bg-teal-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold">{selectedShop.shopName}</h1>
          <p className="text-sm mt-1 opacity-80">Address: {selectedShop.shopAddress}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 md:w-1/3"> {/* Adjusted width for medium and larger screens */}
                <img
                  src="/medicine-placeholder.jpg"
                  alt={selectedShop?.medicine_name}
                  className="w-full h-auto object-cover rounded-lg border border-gray-200"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{selectedShop?.medicine_name}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{medicineDetails?.description}</p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-teal-600">₹{staticPrice.price}</span>
                  <span className="text-gray-500 line-through">MRP ₹{staticPrice.mrp}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    {staticPrice.discount}% OFF
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">*Inclusive of all taxes</p>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                  <Link
                    to="/map"
                    className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-700 text-white font-semibold rounded-md py-3 px-4 transition-colors duration-200 focus:outline-none focus:ring-teal-500 focus:ring-offset-2"
                  >
                    Pick up now
                  </Link>
                  <Link
                    to="/placeorder"
                    className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-700 text-white font-semibold rounded-md py-3 px-4 transition-colors duration-200 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Place order
                  </Link>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-4">
                  <ClockIcon className="h-5 w-5" />
                  <p className="text-sm">Delivery by <span className="font-medium">{staticPrice.deliveryInfo}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Uses, Limitations, Precautions Section */}
          <div className="bg-gray-50 p-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicineDetails?.uses && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Uses</h3>
                  <p className="text-gray-700 whitespace-pre-line text-sm">{medicineDetails.uses || 'No uses available.'}</p>
                </div>
              )}

              {medicineDetails?.limitations && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Limitations</h3>
                  <p className="text-gray-700 whitespace-pre-line text-sm">{medicineDetails.limitations || 'No limitations available.'}</p>
                </div>
              )}

              {medicineDetails?.precautions && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Precautions</h3>
                  <p className="text-gray-700 whitespace-pre-line text-sm">{medicineDetails.precautions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicineDetails;